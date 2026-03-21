import { Router } from "express";
import { body, param } from "express-validator";
import { query } from "../config/db.js";
import { SCHEMA } from "../config/db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";
import { useJsonStore, getPrograms, getProgramById, createProgram, getTasksForProgram, createTask } from "../store/json-store.js";

const router = Router();

// GET /api/programs (with nested services or tasks)
router.get("/", requireAuth, async (req, res) => {
  try {
    if (useJsonStore()) {
      const programs = getPrograms().map((p) => ({
        ...p,
        services: [],
        tasks: getTasksForProgram(p.id),
      }));
      return res.json({ programs });
    }

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

// POST /api/programs - create program (Program Manager/Admin)
router.post(
  "/",
  requireAuth,
  requireRole("program_manager", "admin"),
  body("name").trim().notEmpty(),
  body("description").optional().trim(),
  body("region").optional().trim(),
  body("status").optional().isIn(["Active", "Completed", "Upcoming"]),
  body("start_date").optional().isISO8601(),
  body("end_date").optional().isISO8601(),
  body("budget").optional().isFloat({ min: 0 }),
  body("goals").optional().trim(),
  handleValidation,
  async (req, res) => {
    try {
      if (useJsonStore()) {
        const program = createProgram({
          ...req.body,
          manager_id: req.user.id,
        });
        return res.status(201).json(program);
      }

      const { name, description, region, status, start_date, end_date, budget, goals } = req.body;
      const result = await query(
        `INSERT INTO ${SCHEMA}.programs (name, description, region, status, start_date, end_date, budget, goals, manager_id)
         VALUES ($1, $2, $3, COALESCE($4, 'Active'), $5::date, $6::date, $7, $8, $9)
         RETURNING id, name, description, region, status, start_date, end_date, budget, goals, manager_id, created_at`,
        [name, description || "", region || "Nairobi", status, start_date || null, end_date || null, budget ?? null, goals || "", req.user.id]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create program" });
    }
  }
);

// GET /api/programs/:id
router.get(
  "/:id",
  requireAuth,
  param("id").isUUID(),
  handleValidation,
  async (req, res) => {
    try {
      const { id } = req.params;
      if (useJsonStore()) {
        const program = getProgramById(id);
        if (!program) return res.status(404).json({ error: "Program not found" });
        return res.json({
          ...program,
          tasks: getTasksForProgram(id),
        });
      }
      const program = await query(
        `SELECT p.id, p.name, p.description, p.manager_id, p.created_at
         FROM ${SCHEMA}.programs p
         WHERE p.id = $1`,
        [id]
      );
      if (program.rows.length === 0) return res.status(404).json({ error: "Program not found" });
      res.json(program.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch program" });
    }
  }
);

// POST /api/programs/:id/tasks - assign/create task under program (JSON store only for now)
router.post(
  "/:id/tasks",
  requireAuth,
  requireRole("program_manager", "admin"),
  param("id").isUUID(),
  body("title").trim().notEmpty(),
  body("description").optional().trim(),
  body("assignee_id").optional().isUUID(),
  body("priority").optional().isIn(["High", "Medium", "Low"]),
  body("status").optional().isIn(["Pending", "In Progress", "Completed"]),
  body("due_date").optional().isISO8601(),
  handleValidation,
  (req, res) => {
    try {
      if (!useJsonStore()) {
        return res.status(501).json({ error: "Tasks available only with JSON store in this demo." });
      }
      const program = getProgramById(req.params.id);
      if (!program) return res.status(404).json({ error: "Program not found" });
      const task = createTask({
        program_id: req.params.id,
        ...req.body,
      });
      res.status(201).json(task);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create task" });
    }
  }
);

export default router;
