-- Migration 006: Financials and Escrow

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUND_PENDING', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_enum AS ENUM ('QRIS', 'VIRTUAL_ACCOUNT', 'E_WALLET', 'PAYPAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE escrow_status_enum AS ENUM ('HELD', 'RELEASE_PENDING', 'RELEASED', 'REFUNDED', 'DISPUTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Platform Fee Settings Table
CREATE TABLE IF NOT EXISTS platform_fee_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fee_percentage NUMERIC(5, 4) NOT NULL DEFAULT 0.1000,
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_user_id UUID REFERENCES users(id)
);

-- 2. Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount NUMERIC(15, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status payment_status_enum NOT NULL DEFAULT 'PENDING',
  payment_method_category payment_method_enum NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Payment Transactions Table
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_transaction_id VARCHAR(255),
  amount NUMERIC(15, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  raw_provider_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Escrow Records Table
CREATE TABLE IF NOT EXISTS escrow_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id),
  gross_amount NUMERIC(15, 2) NOT NULL,
  platform_fee_amount NUMERIC(15, 2) NOT NULL,
  net_developer_amount NUMERIC(15, 2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status escrow_status_enum NOT NULL DEFAULT 'HELD',
  locked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  released_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);
