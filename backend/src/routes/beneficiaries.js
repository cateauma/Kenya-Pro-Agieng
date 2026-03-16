import { Router } from "express";
import { param, body } from "express-validator";
import { query } from "../config/db.js";
import { SCHEMA } from "../config/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";

const router = Router();

// GET /api/beneficiaries - Admin, Program Manager, Social Worker
router.get(
  "/",
  requireAuth,
  requireRole("admin", "program_manager", "social_worker"),
  async (req, res) => {
    try {
      const result = await query(
        `SELECT u.id, u.email, u.full_name, u.phone_number, u.role, u.approval_status, u.created_at,
                b.id_number, b.location, b.date_of_birth, b.photo_url, b.emergency_contact, b.inua_jamii_enrolled
         FROM ${SCHEMA}.users u
         JOIN ${SCHEMA}.beneficiaries b ON b.id = u.id
         ORDER BY u.full_name`
      );
      res.json({ beneficiaries: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch beneficiaries" });
    }
  }
);

// GET /api/beneficiaries/:id (role-based: admin, pm, social_worker, healthcare, or self)
router.get(
  "/:id",
  requireAuth,
  param("id").isUUID(),
  handleValidation,
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await query(
        `SELECT u.id, u.email, u.full_name, u.phone_number, u.role, u.approval_status, u.created_at,
                b.id_number, b.location, b.date_of_birth, b.photo_url, b.emergency_contact, b.inua_jamii_enrolled
         FROM ${SCHEMA}.users u
         JOIN ${SCHEMA}.beneficiaries b ON b.id = u.id
         WHERE u.id = $1`,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Beneficiary not found" });
      }
      const user = req.user;
      if (user.role !== "admin" && user.role !== "program_manager" && user.role !== "social_worker" && user.role !== "healthcare_coordinator" && user.id !== id) {
        return res.status(403).json({ error: "Access denied" });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch beneficiary" });
    }
  }
);

// POST /api/beneficiaries/:id/health-records - Healthcare Coordinator
router.post(
  "/:id/health-records",
  requireAuth,
  requireRole("healthcare_coordinator", "admin"),
  param("id").isUUID(),
  body("record_type").isIn(["blood_pressure", "blood_sugar", "weight", "general_note"]),
  body("value").trim().notEmpty(),
  handleValidation,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { record_type, value } = req.body;
      const beneficiaryCheck = await query(`SELECT id FROM ${SCHEMA}.beneficiaries WHERE id = $1`, [id]);
      if (beneficiaryCheck.rows.length === 0) {
        return res.status(404).json({ error: "Beneficiary not found" });
      }
      const insert = await query(
        `INSERT INTO ${SCHEMA}.health_records (beneficiary_id, recorded_by, record_type, value)
         VALUES ($1, $2, $3, $4)
         RETURNING id, beneficiary_id, record_type, value, recorded_at`,
        [id, req.user.id, record_type, value]
      );
      res.status(201).json(insert.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create health record" });
    }
  }
);

// GET /api/beneficiaries/:id/services
router.get(
  "/:id/services",
  requireAuth,
  param("id").isUUID(),
  handleValidation,
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user;
      if (user.role !== "admin" && user.role !== "program_manager" && user.role !== "social_worker" && user.id !== id) {
        return res.status(403).json({ error: "Access denied" });
      }
      const result = await query(
        `SELECT sd.id, sd.delivery_status, sd.notes, sd.delivery_date, sd.created_at,
                s.name AS service_name, s.scheduled_date, s.location AS service_location,
                p.name AS program_name
         FROM ${SCHEMA}.service_delivery sd
         JOIN ${SCHEMA}.services s ON s.id = sd.service_id
         JOIN ${SCHEMA}.programs p ON p.id = s.program_id
         WHERE sd.beneficiary_id = $1
         ORDER BY sd.delivery_date DESC NULLS LAST, sd.created_at DESC`,
        [id]
      );
      res.json({ services: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  }
);

export default router;
