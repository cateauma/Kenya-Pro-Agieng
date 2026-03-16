# KPAO Backend API

RESTful API for Kenya Pro Aging Organization. Node.js, Express, PostgreSQL.

## Setup

1. **Install dependencies**
   ```bash
   cd backend && npm install
   ```

2. **Environment**
   ```bash
   cp .env.example .env
   ```
   Set `DATABASE_URL` (PostgreSQL, e.g. Supabase connection string), `JWT_SECRET`, and optionally `CORS_ORIGIN`, `PORT`.

3. **Database**
   Run the schema (creates `kpao` schema and all tables):
   ```bash
   npm run db:migrate
   ```
   If you get **`ENOTFOUND db.xxx.supabase.co`** (DNS/network from your machine), run the SQL from the Supabase Dashboard instead:
   ```bash
   npm run db:migrate:print
   ```
   Copy the printed SQL, open **Supabase Dashboard → SQL Editor**, paste and run it.

4. **Create admin user**
   ```bash
   ADMIN_EMAIL=admin@gmail.com ADMIN_PASSWORD=12345678 npm run db:seed-admin
   ```

5. **Run**
   ```bash
   npm run dev
   ```
   API: `http://localhost:4000`

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Register (pending approval). Beneficiaries require `id_number`, `location`, `date_of_birth`, `photo_url`. |
| POST | `/api/auth/login` | No | Login (returns JWT). Rejected if not approved. |
| GET | `/api/admin/pending-users` | Admin | List pending users |
| PUT | `/api/admin/approve-user/:userId` | Admin | Approve user |
| PUT | `/api/admin/reject-user/:userId` | Admin | Reject user (body: `reason` optional) |
| GET | `/api/admin/users` | Admin | List users (query: `role`, `approval_status`) |
| GET | `/api/admin/stats/dashboard` | Admin | Dashboard counts |
| GET | `/api/beneficiaries` | Admin, PM, Social Worker | List beneficiaries |
| GET | `/api/beneficiaries/:id` | Role-based | Get one beneficiary |
| POST | `/api/beneficiaries/:id/health-records` | Healthcare, Admin | Add health record |
| GET | `/api/beneficiaries/:id/services` | Role-based | Services for beneficiary |
| GET | `/api/programs` | Auth | Programs with nested services |
| POST | `/api/services/:serviceId/deliver` | Volunteer, Social Worker, PM, Admin | Log delivery |
| GET | `/api/donations/me` | Donor, Admin, Finance | My / all donations |
| POST | `/api/donations` | Donor, Admin, Finance | Create donation |
| GET | `/api/volunteers/me/hours` | Volunteer, Admin, PM | Volunteer hours |
| POST | `/api/volunteers/me/hours` | Volunteer | Log hours |
| GET | `/api/notifications` | Auth | My notifications |
| PATCH | `/api/notifications/:id/read` | Auth | Mark read |
| GET | `/api/info/about` | No | Static about |
| GET | `/api/info/contact` | No | Static contact |
| GET | `/api/health` | No | Health check |

**Auth:** Send `Authorization: Bearer <token>` for protected routes.

## Database schema

- **kpao.users** – Base users (email, password_hash, full_name, phone_number, role, approval_status).
- **kpao.beneficiaries** – Extended data for beneficiaries (id_number, location, date_of_birth, photo_url, etc.).
- **kpao.programs**, **kpao.services**, **kpao.service_delivery** – Programs and service delivery.
- **kpao.donations** – Donations (donor_id, amount, donation_type, item_description).
- **kpao.health_records** – Health records per beneficiary.
- **kpao.volunteer_hours** – Volunteer hour logs.
- **kpao.notifications** – In-app notifications.

All tables live in the `kpao` schema to avoid clashes with existing app tables.
