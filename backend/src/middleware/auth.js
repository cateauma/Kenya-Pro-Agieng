import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { SCHEMA } from "../config/db.js";
import { useJsonStore, getUserById } from "../store/json-store.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-in-production";

/**
 * Verify JWT and attach req.user = { id, email, full_name, role, approval_status }.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (useJsonStore()) {
      const user = getUserById(decoded.userId);
      if (!user) return res.status(401).json({ error: "User not found" });
      req.user = { id: user.id, email: user.email, full_name: user.full_name, role: user.role, approval_status: user.approval_status };
      return next();
    }
    const result = await query(
      `SELECT id, email, full_name, role, approval_status FROM ${SCHEMA}.users WHERE id = $1`,
      [decoded.userId]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }
    req.user = result.rows[0];
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
}

/**
 * Require that the authenticated user has one of the allowed roles.
 * Use after requireAuth.
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Authentication required" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}

/**
 * Sign a JWT for a user (id, email, role).
 */
export function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}
