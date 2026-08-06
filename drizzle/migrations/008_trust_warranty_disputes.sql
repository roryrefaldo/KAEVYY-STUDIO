-- Migration 008: Trust, Warranty, and Disputes

DO $$ BEGIN
  CREATE TYPE warranty_status_enum AS ENUM ('ACTIVE', 'CLAIMED', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE warranty_ticket_status_enum AS ENUM ('OPEN', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE dispute_status_enum AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE dispute_resolution_enum AS ENUM ('FULL_REFUND', 'FULL_DEVELOPER_RELEASE', 'PARTIAL_SPLIT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  client_profile_id UUID REFERENCES client_profiles(id),
  developer_profile_id UUID REFERENCES developer_profiles(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Warranties Table (start_at strictly from project.completed_at)
CREATE TABLE IF NOT EXISTS warranties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  project_id UUID NOT NULL UNIQUE REFERENCES projects(id) ON DELETE CASCADE,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  status warranty_status_enum NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Warranty Tickets Table
CREATE TABLE IF NOT EXISTS warranty_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warranty_id UUID NOT NULL REFERENCES warranties(id) ON DELETE CASCADE,
  opened_by_client_id UUID REFERENCES client_profiles(id),
  title VARCHAR(200) NOT NULL,
  bug_description TEXT NOT NULL,
  status warranty_ticket_status_enum NOT NULL DEFAULT 'OPEN',
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Disputes Table
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  opened_by_user_id UUID REFERENCES users(id),
  client_profile_id UUID REFERENCES client_profiles(id),
  developer_profile_id UUID REFERENCES developer_profiles(id),
  reason TEXT NOT NULL,
  status dispute_status_enum NOT NULL DEFAULT 'OPEN',
  resolution_type dispute_resolution_enum,
  refund_amount NUMERIC(15, 2) DEFAULT 0.00,
  developer_release_amount NUMERIC(15, 2) DEFAULT 0.00,
  resolved_by_admin_user_id UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Dispute Evidence Table
CREATE TABLE IF NOT EXISTS dispute_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  submitted_by_user_id UUID REFERENCES users(id),
  statement TEXT,
  file_storage_key TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
