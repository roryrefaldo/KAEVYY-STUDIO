-- Migration 003: Exchange Rates and Categories

-- 1. Service Categories Table
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon_name VARCHAR(50),
  display_order INTEGER NOT NULL DEFAULT 0
);

-- 2. Asset Categories Table
CREATE TABLE IF NOT EXISTS asset_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

-- 3. Exchange Rates Table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_currency VARCHAR(10) NOT NULL,
  quote_currency VARCHAR(10) NOT NULL,
  rate NUMERIC(18, 6) NOT NULL,
  effective_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source VARCHAR(100) DEFAULT 'MANUAL_ADMIN'
);

CREATE INDEX IF NOT EXISTS idx_exchange_rates_pair ON exchange_rates(base_currency, quote_currency, effective_at);
