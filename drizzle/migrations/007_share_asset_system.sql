-- Migration 007: Share Asset System

DO $$ BEGIN
  CREATE TYPE asset_visibility_enum AS ENUM ('PUBLIC', 'PRIVATE', 'ADMIN_ONLY');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE asset_status_enum AS ENUM ('DRAFT', 'PENDING_SCAN', 'PENDING_MODERATION', 'APPROVED', 'REJECTED', 'HIDDEN', 'REMOVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE scan_status_enum AS ENUM ('PENDING', 'SCANNING', 'PASSED', 'FLAGGED', 'FAILED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Assets Table
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES asset_categories(id),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  version VARCHAR(20) NOT NULL DEFAULT '1.0.0',
  license VARCHAR(50) DEFAULT 'MIT',
  visibility asset_visibility_enum NOT NULL DEFAULT 'PUBLIC',
  status asset_status_enum NOT NULL DEFAULT 'PENDING_SCAN',
  downloads_count INTEGER NOT NULL DEFAULT 0,
  rating_average NUMERIC(3, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_uploader ON assets(uploaded_by_user_id);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_visibility ON assets(visibility);

-- 2. Asset Files Table (Max 500MB = 524288000 bytes)
CREATE TABLE IF NOT EXISTS asset_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  storage_key TEXT NOT NULL,
  checksum_sha256 VARCHAR(64),
  version VARCHAR(20) DEFAULT '1.0.0',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_asset_file_size CHECK (file_size_bytes <= 524288000)
);

-- 3. Asset Documentation Blocks Table (Position 1..10)
CREATE TABLE IF NOT EXISTS asset_documentation_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  content TEXT NOT NULL,
  position_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_asset_doc_position CHECK (position_order BETWEEN 1 AND 10)
);

CREATE INDEX IF NOT EXISTS idx_asset_doc_order ON asset_documentation_blocks(asset_id, position_order);

-- 4. Asset Tags Table
CREATE TABLE IF NOT EXISTS asset_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tag_name VARCHAR(50) NOT NULL UNIQUE
);

-- 5. Asset Tag Relations Table
CREATE TABLE IF NOT EXISTS asset_tag_relations (
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES asset_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (asset_id, tag_id)
);

-- 6. Asset Downloads Table
CREATE TABLE IF NOT EXISTS asset_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Asset Security Scans Table
CREATE TABLE IF NOT EXISTS asset_security_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_file_id UUID NOT NULL REFERENCES asset_files(id) ON DELETE CASCADE,
  scan_status scan_status_enum NOT NULL DEFAULT 'PENDING',
  ast_lua_issues_found JSONB DEFAULT '[]'::JSONB,
  scanned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Asset Moderation Reviews Table
CREATE TABLE IF NOT EXISTS asset_moderation_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  reviewed_by_user_id UUID REFERENCES users(id),
  decision VARCHAR(30) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
