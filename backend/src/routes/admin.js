import { Router } from "express";
import { param, body } from "express-validator";
import { query } from "../config/db.js";
import { SCHEMA } from "../config/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";
import {
  useJsonStore,
  getUsers,
  getPendingUsers,
  getUserByEmail,
  getUserById,
  createUser as storeCreateUser,
  updateUserApprovalStatus,
  addNotification as storeAddNotification,
  getDonations,
  getAllSignups,
  getOpportunityById,
  getAllServiceRequests,
  getServiceRequestById,
  getServiceById,
  updateServiceRequestStatus,
} from "../store/json-store.js";

const router = Router();
router.use(requireAuth, requireRole("admin"), handleValidation);

// GET /api/admin/pending-users
router.get("/pending-users", async (req, res) => {
  try {
    if (useJsonStore()) {
      const users = getPendingUsers();
      return res.json({ users });
    }
    const result = await query(
      `SELECT u.id, u.email, u.full_name, u.phone_number, u.role, u.approval_status, u.created_at
       FROM ${SCHEMA}.users u
       WHERE u.approval_status = 'pending'
       ORDER BY u.created_at DESC`
    );
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch pending users" });
  }
});

// PUT /api/admin/approve-user/:userId
router.put(
  "/approve-user/:userId",
  param("userId").isUUID(),
  handleValidation,
  async (req, res) => {
    try {
      const { userId } = req.params;
      if (useJsonStore()) {
        const user = updateUserApprovalStatus(userId, "approved");
        if (!user) return res.status(404).json({ error: "User not found or already processed" });
        storeAddNotification(userId, "Your account has been approved. You can now sign in.");
        return res.json({ user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role, approval_status: user.approval_status }, message: "User approved" });
      }
      const update = await query(
        `UPDATE ${SCHEMA}.users SET approval_status = 'approved', updated_at = now()
         WHERE id = $1 AND approval_status = 'pending'
         RETURNING id, email, full_name, role, approval_status`,
        [userId]
      );
      if (update.rows.length === 0) {
        return res.status(404).json({ error: "User not found or already processed" });
      }
      await query(
        `INSERT INTO ${SCHEMA}.notifications (user_id, message, type)
         VALUES ($1, 'Your account has been approved. You can now sign in.', 'approval')`,
        [userId]
      );
      res.json({ user: update.rows[0], message: "User approved" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to approve user" });
    }
  }
);

// PUT /api/admin/reject-user/:userId
router.put(
  "/reject-user/:userId",
  param("userId").isUUID(),
  handleValidation,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const reason = req.body.reason || "Your account has been rejected.";
      if (useJsonStore()) {
        const user = updateUserApprovalStatus(userId, "rejected");
        if (!user) return res.status(404).json({ error: "User not found or already processed" });
        storeAddNotification(userId, reason);
        return res.json({ user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role, approval_status: user.approval_status }, message: "User rejected" });
      }
      const update = await query(
        `UPDATE ${SCHEMA}.users SET approval_status = 'rejected', updated_at = now()
         WHERE id = $1 AND approval_status = 'pending'
         RETURNING id, email, full_name, role, approval_status`,
        [userId]
      );
      if (update.rows.length === 0) {
        return res.status(404).json({ error: "User not found or already processed" });
      }
      await query(
        `INSERT INTO ${SCHEMA}.notifications (user_id, message, type)
         VALUES ($1, $2, 'approval')`,
        [userId, reason]
      );
      res.json({ user: update.rows[0], message: "User rejected" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to reject user" });
    }
  }
);

// GET /api/admin/users
router.get("/users", async (req, res) => {
  try {
    if (useJsonStore()) {
      const users = getUsers({ role: req.query.role, approval_status: req.query.approval_status });
      return res.json({ users });
    }
    const { role, approval_status } = req.query;
    let sql = `SELECT u.id, u.email, u.full_name, u.phone_number, u.role, u.approval_status, u.created_at
               FROM ${SCHEMA}.users u WHERE 1=1`;
    const params = [];
    let n = 1;
    if (role) { sql += ` AND u.role = $${n}`; params.push(role); n++; }
    if (approval_status) { sql += ` AND u.approval_status = $${n}`; params.push(approval_status); n++; }
    sql += " ORDER BY u.created_at DESC";
    const result = await query(sql, params);
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST /api/admin/users - create user (admin only)
router.post(
  "/users",
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("full_name").trim().notEmpty().withMessage("Full name required"),
  body("phone_number").trim().notEmpty().withMessage("Phone number required"),
  body("role").trim().notEmpty().withMessage("Role required"),
  handleValidation,
  async (req, res) => {
    try {
      const { email, password, full_name, phone_number, role } = req.body;

      if (useJsonStore()) {
        if (getUserByEmail(email)) {
          return res.status(409).json({ error: "Email already exists" });
        }
        const bcrypt = (await import("bcrypt")).default;
        const password_hash = await bcrypt.hash(password, 12);
        const user = storeCreateUser({ email, password_hash, full_name, phone_number, role });
        // Admin-created users are approved immediately
        const approved = updateUserApprovalStatus(user.id, "approved") ?? user;
        return res.status(201).json({
          user: {
            id: approved.id,
            email: approved.email,
            full_name: approved.full_name,
            role: approved.role,
            approval_status: approved.approval_status,
            created_at: approved.created_at,
          },
        });
      }

      // DB path
      const existing = await query(`SELECT id FROM ${SCHEMA}.users WHERE email = $1`, [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: "Email already exists" });
      }
      const bcrypt = (await import("bcrypt")).default;
      const password_hash = await bcrypt.hash(password, 12);
      const result = await query(
        `INSERT INTO ${SCHEMA}.users (email, password_hash, full_name, phone_number, role, approval_status)
         VALUES ($1, $2, $3, $4, $5, 'approved')
         RETURNING id, email, full_name, role, approval_status, created_at`,
        [email, password_hash, full_name, phone_number, role]
      );
      return res.status(201).json({ user: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create user" });
    }
  }
);

// GET /api/admin/signups — all volunteer RSVPs for events/opportunities (JSON store)
router.get("/signups", async (req, res) => {
  try {
    if (!useJsonStore()) {
      return res.json({ signups: [], message: "Signups are available when using JSON store." });
    }
    const raw = getAllSignups();
    const signups = raw.map((s) => {
      const user = getUserById(s.volunteer_id);
      const opportunity = getOpportunityById(s.opportunity_id);
      return {
        id: s.id,
        created_at: s.created_at,
        volunteer_id: s.volunteer_id,
        volunteer_name: user?.full_name ?? "Unknown",
        volunteer_email: user?.email ?? "",
        opportunity_id: s.opportunity_id,
        opportunity_title: opportunity?.title ?? "Unknown",
        opportunity_date: opportunity?.date,
        opportunity_type: opportunity?.type ?? "opportunity",
        opportunity_location: opportunity?.location,
      };
    });
    res.json({ signups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch signups" });
  }
});

// GET /api/admin/service-requests — list (optional ?status=pending)
router.get("/service-requests", async (req, res) => {
  try {
    if (!useJsonStore()) {
      return res.json({ requests: [], message: "Service requests use JSON store." });
    }
    const status = req.query.status; // "pending" | "approved" | "rejected"
    const filter = status ? { status } : {};
    const raw = getAllServiceRequests(filter);
    const requests = raw.map((r) => {
      const beneficiary = getUserById(r.beneficiary_id);
      const service = getServiceById(r.service_id);
      return {
        ...r,
        beneficiary_name: beneficiary?.full_name ?? "Unknown",
        beneficiary_email: beneficiary?.email ?? "",
        service_name: service?.name ?? r.service_id,
      };
    });
    res.json({ requests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
});

// PUT /api/admin/service-requests/:id/approve
router.put(
  "/service-requests/:id/approve",
  param("id").isUUID(),
  handleValidation,
  async (req, res) => {
    try {
      if (!useJsonStore()) {
        return res.status(501).json({ error: "Not available" });
      }
      const r = getServiceRequestById(req.params.id);
      if (!r) return res.status(404).json({ error: "Request not found" });
      if (r.status !== "pending") {
        return res.status(400).json({ error: "Request already processed" });
      }
      const updated = updateServiceRequestStatus(req.params.id, "approved", req.user.id);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to approve" });
    }
  }
);

// PUT /api/admin/service-requests/:id/reject
router.put(
  "/service-requests/:id/reject",
  param("id").isUUID(),
  handleValidation,
  async (req, res) => {
    try {
      if (!useJsonStore()) {
        return res.status(501).json({ error: "Not available" });
      }
      const r = getServiceRequestById(req.params.id);
      if (!r) return res.status(404).json({ error: "Request not found" });
      if (r.status !== "pending") {
        return res.status(400).json({ error: "Request already processed" });
      }
      const updated = updateServiceRequestStatus(req.params.id, "rejected", req.user.id);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to reject" });
    }
  }
);

// GET /api/admin/stats/dashboard
router.get("/stats/dashboard", async (req, res) => {
  try {
    if (useJsonStore()) {
      const users = getUsers();
      const pending = getPendingUsers();
      const donations = getDonations();
      const totalAmount = donations.reduce((s, d) => s + (Number(d.amount) || 0), 0);
      return res.json({
        total_users: users.length,
        pending_approvals: pending.length,
        total_beneficiaries: 0,
        total_programs: 0,
        total_donations_count: donations.length,
        total_donations_amount: totalAmount,
      });
    }
    const [users, pending, beneficiaries, programs, donations] = await Promise.all([
      query(`SELECT COUNT(*)::int AS c FROM ${SCHEMA}.users`),
      query(`SELECT COUNT(*)::int AS c FROM ${SCHEMA}.users WHERE approval_status = 'pending'`),
      query(`SELECT COUNT(*)::int AS c FROM ${SCHEMA}.beneficiaries`),
      query(`SELECT COUNT(*)::int AS c FROM ${SCHEMA}.programs`),
      query(`SELECT COUNT(*)::int AS c, COALESCE(SUM(amount), 0)::float AS total FROM ${SCHEMA}.donations WHERE donation_type = 'monetary'`),
    ]);
    res.json({
      total_users: users.rows[0].c,
      pending_approvals: pending.rows[0].c,
      total_beneficiaries: beneficiaries.rows[0].c,
      total_programs: programs.rows[0].c,
      total_donations_count: donations.rows[0].c,
      total_donations_amount: parseFloat(donations.rows[0].total) || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
});

export default router;
