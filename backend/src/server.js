import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import app from "./app.js";
import { pool } from "./config/db.js";
import { useJsonStore, getUsers, getUserByEmail, createUser as storeCreateUser, updateUserApprovalStatus } from "./store/json-store.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const PORT = process.env.PORT || 4000;

async function seedJsonStoreAdmin() {
  if (!useJsonStore()) return;
  const users = getUsers();
  if (users.some((u) => u.role === "admin")) return;
  const email = process.env.ADMIN_EMAIL || "admin@gmail.com";
  const password = process.env.ADMIN_PASSWORD || "12345678";
  if (getUserByEmail(email)) return;
  const hash = await bcrypt.hash(password, 12);
  const user = storeCreateUser({
    email,
    password_hash: hash,
    full_name: "Admin",
    phone_number: "",
    role: "admin",
  });
  updateUserApprovalStatus(user.id, "approved");
  console.log(`JSON store: admin user created (${email}). Use this to log in.`);
}

const server = app.listen(PORT, async () => {
  await seedJsonStoreAdmin();
  console.log(`KPAO running on http://localhost:${PORT}${process.env.NODE_ENV === "production" ? " (frontend + API)" : ""}`);
  if (useJsonStore()) console.log("Using JSON file storage (backend/data/store.json)");
});

process.on("SIGTERM", () => {
  server.close(() => pool.end().then(() => process.exit(0)));
});
