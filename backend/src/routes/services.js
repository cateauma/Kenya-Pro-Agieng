import { Router } from "express";
import { param, body } from "express-validator";
import { query } from "../config/db.js";
import { SCHEMA } from "../config/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";

const router = Router();

// POST /api/services/:serviceId/deliver - Log delivery (volunteer/social worker)
router.post(
  "/:serviceId/deliver",
  requireAuth,
  requireRole("volunteer", "social_worker", "program_manager", "admin"),
  param("serviceId").isUUID(),
  body("beneficiary_id").isUUID(),
  body("delivery_status").isIn(["scheduled", "completed", "missed"]),
  body("notes").optional().trim(),
  body("delivery_date").optional().isISO8601(),
  handleValidation,
  async (req, res) => {
    try {
      const { serviceId } = req.params;
      const { beneficiary_id, delivery_status, notes, delivery_date } = req.body;
      const serviceCheck = await query(`SELECT id FROM ${SCHEMA}.services WHERE id = $1`, [serviceId]);
      if (serviceCheck.rows.length === 0) {
        return res.status(404).json({ error: "Service not found" });
      }
      const beneficiaryCheck = await query(`SELECT id FROM ${SCHEMA}.beneficiaries WHERE id = $1`, [beneficiary_id]);
      if (beneficiaryCheck.rows.length === 0) {
        return res.status(404).json({ error: "Beneficiary not found" });
      }
      const insert = await query(
        `INSERT INTO ${SCHEMA}.service_delivery (service_id, beneficiary_id, delivered_by, delivery_status, notes, delivery_date)
         VALUES ($1, $2, $3, $4, $5, $6::timestamptz)
         RETURNING id, service_id, beneficiary_id, delivery_status, notes, delivery_date, created_at`,
        [serviceId, beneficiary_id, req.user.id, delivery_status, notes || null, delivery_date || new Date().toISOString()]
      );
      res.status(201).json(insert.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to log delivery" });
    }
  }
);

export default router;
