-- Migration 004: Services Catalog

DO $$ BEGIN
  CREATE TYPE pricing_type_enum AS ENUM ('FIXED', 'STARTING_FROM', 'CUSTOM_QUOTE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE service_status_enum AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Services Table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES service_categories(id),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  pricing_type pricing_type_enum NOT NULL DEFAULT 'FIXED',
  base_price NUMERIC(15, 2) NOT NULL,
  base_currency VARCHAR(10) NOT NULL DEFAULT 'IDR',
  minimum_price NUMERIC(15, 2),
  maximum_price NUMERIC(15, 2),
  estimated_delivery_days INTEGER NOT NULL,
  status service_status_enum NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_dev ON services(developer_profile_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);

-- 2. Service Price History Table
CREATE TABLE IF NOT EXISTS service_price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  old_price NUMERIC(15, 2) NOT NULL,
  new_price NUMERIC(15, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
