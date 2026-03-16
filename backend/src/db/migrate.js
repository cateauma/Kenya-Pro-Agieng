import "dotenv/config";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { pool } from "../config/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isConnectionError = (err) =>
  err?.code === "ENOTFOUND" ||
  err?.code === "ECONNREFUSED" ||
  err?.code === "ETIMEDOUT" ||
  err?.message?.includes("getaddrinfo");

async function migrate() {
  const sql = readFileSync(path.join(__dirname, "schema.sql"), "utf8");

  try {
    await pool.query(sql);
    console.log("Migration completed.");
    process.exit(0);
  } catch (err) {
    if (isConnectionError(err)) {
      const outPath = path.join(__dirname, "..", "..", "run-in-supabase.sql");
      writeFileSync(outPath, sql, "utf8");
      console.error("\nCould not reach the database from this machine (ENOTFOUND/connection error).\n");
      console.error("Run the migration in Supabase instead:");
      console.error("  1. Open Supabase Dashboard → SQL Editor");
      console.error("  2. Open this file and copy all its contents: backend/run-in-supabase.sql");
      console.error("  3. Paste in the SQL Editor and click Run\n");
      process.exit(1);
    }
    throw err;
  }
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
