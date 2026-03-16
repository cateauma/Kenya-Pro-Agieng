import { Router } from "express";
import { body } from "express-validator";
import { query } from "../config/db.js";
import { SCHEMA } from "../config/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";
import { useJsonStore, getVolunteerSignups } from "../store/json-store.js";
import { getOpportunityById } from "../store/json-store.js";

const router = Router();

// GET /api/volunteers/me/signups — my event/opportunity signups (JSON store)
router.get("/me/signups", requireAuth, requireRole("volunteer"), (req, res) => {
  if (!useJsonStore()) {
    return res.json({ signups: [] });
  }
  const signups = getVolunteerSignups(req.user.id);
  const withOpportunity = signups.map((s) => ({
    ...s,
    opportunity: getOpportunityById(s.opportunity_id),
  }));
  res.json({ signups: withOpportunity });
});

// GET /api/volunteers/me/hours
router.get("/me/hours", requireAuth, requireRole("volunteer", "admin", "program_manager"), async (req, res) => {
  try {
    const volunteerId = req.user.role === "volunteer" ? req.user.id : req.query.volunteer_id;
    if (req.user.role !== "volunteer" && !volunteerId) {
      return res.status(400).json({ error: "volunteer_id required when not a volunteer" });
    }
    const id = volunteerId || req.user.id;
    const result = await query(
      `SELECT vh.id, vh.activity_description, vh.hours_logged, vh.date, vh.approved_by, vh.created_at,
              u.full_name AS approved_by_name
       FROM ${SCHEMA}.volunteer_hours vh
       LEFT JOIN ${SCHEMA}.users u ON u.id = vh.approved_by
       WHERE vh.volunteer_id = $1
       ORDER BY vh.date DESC`,
      [id]
    );
    res.json({ hours: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch volunteer hours" });
  }
});

// POST /api/volunteers/me/hours
router.post(
  "/me/hours",
  requireAuth,
  requireRole("volunteer"),
  body("activity_description").trim().notEmpty(),
  body("hours_logged").isFloat({ min: 0.01 }),
  body("date").isISO8601(),
  handleValidation,
  async (req, res) => {
    try {
      const { activity_description, hours_logged, date } = req.body;
      const insert = await query(
        `INSERT INTO ${SCHEMA}.volunteer_hours (volunteer_id, activity_description, hours_logged, date)
         VALUES ($1, $2, $3, $4::date)
         RETURNING id, activity_description, hours_logged, date, approved_by, created_at`,
        [req.user.id, activity_description, hours_logged, date]
      );
      res.status(201).json(insert.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to log hours" });
    }
  }
);

export default router;
