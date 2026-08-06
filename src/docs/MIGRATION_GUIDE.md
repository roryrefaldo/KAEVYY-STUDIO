# KAEVY STUDIO — MIGRATION GUIDE (RC1)

**Version**: 1.0.0 (Release Candidate 1)  
**ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`)

---

## 🗄️ Database Migrations Lifecycle

All PostgreSQL migrations are stored as ordered SQL scripts in `/drizzle/migrations/`.

### Migration Sequence (DAG)
1. `001_identity_and_rbac.sql` — Users, roles, permissions, RBAC mappings.
2. `002_profiles_and_preferences.sql` — Client & Developer profiles, UI settings.
3. `003_exchange_rates_and_categories.sql` — Taxonomies, service categories, FX rates.
4. `004_services_catalog.sql` — Developer services catalog & price history.
5. `005_orders_and_projects.sql` — Orders, projects, milestones, budget snapshots.
6. `006_financials_and_escrow.sql` — Payments, escrow records, platform fee holds.
7. `007_share_asset_system.sql` — Digital share assets, documentation blocks, tags, downloads.
8. `008_trust_warranty_disputes.sql` — Reviews, 30-day post-delivery warranty guarantees, disputes.
9. `009_communications_and_notifications.sql` — Conversations, order messages, notifications.
10. `010_governance_and_audit.sql` — Developer capacity row locking, tier safeguards, audit log immutability triggers.

---

## 🚀 Executing Schema Changes & Migrations

### 1. Generating New Migrations
When schema files in `/src/db/schema/` are modified:
```bash
npx drizzle-kit generate
```

### 2. Applying Migrations
To execute pending migrations against a target PostgreSQL instance:
```bash
npx tsx ./src/db/seed.ts
```
*(The seed script checks existing schema status and safely initializes missing tables and triggers).*

---

## 🔄 Zero-Downtime Migration Policy

1. **Additive Schema Updates**: Always add new nullable columns or tables before altering existing definitions.
2. **Snapshot Integrity**: Never alter frozen order snapshot columns (`budget_amount_snapshot`, `exchange_rate_snapshot`).
3. **Audit Immutability**: Do NOT modify `audit_logs` triggers or tables.
