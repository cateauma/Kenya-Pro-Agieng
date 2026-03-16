import { Router } from "express";
import { body } from "express-validator";
import { query } from "../config/db.js";
import { SCHEMA } from "../config/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";

const router = Router();

// GET /api/donations/me - Donor views own history
router.get("/me", requireAuth, requireRole("donor", "admin", "finance_manager"), async (req, res) => {
  try {
    const isDonor = req.user.role === "donor";
    const sql = isDonor
      ? `SELECT d.id, d.amount, d.donation_type, d.item_description, d.date, d.created_at
         FROM ${SCHEMA}.donations d WHERE d.donor_id = $1 ORDER BY d.date DESC`
      : `SELECT d.id, d.donor_id, d.amount, d.donation_type, d.item_description, d.date, d.created_at,
                u.full_name AS donor_name
         FROM ${SCHEMA}.donations d
         JOIN ${SCHEMA}.users u ON u.id = d.donor_id
         ORDER BY d.date DESC`;
    const params = isDonor ? [req.user.id] : [];
    const result = await query(sql, params);
    res.json({ donations: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});

// POST /api/donations - Donor creates a donation record
router.post(
  "/",
  requireAuth,
  requireRole("donor", "admin", "finance_manager"),
  body("donation_type").isIn(["monetary", "in-kind"]),
  body("amount").optional().isFloat({ min: 0 }),
  body("item_description").optional().trim(),
  handleValidation,
  async (req, res) => {
    try {
      const { donation_type, amount, item_description } = req.body;
      const donorId = req.user.role === "donor" ? req.user.id : req.body.donor_id;
      if (!donorId && req.user.role !== "donor") {
        return res.status(400).json({ error: "donor_id required when creating on behalf of another" });
      }
      const effectiveDonorId = donorId || req.user.id;
      if (donation_type === "monetary" && (amount == null || amount < 0)) {
        return res.status(400).json({ error: "amount required for monetary donations" });
      }
      const insert = await query(
        `INSERT INTO ${SCHEMA}.donations (donor_id, amount, donation_type, item_description)
         VALUES ($1, $2, $3, $4)
         RETURNING id, donor_id, amount, donation_type, item_description, date`,
        [effectiveDonorId, donation_type === "monetary" ? amount : null, donation_type, item_description || null]
      );
      res.status(201).json(insert.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create donation" });
    }
  }
);

export default router;
