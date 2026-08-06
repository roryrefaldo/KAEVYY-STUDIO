-- Migration 010: Governance, Audit, and PL/pgSQL Triggers/Functions

-- 1. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  justification_reason TEXT NOT NULL,
  metadata_json JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Audit Log Immutability Safeguard Trigger
CREATE OR REPLACE FUNCTION prevent_audit_log_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable. UPDATE and DELETE operations are strictly forbidden.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_log_mutation ON audit_logs;
CREATE TRIGGER trg_prevent_audit_log_mutation
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_log_mutation();

-- 3. Developer Capacity Enforcement Trigger (FOR UPDATE concurrency-safe lock)
CREATE OR REPLACE FUNCTION check_developer_capacity()
RETURNS TRIGGER AS $$
DECLARE
  v_dev_tier dev_tier_enum;
  v_max_capacity INTEGER;
  v_active_count INTEGER;
  v_dev_profile_id UUID;
BEGIN
  v_dev_profile_id := NEW.developer_profile_id;

  IF v_dev_profile_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Only check when transition involves an active status
  IF NEW.status IN ('DEVELOPER_ASSIGNED', 'IN_PROGRESS', 'REVISION') THEN
    
    -- Acquire row-level write lock on developer_profiles
    SELECT developer_tier INTO v_dev_tier
    FROM developer_profiles
    WHERE id = v_dev_profile_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Developer profile % not found.', v_dev_profile_id;
    END IF;

    IF v_dev_tier = 'ELITE' THEN
      v_max_capacity := 5;
    ELSE
      v_max_capacity := 3;
    END IF;

    SELECT COUNT(*) INTO v_active_count
    FROM orders
    WHERE developer_profile_id = v_dev_profile_id
      AND status IN ('DEVELOPER_ASSIGNED', 'IN_PROGRESS', 'REVISION')
      AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);

    IF (v_active_count + 1) > v_max_capacity THEN
      RAISE EXCEPTION 'Developer capacity exceeded: % has % active projects (Max allowed for tier %: %). Reassignment or new active order rejected.',
        v_dev_profile_id, v_active_count, v_dev_tier, v_max_capacity;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_enforce_developer_capacity ON orders;
CREATE TRIGGER trg_enforce_developer_capacity
BEFORE INSERT OR UPDATE OF status, developer_profile_id ON orders
FOR EACH ROW
EXECUTE FUNCTION check_developer_capacity();

-- 4. Developer Tier Downgrade Safeguard Trigger
CREATE OR REPLACE FUNCTION prevent_admin_tier_downgrade_over_capacity()
RETURNS TRIGGER AS $$
DECLARE
  v_active_count INTEGER;
BEGIN
  IF OLD.developer_tier = 'ELITE' AND NEW.developer_tier = 'VERIFIED' THEN
    SELECT COUNT(*) INTO v_active_count
    FROM orders
    WHERE developer_profile_id = NEW.id
      AND status IN ('DEVELOPER_ASSIGNED', 'IN_PROGRESS', 'REVISION');

    IF v_active_count > 3 THEN
      RAISE EXCEPTION 'Cannot downgrade Developer % from ELITE to VERIFIED: Developer currently has % active projects (Max allowed for VERIFIED: 3). Resolve active orders first.',
        NEW.id, v_active_count;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_tier_downgrade_over_capacity ON developer_profiles;
CREATE TRIGGER trg_prevent_tier_downgrade_over_capacity
BEFORE UPDATE OF developer_tier ON developer_profiles
FOR EACH ROW
EXECUTE FUNCTION prevent_admin_tier_downgrade_over_capacity();

-- 5. Automatic Warranty Creation on Project Completion Trigger
CREATE OR REPLACE FUNCTION create_warranty_on_project_completion()
RETURNS TRIGGER AS $$
DECLARE
  v_start_at TIMESTAMPTZ;
  v_end_at TIMESTAMPTZ;
BEGIN
  IF NEW.status = 'COMPLETED' AND (OLD.status IS NULL OR OLD.status <> 'COMPLETED') THEN
    IF NEW.completed_at IS NULL THEN
      NEW.completed_at := NOW();
    END IF;

    v_start_at := NEW.completed_at;
    v_end_at := v_start_at + INTERVAL '30 days';

    INSERT INTO warranties (id, order_id, project_id, start_at, end_at, status, created_at)
    VALUES (
      gen_random_uuid(),
      NEW.order_id,
      NEW.id,
      v_start_at,
      v_end_at,
      'ACTIVE',
      NOW()
    )
    ON CONFLICT (order_id) DO UPDATE SET
      start_at = EXCLUDED.start_at,
      end_at = EXCLUDED.end_at,
      status = 'ACTIVE';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_project_warranty_on_completion ON projects;
CREATE TRIGGER trg_project_warranty_on_completion
AFTER INSERT OR UPDATE OF status, completed_at ON projects
FOR EACH ROW
EXECUTE FUNCTION create_warranty_on_project_completion();
