-- Migration 002: Profiles and Preferences

DO $$ BEGIN
  CREATE TYPE dev_verification_status_enum AS ENUM ('PENDING', 'VERIFIED', 'ELITE', 'REJECTED', 'SUSPENDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE dev_tier_enum AS ENUM ('VERIFIED', 'ELITE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Client Profiles Table
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  discord_username VARCHAR(100),
  whatsapp_number VARCHAR(30),
  company_name VARCHAR(150),
  total_orders_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Developer Profiles Table
CREATE TABLE IF NOT EXISTS developer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  specialization VARCHAR(100) NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  portfolio_url TEXT,
  verification_status dev_verification_status_enum NOT NULL DEFAULT 'PENDING',
  developer_tier dev_tier_enum NOT NULL DEFAULT 'VERIFIED',
  active_project_capacity INTEGER NOT NULL DEFAULT 3,
  cached_completed_orders INTEGER NOT NULL DEFAULT 0,
  cached_average_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dev_verification_status ON developer_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_dev_specialization ON developer_profiles(specialization);

-- 3. Developer Verification Submissions Table
CREATE TABLE IF NOT EXISTS developer_verification_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_profile_id UUID NOT NULL REFERENCES developer_profiles(id) ON DELETE CASCADE,
  portfolio_links TEXT[] NOT NULL,
  specialization VARCHAR(100) NOT NULL,
  submission_notes TEXT,
  status dev_verification_status_enum NOT NULL DEFAULT 'PENDING',
  rejection_reason TEXT,
  reviewed_by_user_id UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  language VARCHAR(10) NOT NULL DEFAULT 'id',
  display_currency VARCHAR(10) NOT NULL DEFAULT 'IDR',
  timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
