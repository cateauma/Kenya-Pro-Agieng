/**
 * One-time seed: create an admin user if none exists.
 * Usage: ADMIN_EMAIL=admin@gmail.com ADMIN_PASSWORD=12345678 node src/db/seed-admin.js
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { query } from "../config/db.js";
import { SCHEMA } from "../config/db.js";

const email = process.env.ADMIN_EMAIL || "admin@gmail.com";
const password = process.env.ADMIN_PASSWORD || "12345678";

async function seed() {
  const existing = await query(`SELECT id FROM ${SCHEMA}.users WHERE role = 'admin' LIMIT 1`);
  if (existing.rows.length > 0) {
    console.log("Admin user already exists.");
    process.exit(0);
    return;
  }
  const password_hash = await bcrypt.hash(password, 12);
  await query(
    `INSERT INTO ${SCHEMA}.users (email, password_hash, full_name, phone_number, role, approval_status)
     VALUES ($1, $2, $3, $4, 'admin', 'approved')`,
    [email, password_hash, "Admin", ""]
  );
  console.log(`Admin user created: ${email}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
