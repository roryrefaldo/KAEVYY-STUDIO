# KAEVY STUDIO — POSTGRESQL DATABASE IMPLEMENTATION PREPARATION PLAN v1.1.1

**Status**: Approved Technical Implementation Preparation Plan  
**Version**: 1.1.1  
**Target Engine**: PostgreSQL 16+  
**ORM Target**: Drizzle ORM / Node.js TypeScript  
**Architecture Source of Truth**: `/src/docs/DATABASE_ARCHITECTURE.md` (v1.1.0)  

---

## 1. CORRECTION SUMMARY (v1.1.0 → v1.1.1)

| Feature / Module | Version 1.1.0 Blueprint | Version 1.1.1 Corrected Implementation | Technical Rationale |
| :--- | :--- | :--- | :--- |
| **Developer Capacity Enforcement** | Naive status check trigger without explicit concurrency locks | Concurrency-safe PL/pgSQL function utilizing `SELECT ... FOR UPDATE` on `developer_profiles` | Prevents race conditions and double-assignment when multiple clients or admins trigger simultaneous order assignments. |
| **Authenticated Roles** | Included `PUBLIC` in role ENUMs | Strictly `CLIENT`, `DEVELOPER`, `ADMIN` | `PUBLIC` represents an unauthenticated visitor state handled at the router/session layer, not a database user credential. |
| **Admin Identity Model** | Ambiguous reference to `admin_profiles` | Option B: Unified identity via `users` + `user_roles` + `permissions` | Avoids redundant table overhead. Admin privileges and sub-permissions are managed through RBAC junction tables. |
| **Share Asset Uploader** | Foreign key `uploader_developer_profile_id` → `developer_profiles.id` | Foreign key `uploaded_by_user_id` → `users.id` | Allows authorized Admins and Developers to upload/manage assets without forcing Admins to create fake developer profiles. |
| **Payment Provider Decoupling** | Payment category mixed with provider fields | Strict separation of `payment_method` (`QRIS`, `VA`, `E_WALLET`, `PAYPAL`), `payment_provider` (`MIDTRANS`, `XENDIT`, `STRIPE`), and `provider_transaction_id` | Decouples product payment methods from third-party gateway providers. |
| **Monetary Currency Precision** | Uniform decimal handling | Explicit currency precision enforcement: `IDR` uses integer settlement (0 decimals); `USD` uses 2 decimals | Aligns database monetary values with standard financial settlement rules for Rupiah and US Dollars. |

---

## 2. ENUM DEFINITIONS

```sql
-- 1. Authenticated User Roles
CREATE TYPE user_role_enum AS ENUM ('CLIENT', 'DEVELOPER', 'ADMIN');

-- 2. User Account Statuses
CREATE TYPE user_status_enum AS ENUM ('ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED', 'REJECTED');

-- 3. Developer Verification & Tier Statuses
CREATE TYPE dev_verification_status_enum AS ENUM ('PENDING', 'VERIFIED', 'ELITE', 'REJECTED', 'SUSPENDED');
CREATE TYPE dev_tier_enum AS ENUM ('VERIFIED', 'ELITE');

-- 4. Service Pricing & Statuses
CREATE TYPE pricing_type_enum AS ENUM ('FIXED', 'STARTING_FROM', 'CUSTOM_QUOTE');
CREATE TYPE service_status_enum AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'REJECTED');

-- 5. Order Lifecycle Statuses
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

-- 6. Project & Milestone Execution Statuses
CREATE TYPE project_status_enum AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'UNDER_REVIEW', 'REVISION_REQUESTED', 'COMPLETED');
CREATE TYPE milestone_status_enum AS ENUM ('PENDING', 'SUBMITTED', 'APPROVED', 'REVISION_REQUESTED');

-- 7. Payment & Escrow Protection Statuses
CREATE TYPE payment_status_enum AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUND_PENDING', 'REFUNDED');
CREATE TYPE payment_method_enum AS ENUM ('QRIS', 'VIRTUAL_ACCOUNT', 'E_WALLET', 'PAYPAL');
CREATE TYPE escrow_status_enum AS ENUM ('HELD', 'RELEASE_PENDING', 'RELEASED', 'REFUNDED', 'DISPUTED');

-- 8. Share Asset Lifecycle & Visibility
CREATE TYPE asset_visibility_enum AS ENUM ('PUBLIC', 'PRIVATE', 'ADMIN_ONLY');
CREATE TYPE asset_status_enum AS ENUM ('DRAFT', 'PENDING_SCAN', 'PENDING_MODERATION', 'APPROVED', 'REJECTED', 'HIDDEN', 'REMOVED');
CREATE TYPE scan_status_enum AS ENUM ('PENDING', 'SCANNING', 'PASSED', 'FLAGGED', 'FAILED');

-- 9. Guarantee, Warranty & Dispute Statuses
CREATE TYPE warranty_status_enum AS ENUM ('ACTIVE', 'CLAIMED', 'EXPIRED');
CREATE TYPE warranty_ticket_status_enum AS ENUM ('OPEN', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'EXPIRED');
CREATE TYPE dispute_status_enum AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED');
CREATE TYPE dispute_resolution_enum AS ENUM ('FULL_REFUND', 'FULL_DEVELOPER_RELEASE', 'PARTIAL_SPLIT');
```

---

## 3. MIGRATION DEPENDENCY ORDER

The migration sequence follows strict foreign key DAG (Directed Acyclic Graph) constraints:

```
01_identity_and_rbac (users, roles, user_roles, permissions, role_permissions)
 └─> 02_profiles_and_preferences (client_profiles, developer_profiles, dev_verification_submissions, user_preferences)
      └─> 03_exchange_rates_and_categories (exchange_rates, service_categories, asset_categories)
           └─> 04_services_catalog (services, service_price_history)
                └─> 05_orders_and_projects (orders, order_items, projects, project_milestones, project_files, order_events)
                     └─> 06_financials_and_escrow (platform_fee_settings, payments, payment_transactions, escrow_records)
                          └─> 07_share_asset_system (assets, asset_files, asset_documentation_blocks, asset_tags, asset_tag_relations, asset_downloads, asset_security_scans, asset_moderation_reviews)
                               └─> 08_trust_warranty_disputes (reviews, warranties, warranty_tickets, disputes, dispute_evidence)
                                    └─> 09_communications_and_notifications (conversations, conversation_members, messages, notifications)
                                         └─> 10_governance_and_audit (audit_logs, capacity_enforcement_triggers)
```

---

## 4. CONCURRENCY-SAFE DEVELOPER CAPACITY ENFORCEMENT

To prevent race conditions during simultaneous order assignments, capacity is checked and enforced inside a PostgreSQL transaction using row-level locking (`FOR UPDATE`).

### Active Capacity Definition
An order consumes developer capacity when its status is in:
`'DEVELOPER_ASSIGNED'`, `'IN_PROGRESS'`, `'REVISION'`

### Capacity Limits:
- **VERIFIED Developer**: Max 3 active projects
- **ELITE Developer**: Max 5 active projects

### PL/pgSQL Function with Explicit Row-Level Locking
```sql
CREATE OR REPLACE FUNCTION check_developer_capacity()
RETURNS TRIGGER AS $$
DECLARE
  v_dev_tier dev_tier_enum;
  v_max_capacity INTEGER;
  v_active_count INTEGER;
  v_dev_profile_id UUID;
BEGIN
  -- Determine target developer profile ID
  v_dev_profile_id := NEW.developer_profile_id;

  -- Exit early if no developer is assigned to this order
  IF v_dev_profile_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Only check when transition involves an active status
  IF NEW.status IN ('DEVELOPER_ASSIGNED', 'IN_PROGRESS', 'REVISION') THEN
    
    -- 1. CRITICAL: Acquire row-level write lock on developer profile to serialize assignments
    SELECT developer_tier INTO v_dev_tier
    FROM developer_profiles
    WHERE id = v_dev_profile_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Developer profile % not found.', v_dev_profile_id;
    END IF;

    -- Set capacity threshold based on tier
    IF v_dev_tier = 'ELITE' THEN
      v_max_capacity := 5;
    ELSE
      v_max_capacity := 3;
    END IF;

    -- 2. Calculate current active project count excluding the order being updated
    SELECT COUNT(*) INTO v_active_count
    FROM orders
    WHERE developer_profile_id = v_dev_profile_id
      AND status IN ('DEVELOPER_ASSIGNED', 'IN_PROGRESS', 'REVISION')
      AND id <> COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);

    -- 3. Enforce strict capacity limit
    IF (v_active_count + 1) > v_max_capacity THEN
      RAISE EXCEPTION 'Developer capacity exceeded: % has % active projects (Max allowed: %). Reassignment or new ticket rejected.',
        v_dev_profile_id, v_active_count, v_max_capacity;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger binding for INSERT and UPDATE on orders
CREATE TRIGGER trg_enforce_developer_capacity
BEFORE INSERT OR UPDATE OF status, developer_profile_id ON orders
FOR EACH ROW
EXECUTE FUNCTION check_developer_capacity();
```

---

## 5. MONETARY CURRENCY PRECISION & RULES

Monetary fields use PostgreSQL `NUMERIC(15, 2)` to preserve exact precision without floating-point distortion.

### Currency Rules:
1. **IDR (Indonesian Rupiah)**: Settlement values must be whole integers (zero decimals). Example: `5000000.00`
2. **USD (US Dollar)**: Settlement values support standard 2 decimal places. Example: `320.50`

### Validation Check Constraint
```sql
ALTER TABLE orders ADD CONSTRAINT chk_orders_currency_precision CHECK (
  (currency_snapshot = 'IDR' AND budget_amount_snapshot = TRUNC(budget_amount_snapshot))
  OR
  (currency_snapshot = 'USD')
);
```

---

## 6. COMPLETE SEED DATA PLAN

Seed data establishes initial platform configuration and QA test accounts:

```sql
-- 1. Roles & Permissions Seed
INSERT INTO roles (id, code, name, description) VALUES
  ('10000000-0000-0000-0000-000000000001', 'CLIENT', 'Client', 'Can order services, message developers, view warranty'),
  ('10000000-0000-0000-0000-000000000002', 'DEVELOPER', 'Developer', 'Can list services, fulfill orders, upload assets'),
  ('10000000-0000-0000-0000-000000000003', 'ADMIN', 'Admin', 'Platform administration, verification, escrow & disputes');

-- 2. Service Categories Seed
INSERT INTO service_categories (id, name, slug, description, icon_name, display_order) VALUES
  ('20000000-0000-0000-0000-000000000001', 'Lua / Luau Scripting', 'lua-scripting', 'Backend game logic, Datastores, Anti-cheat', 'Code2', 1),
  ('20000000-0000-0000-0000-000000000002', 'Environment / Map Building', 'map-building', 'PBR maps, terrain, architecture', 'Map', 2),
  ('20000000-0000-0000-0000-000000000003', 'UI/UX Interface Systems', 'ui-ux', 'Animated HUDs, shop menus, responsive UI', 'Layout', 3),
  ('20000000-0000-0000-0000-000000000004', '3D Modeling & Assets', '3d-modeling', 'Low-poly & high-detail Roblox mesh models', 'Box', 4);

-- 3. Initial Exchange Rate Seed (USD/IDR)
INSERT INTO exchange_rates (id, base_currency, quote_currency, rate, source) VALUES
  ('30000000-0000-0000-0000-000000000001', 'USD', 'IDR', 16200.000000, 'INITIAL_CONFIG');

-- 4. Initial Platform Fee Seed (10%)
INSERT INTO platform_fee_settings (id, fee_percentage) VALUES
  ('40000000-0000-0000-0000-000000000001', 0.1000);
```

---

## 7. RISKS & MITIGATIONS

| Risk Factor | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Deadlocks under High Assignment Traffic** | High database transaction lock contention | Use explicit lock ordering: always lock `developer_profiles` before inserting or updating `orders`. Keep triggers fast and execution blocks short. |
| **Historical Price Snapshot Mutation** | Critical financial & accounting discrepancy | Disallow direct update queries on `orders.budget_amount_snapshot` and `orders.platform_fee_amount_snapshot` once payment status reaches `'PAID'`. |
| **Stale Exchange Rate Conversion** | Minor currency conversion variance | Freeze `exchange_rate_snapshot` on order creation so client checkout amounts remain locked regardless of market rate fluctuations. |
| **Orphaned File References** | Unused storage utilization in S3/GCS | Execute asynchronous garbage collection jobs for `asset_files` and `project_files` with `deleted_at` timestamps older than 30 days. |

---

## 8. OPEN DECISIONS

1. **Auth Session Management**: The app uses `AuthContext` with client-side session persistence. When migrating to PostgreSQL backend, session storage can leverage either database-backed `user_sessions` or JWT access/refresh tokens with a Redis blacklist.
2. **Automated Security Scanning Integration**: The `asset_security_scans` table supports automated AST parsing. A Node.js worker service using `luaparse` can populate scan outputs upon upload.
