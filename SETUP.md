# Database & Admin Setup (Supabase)

The app uses **Supabase** for auth and PostgreSQL storage. The connection string you have is for direct Postgres (e.g. migrations or server-side). For the **frontend** you need the **Project URL** and **Anon key** from the Supabase dashboard.

## 1. Get API credentials

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Go to **Project Settings** → **API**.
3. Copy:
   - **Project URL** (e.g. `https://cmfdcuxqrjkzcrkamhrx.supabase.co`)
   - **anon public** key (under "Project API keys").

## 2. Configure the app

Create a `.env` file in the project root (see `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and set:

- `VITE_SUPABASE_URL` = your Project URL
- `VITE_SUPABASE_ANON_KEY` = your anon public key

## 3. Run the database migration

1. In Supabase Dashboard go to **SQL Editor**.
2. Open `supabase/migrations/001_initial.sql` from this repo and run its contents.
3. This creates `profiles` and `donations` and RLS policies.

## 4. Create the admin user

1. In Supabase go to **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email: `admin@gmail.com`
3. Password: `12345678`
4. Leave "Auto Confirm User" **on** (so the user can sign in without email confirmation).

After the first login with `admin@gmail.com`, the app will create a profile row with role `admin` if it doesn’t exist.

## 5. (Optional) Confirm admin profile

If you prefer to create the admin profile by hand after creating the user:

1. In **SQL Editor** run (replace `USER_UUID` with the new user’s id from Authentication → Users):

```sql
INSERT INTO public.profiles (id, email, name, role, status)
VALUES ('USER_UUID', 'admin@gmail.com', 'Admin', 'admin', 'approved')
ON CONFLICT (id) DO UPDATE SET role = 'admin', status = 'approved';
```

## Summary

- **Login:** `admin@gmail.com` / `12345678` (after creating the user in Supabase Auth).
- **Data:** Users and approvals use `profiles`; donations use `donations`. Both are stored in your Supabase Postgres.
- **Demo mode:** If `.env` is missing or keys are placeholders, the app falls back to mock data and demo logins (Quick Demo Access buttons on the login page).

---

## Backend API (Node.js + Express + PostgreSQL)

A separate REST API lives in **`backend/`** and uses the same PostgreSQL (e.g. same Supabase DB) with a **`kpao`** schema so it does not conflict with the frontend tables.

- **Setup:** See **`backend/README.md`**.
- **Quick start:**  
  `cd backend` → `cp .env.example .env` → set `DATABASE_URL` (e.g. your Supabase connection string), `JWT_SECRET` → `npm run db:migrate` → `ADMIN_EMAIL=admin@gmail.com ADMIN_PASSWORD=12345678 npm run db:seed-admin` → `npm run dev`.
- **Endpoints:** Auth (register/login with approval workflow), admin (pending users, approve/reject, users list, dashboard stats), beneficiaries, programs, services, donations, volunteer hours, notifications, and public info (about, contact). All protected routes use JWT and role-based access.
- **Storage:** All data is stored in PostgreSQL tables under the `kpao` schema (users, beneficiaries, programs, services, service_delivery, donations, health_records, volunteer_hours, notifications).
