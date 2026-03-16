import { Router } from "express";
import { query } from "../config/db.js";
import { SCHEMA } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/programs (with nested services)
router.get("/", requireAuth, async (req, res) => {
  try {
    const programs = await query(
      `SELECT p.id, p.name, p.description, p.manager_id, p.created_at,
              u.full_name AS manager_name
       FROM ${SCHEMA}.programs p
       LEFT JOIN ${SCHEMA}.users u ON u.id = p.manager_id
       ORDER BY p.name`
    );
    const services = await query(
      `SELECT s.id, s.program_id, s.name, s.scheduled_date, s.location
       FROM ${SCHEMA}.services s
       ORDER BY s.scheduled_date DESC NULLS LAST`
    );
    const byProgram = services.rows.reduce((acc, s) => {
      if (!acc[s.program_id]) acc[s.program_id] = [];
      acc[s.program_id].push(s);
      return acc;
    }, {});
    const result = programs.rows.map((p) => ({
      ...p,
      services: byProgram[p.id] || [],
    }));
    res.json({ programs: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch programs" });
  }
});

export default router;
