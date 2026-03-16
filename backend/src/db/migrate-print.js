/**
 * Print migration SQL to stdout. Use when DATABASE_URL is unreachable (e.g. ENOTFOUND).
 * Copy the output and run it in Supabase Dashboard → SQL Editor.
 *
 * Usage: npm run db:migrate:print
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(path.join(__dirname, "schema.sql"), "utf8");
console.log(sql);
