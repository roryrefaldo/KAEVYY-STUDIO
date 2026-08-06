# KAEVY STUDIO — POSTGRESQL & DRIZZLE DATABASE IMPLEMENTATION

**Version**: 1.1.1  
**Status**: Implemented & Tested  
**Target Engine**: PostgreSQL 16+  
**ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`)  

---

## 1. ARCHITECTURE OVERVIEW & FOUNDATION

The database layer for **KAEVY STUDIO** is structured using modular TypeScript schema files under `/src/db/schema/` and executed via standard PostgreSQL migration files under `/drizzle/migrations/`.

### Directory Structure
```
/src/db/
├── index.ts               # Database connection abstraction (pg Pool + Drizzle ORM)
├── utils.ts               # Currency, capacity, escrow, warranty, and documentation helpers
├── seed.ts                # Development & QA database seed script
├── schema/                # Drizzle ORM modular entity definitions
│   ├── enums.ts           # PostgreSQL ENUM declarations
│   ├── identity.ts        # Users, Roles, Permissions, UserRoles, RolePermissions
│   ├── profiles.ts        # ClientProfiles, DeveloperProfiles, Submissions, Preferences
│   ├── services.ts        # Categories, Services, PriceHistory, ExchangeRates
│   ├── orders.ts          # Orders, OrderItems, Projects, Milestones, ProjectFiles, Events
│   ├── financials.ts      # FeeSettings, Payments, PaymentTransactions, EscrowRecords
│   ├── shareAssets.ts     # Assets, AssetFiles, DocBlocks, Tags, Downloads, Scans, Reviews
│   ├── trust.ts           # Reviews, Warranties, WarrantyTickets, Disputes, Evidence
│   ├── communication.ts   # Conversations, Members, Messages, Notifications
│   ├── audit.ts           # AuditLogs (Append-only)
│   ├── relations.ts       # Drizzle relational mappings
│   └── index.ts           # Central schema exporter
└── tests/
    └── dbRules.test.ts    # Executable rule validation suite (TEST A - TEST L)
```

---

## 2. ENVIRONMENT CONFIGURATION

Declare `DATABASE_URL` in `.env`:
```env
# .env.example
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgres://postgres:postgres@localhost:5432/kaevystudio
```

---

## 3. MIGRATIONS DEPENDENCY ORDER

Migration files in `/drizzle/migrations/` follow strict Directed Acyclic Graph (DAG) constraints:

1. `001_identity_and_rbac.sql`: Base authentication entities & role-based access control.
2. `002_profiles_and_preferences.sql`: Client/Developer profiles and user UI preferences.
3. `003_exchange_rates_and_categories.sql`: Marketplace & asset category taxonomies and FX rate history.
4. `004_services_catalog.sql`: Services catalog, base prices, and service price mutation history.
5. `005_orders_and_projects.sql`: Order lifecycle snapshots, projects, milestones, and IDR/USD currency check constraints.
6. `006_financials_and_escrow.sql`: Payment transactions, gateway payment provider decoupling, and escrow holding records.
7. `007_share_asset_system.sql`: Asset uploader (`uploaded_by_user_id` -> `users.id`), 500MB file size limits, documentation block bounds (1..10).
8. `008_trust_warranty_disputes.sql`: Reviews (1..5 stars), 30-day warranties, warranty tickets, and disputes.
9. `009_communications_and_notifications.sql`: Order conversations, messages, and user notification feeds.
10. `010_governance_and_audit.sql`: Append-only audit log triggers, row-locking developer capacity enforcement (`FOR UPDATE`), admin tier downgrade safeguards, and automatic completion warranty triggers.

---

## 4. CONCURRENCY & BUSINESS RULES

1. **Developer Capacity Enforcement**:
   - `VERIFIED`: Max 3 active projects (`DEVELOPER_ASSIGNED`, `IN_PROGRESS`, `REVISION`).
   - `ELITE`: Max 5 active projects.
   - Handled via `trg_enforce_developer_capacity` using `SELECT ... FOR UPDATE` write lock on `developer_profiles`.

2. **Admin Tier Downgrade Safeguard**:
   - `trg_prevent_tier_downgrade_over_capacity` blocks tier downgrade (`ELITE` -> `VERIFIED`) if the developer currently holds more than 3 active projects.

3. **Monetary & Pricing Snapshots**:
   - `orders.budget_amount_snapshot`, `platform_fee_rate_snapshot`, and `exchange_rate_snapshot` remain frozen on order creation. Subsequent service price or platform fee changes do not modify historical order snapshots.
   - `IDR`: Whole integer amounts (zero decimals).
   - `USD`: Standard 2 decimal places.

4. **30-Day Warranty Trigger**:
   - `trg_project_warranty_on_completion` automatically creates a 30-day warranty starting strictly from `project.completed_at`.

5. **Audit Log Immutability**:
   - `trg_prevent_audit_log_mutation` raises an exception on any attempt to `UPDATE` or `DELETE` rows from `audit_logs`.

---

## 5. DEVELOPMENT WORKFLOW COMMANDS

### Run Database Rules Test Suite
```bash
npx tsx ./src/db/tests/dbRules.test.ts
```

### Seed Development Database
```bash
npx tsx ./src/db/seed.ts
```

### Generate Drizzle Migrations
```bash
npx drizzle-kit generate
```

---

## 6. ROLLBACK & RECOVERY NOTES

- Migrations can be safely reverted in reverse numerical order (`010` down to `001`).
- `audit_logs` table truncations are forbidden in production and must only be executed by superuser DBAs during non-production resets.
