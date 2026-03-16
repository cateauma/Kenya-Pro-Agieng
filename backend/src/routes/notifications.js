import { Router } from "express";
import { param } from "express-validator";
import { query } from "../config/db.js";
import { SCHEMA } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import { handleValidation } from "../middleware/validate.js";

const router = Router();

// GET /api/notifications - Current user's notifications
router.get("/", requireAuth, async (req, res) => {
  try {
    const result = await query(
      `SELECT id, message, type, is_read, created_at
       FROM ${SCHEMA}.notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [req.user.id]
    );
    res.json({ notifications: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// PATCH /api/notifications/:id/read - Mark as read
router.patch("/:id/read", requireAuth, param("id").isUUID(), handleValidation, async (req, res) => {
  try {
    const result = await query(
      `UPDATE ${SCHEMA}.notifications SET is_read = true
       WHERE id = $1 AND user_id = $2
       RETURNING id, is_read`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update notification" });
  }
});

export default router;
