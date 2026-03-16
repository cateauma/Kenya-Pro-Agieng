-- Kenya Pro Aging Organization - Backend schema
-- Run this in Supabase SQL Editor or via: psql $DATABASE_URL -f src/db/schema.sql

CREATE SCHEMA IF NOT EXISTS kpao;

-- Roles and status enums
CREATE TYPE kpao.user_role AS ENUM (
  'admin', 'program_manager', 'social_worker', 'healthcare_coordinator',
  'finance_manager', 'donor', 'beneficiary', 'caregiver', 'volunteer'
);

CREATE TYPE kpao.approval_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TYPE kpao.donation_type_enum AS ENUM ('monetary', 'in-kind');

CREATE TYPE kpao.delivery_status_enum AS ENUM ('scheduled', 'completed', 'missed');

CREATE TYPE kpao.record_type_enum AS ENUM ('blood_pressure', 'blood_sugar', 'weight', 'general_note');

CREATE TYPE kpao.notification_type_enum AS ENUM ('approval', 'service_reminder', 'general');

-- Base users table (all roles)
CREATE TABLE kpao.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  role kpao.user_role NOT NULL,
  approval_status kpao.approval_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON kpao.users(email);
CREATE INDEX idx_users_approval_status ON kpao.users(approval_status);
CREATE INDEX idx_users_role ON kpao.users(role);

-- Beneficiaries (extends users where role = 'beneficiary')
CREATE TABLE kpao.beneficiaries (
  id UUID PRIMARY KEY REFERENCES kpao.users(id) ON DELETE CASCADE,
  id_number TEXT UNIQUE NOT NULL,
  location TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  photo_url TEXT NOT NULL,
  emergency_contact TEXT,
  inua_jamii_enrolled BOOLEAN NOT NULL DEFAULT false
);

-- Programs
CREATE TABLE kpao.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  manager_id UUID REFERENCES kpao.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Services (under programs)
CREATE TABLE kpao.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES kpao.programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ,
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Service delivery (who received what, who delivered)
CREATE TABLE kpao.service_delivery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES kpao.services(id) ON DELETE CASCADE,
  beneficiary_id UUID NOT NULL REFERENCES kpao.beneficiaries(id) ON DELETE CASCADE,
  delivered_by UUID NOT NULL REFERENCES kpao.users(id),
  delivery_status kpao.delivery_status_enum NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  delivery_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Donations
CREATE TABLE kpao.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID NOT NULL REFERENCES kpao.users(id),
  amount DECIMAL(14, 2),
  donation_type kpao.donation_type_enum NOT NULL,
  item_description TEXT,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_donations_donor ON kpao.donations(donor_id);

-- Health records
CREATE TABLE kpao.health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beneficiary_id UUID NOT NULL REFERENCES kpao.beneficiaries(id) ON DELETE CASCADE,
  recorded_by UUID NOT NULL REFERENCES kpao.users(id),
  record_type kpao.record_type_enum NOT NULL,
  value TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_health_records_beneficiary ON kpao.health_records(beneficiary_id);

-- Volunteer hours
CREATE TABLE kpao.volunteer_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID NOT NULL REFERENCES kpao.users(id),
  activity_description TEXT NOT NULL,
  hours_logged DECIMAL(5, 2) NOT NULL,
  date DATE NOT NULL,
  approved_by UUID REFERENCES kpao.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_volunteer_hours_volunteer ON kpao.volunteer_hours(volunteer_id);

-- Notifications
CREATE TABLE kpao.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES kpao.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  type kpao.notification_type_enum NOT NULL DEFAULT 'general',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON kpao.notifications(user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION kpao.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON kpao.users
  FOR EACH ROW EXECUTE PROCEDURE kpao.set_updated_at();

CREATE TRIGGER programs_updated_at
  BEFORE UPDATE ON kpao.programs
  FOR EACH ROW EXECUTE PROCEDURE kpao.set_updated_at();

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON kpao.services
  FOR EACH ROW EXECUTE PROCEDURE kpao.set_updated_at();

CREATE TRIGGER service_delivery_updated_at
  BEFORE UPDATE ON kpao.service_delivery
  FOR EACH ROW EXECUTE PROCEDURE kpao.set_updated_at();

CREATE TRIGGER volunteer_hours_updated_at
  BEFORE UPDATE ON kpao.volunteer_hours
  FOR EACH ROW EXECUTE PROCEDURE kpao.set_updated_at();
