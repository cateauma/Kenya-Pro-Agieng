import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Use kpao schema for all backend tables
const SCHEMA = "kpao";

export { pool, SCHEMA };

const LOG_DB =
  process.env.LOG_DB === "1" ||
  process.env.LOG_DB === "true" ||
  (process.env.NODE_ENV === "development" && process.env.LOG_DB !== "0" && process.env.LOG_DB !== "false");

function safeParam(value) {
  if (value == null) return value;
  const s = String(value);
  if (s.length > 60 || /^\$2[ab]\$/.test(s)) return "[REDACTED]";
  return s;
}

function logQuery(text, params) {
  if (!LOG_DB) return;
  const preview = text.replace(/\s+/g, " ").trim().slice(0, 120);
  const safeParams = params ? params.map((p, i) => safeParam(p)) : [];
  console.log("[DB]", preview + (text.length > 120 ? "..." : ""));
  if (safeParams.length) console.log("[DB] params:", safeParams);
}

export async function query(text, params) {
  logQuery(text, params);
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    if (LOG_DB && result.rowCount != null && result.rowCount >= 0) {
      console.log("[DB] rows affected:", result.rowCount);
      if (result.rows?.length > 0 && result.rows.length <= 5) {
        console.log("[DB] rows:", JSON.stringify(result.rows, (_, v) => (v != null && typeof v === "object" && !(v instanceof Date) ? v : String(v)), 2).slice(0, 500));
      }
    }
    return result;
  } finally {
    client.release();
  }
}
