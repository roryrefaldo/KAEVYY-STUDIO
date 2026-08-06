-- Migration 005: Orders and Projects

DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM (
    'PENDING_REVIEW',
    'WAITING_PAYMENT',
    'PAID',
    'DEVELOPER_ASSIGNED',
    'IN_PROGRESS',
    'SUBMITTED',
    'REVISION',
    'COMPLETED',
    'WARRANTY',
    'DISPUTE',
    'CANCELLED',
    'REFUNDED'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE project_status_enum AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'UNDER_REVIEW', 'REVISION_REQUESTED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE milestone_status_enum AS ENUM ('PENDING', 'SUBMITTED', 'APPROVED', 'REVISION_REQUESTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  client_profile_id UUID REFERENCES client_profiles(id),
  developer_profile_id UUID REFERENCES developer_profiles(id),
  service_id UUID REFERENCES services(id),
  status order_status_enum NOT NULL DEFAULT 'PENDING_REVIEW',
  title_snapshot VARCHAR(200) NOT NULL,
  description_snapshot TEXT NOT NULL,
  budget_amount_snapshot NUMERIC(15, 2) NOT NULL,
  currency_snapshot VARCHAR(10) NOT NULL,
  exchange_rate_snapshot NUMERIC(18, 6) NOT NULL DEFAULT 1.000000,
  platform_fee_rate_snapshot NUMERIC(5, 4) NOT NULL,
  platform_fee_amount_snapshot NUMERIC(15, 2) NOT NULL,
  deadline_days INTEGER NOT NULL,
  target_delivery_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_dev ON orders(developer_profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Currency Precision Constraint: IDR must be whole integers (zero decimals)
ALTER TABLE orders DROP CONSTRAINT IF EXISTS chk_orders_currency_precision;
ALTER TABLE orders ADD CONSTRAINT chk_orders_currency_precision CHECK (
  (currency_snapshot = 'IDR' AND budget_amount_snapshot = TRUNC(budget_amount_snapshot))
  OR
  (currency_snapshot = 'USD')
);

-- 2. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  title VARCHAR(200) NOT NULL,
  unit_price_snapshot NUMERIC(15, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  scope_description TEXT
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  developer_profile_id UUID REFERENCES developer_profiles(id),
  client_profile_id UUID REFERENCES client_profiles(id),
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  status project_status_enum NOT NULL DEFAULT 'NOT_STARTED',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Project Milestones Table
CREATE TABLE IF NOT EXISTS project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  percentage INTEGER NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  status milestone_status_enum NOT NULL DEFAULT 'PENDING',
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  revision_notes TEXT
);

-- 5. Project Files Table
CREATE TABLE IF NOT EXISTS project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES project_milestones(id),
  uploaded_by_user_id UUID REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  storage_key TEXT NOT NULL,
  version VARCHAR(20) DEFAULT '1.0',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Order Events Table
CREATE TABLE IF NOT EXISTS order_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  actor_user_id UUID REFERENCES users(id),
  event_type VARCHAR(50) NOT NULL,
  metadata_json JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
