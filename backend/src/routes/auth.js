import { Router } from "express";
import bcrypt from "bcrypt";
import { body } from "express-validator";
import { query } from "../config/db.js";
import { SCHEMA } from "../config/db.js";
import { requireAuth, signToken } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";
import {
  useJsonStore,
  getUserByEmail,
  createUser as storeCreateUser,
  createBeneficiary as storeCreateBeneficiary,
  addNotification as storeAddNotification,
} from "../store/json-store.js";

const router = Router();
const ROLES = [
  "admin", "program_manager", "social_worker", "healthcare_coordinator",
  "finance_manager", "donor", "beneficiary", "caregiver", "volunteer",
];

const registerValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("full_name").trim().notEmpty().withMessage("Full name required"),
  body("phone_number").trim().notEmpty().withMessage("Phone number required"),
  body("role").isIn(ROLES).withMessage("Valid role required"),
  body("id_number").optional().trim(),
  body("location").optional().trim(),
  body("date_of_birth").optional().trim(),
  body("photo_url").optional().trim(),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

// POST /api/auth/register
router.post(
  "/register",
  registerValidation,
  handleValidation,
  async (req, res) => {
    try {
      const { email, password, full_name, phone_number, role, id_number, location, date_of_birth, photo_url } = req.body;

      if (role === "beneficiary") {
        if (!id_number?.trim() || !location?.trim() || !date_of_birth?.trim()) {
          return res.status(400).json({
            error: "Beneficiary registration requires id_number, location, and date_of_birth",
          });
        }
      }
      const beneficiaryPhotoUrl = role === "beneficiary" ? (photo_url?.trim() || "pending") : null;

      if (useJsonStore()) {
        if (getUserByEmail(email)) {
          return res.status(409).json({ error: "Email already registered" });
        }
        const password_hash = await bcrypt.hash(password, 12);
        const user = storeCreateUser({ email, password_hash, full_name, phone_number, role });
        if (role === "beneficiary") {
          storeCreateBeneficiary({ id: user.id, id_number, location, date_of_birth, photo_url: beneficiaryPhotoUrl });
        }
        storeAddNotification(user.id, "Your account has been created. It is awaiting admin approval. You will be notified once approved.");
        return res.status(201).json({
          message: "Registration successful. Your account is pending approval.",
          user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role, approval_status: user.approval_status },
        });
      }

      const existing = await query(`SELECT id FROM ${SCHEMA}.users WHERE email = $1`, [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const password_hash = await bcrypt.hash(password, 12);
      const result = await query(
        `INSERT INTO ${SCHEMA}.users (email, password_hash, full_name, phone_number, role, approval_status)
         VALUES ($1, $2, $3, $4, $5, 'pending')
         RETURNING id, email, full_name, role, approval_status, created_at`,
        [email, password_hash, full_name, phone_number, role]
      );
      const user = result.rows[0];

      if (role === "beneficiary") {
        await query(
          `INSERT INTO ${SCHEMA}.beneficiaries (id, id_number, location, date_of_birth, photo_url)
           VALUES ($1, $2, $3, $4, $5)`,
          [user.id, id_number, location, date_of_birth, beneficiaryPhotoUrl]
        );
      }

      await query(
        `INSERT INTO ${SCHEMA}.notifications (user_id, message, type)
         VALUES ($1, $2, 'approval')`,
        [user.id, "Your account has been created. It is awaiting admin approval. You will be notified once approved."]
      );

      res.status(201).json({
        message: "Registration successful. Your account is pending approval.",
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          approval_status: user.approval_status,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Registration failed" });
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  loginValidation,
  handleValidation,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      let user;
      if (useJsonStore()) {
        user = getUserByEmail(email);
        if (!user) return res.status(401).json({ error: "Invalid email or password" });
      } else {
        const result = await query(
          `SELECT id, email, full_name, role, approval_status, password_hash FROM ${SCHEMA}.users WHERE email = $1`,
          [email]
        );
        if (result.rows.length === 0) return res.status(401).json({ error: "Invalid email or password" });
        user = result.rows[0];
      }

      if (user.approval_status === "rejected") {
        return res.status(403).json({ error: "Your account has been rejected. Contact support if you believe this is an error." });
      }
      if (user.approval_status !== "approved") {
        return res.status(403).json({ error: "Your account is pending approval. You will be notified once an admin approves it." });
      }

      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) return res.status(401).json({ error: "Invalid email or password" });

      const token = signToken(user);
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          approval_status: user.approval_status,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Login failed" });
    }
  }
);

// GET /api/auth/me - current user from JWT (for frontend session restore)
router.get("/me", requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      full_name: req.user.full_name,
      role: req.user.role,
      approval_status: req.user.approval_status,
    },
  });
});

export default router;
