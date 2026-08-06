# KAEVY STUDIO — DATABASE ARCHITECTURE SPECIFICATION v1.1.0

**Status**: Approved Specification  
**Version**: 1.1.0  
**Target RDBMS**: PostgreSQL 16+  
**Architecture Type**: Relational, Normalized, Transaction-Safe, Audit-Logged  

---

## 1. CORRECTION SUMMARY (v1.0.0 → v1.1.0)

| Area | Version 1.0.0 Pattern | Version 1.1.0 Corrected Standard | Rationale |
| :--- | :--- | :--- | :--- |
| **Service Base Pricing** | Dual column storage (`base_price_idr`, `base_price_usd`) | Single source of truth (`base_price` + `base_currency`) | Eliminates dual-maintenance bugs and price drift. Real-time conversion uses the `exchange_rates` engine. |
| **Currency Engine** | Embedded inline conversions | Centralized `exchange_rates` table | Supports dynamic exchange rate updates and accurate snapshot logging for orders & payments. |
| **MVP Scope Boundaries** | Trust features (Warranties, Disputes, Audits) placed in Phase 2 | Warranties, Disputes, Reviews, Notifications, and Audit Logs integrated into Phase 1 (MVP) | KAEVY's core value proposition relies heavily on payment protection and trust mechanisms. |
| **Share Asset Moderation** | Simplified APPROVED / REJECTED status | 7-State Lifecycle (`DRAFT`, `PENDING_SCAN`, `PENDING_MODERATION`, `APPROVED`, `REJECTED`, `HIDDEN`, `REMOVED`) with visibility levels (`PUBLIC`, `PRIVATE`, `ADMIN_ONLY`) | Ensures comprehensive automated scanning & moderation workflows before publication. |
| **Warranty Start Timestamp** | Default `NOW()` at creation | Derived from `project.completed_at` | Guarantees the 30-day bug warranty period begins strictly upon project completion. |
| **Rating Source of Truth** | Duplicate aggregate fields | `reviews` table as primary source of truth; cached fields on `developer_profiles` | Maintains audit integrity while providing high-performance query reads. |
| **Foreign Key Uniformity** | Mixed `users.id` and `developer_profiles.id` references | Domain entities reference domain profiles (`developer_profiles.id`, `client_profiles.id`); auth logic references `users.id` | Establishes clean domain boundaries and strict referential integrity. |

---

## 2. DOMAIN MODEL & SYSTEM ENTITIES

KAEVY STUDIO is organized into 10 core domain clusters:
1. **Identity & Access Control**: `users`, `roles`, `user_roles`, `permissions`, `role_permissions`, `sessions`
2. **Profiles**: `client_profiles`, `developer_profiles`, `developer_verification_submissions`, `user_preferences`
3. **Services Catalog**: `service_categories`, `services`, `service_price_history`, `exchange_rates`
4. **Orders & Execution**: `orders`, `order_items`, `projects`, `project_milestones`, `project_files`, `order_events`
5. **Financials & Payment Protection**: `payments`, `payment_transactions`, `escrow_records`, `platform_fee_settings`
6. **Share Asset Marketplace**: `assets`, `asset_files`, `asset_documentation_blocks`, `asset_categories`, `asset_tags`, `asset_tag_relations`, `asset_versions`, `asset_downloads`, `asset_security_scans`, `asset_moderation_reviews`, `asset_reports`
7. **Trust & Quality Assurance**: `reviews`, `warranties`, `warranty_tickets`, `disputes`, `dispute_evidence`, `dispute_actions`
8. **Communication**: `conversations`, `conversation_members`, `messages`
9. **Notifications**: `notifications`
10. **Governance & Compliance**: `audit_logs`

---

## 3. COMPLETE DATABASE TABLES SPECIFICATION

### 3.1 Identity & Access Control

#### `users`
Central user credential and core identity registry.
* `id` (UUID, PK, default `gen_random_uuid()`)
* `email` (VARCHAR(255), UNIQUE, NOT NULL)
* `password_hash` (VARCHAR(255), NULLABLE - Null for OAuth-only users)
* `display_name` (VARCHAR(100), NOT NULL)
* `avatar_url` (TEXT, NULLABLE)
* `status` (VARCHAR(30), NOT NULL, default `'ACTIVE'`) — Enum: `ACTIVE`, `PENDING_VERIFICATION`, `SUSPENDED`, `REJECTED`
* `created_at` (TIMESTAMPTZ, NOT NULL, default `NOW()`)
* `updated_at` (TIMESTAMPTZ, NOT NULL, default `NOW()`)
* `deleted_at` (TIMESTAMPTZ, NULLABLE)
* **Indexes**: `idx_users_email` (UNIQUE), `idx_users_status`

#### `roles`
System roles definition.
* `id` (UUID, PK)
* `code` (VARCHAR(50), UNIQUE, NOT NULL) — Enum values: `PUBLIC`, `CLIENT`, `DEVELOPER`, `ADMIN`
* `name` (VARCHAR(100), NOT NULL)
* `description` (TEXT)
* `created_at` (TIMESTAMPTZ, default `NOW()`)

#### `user_roles`
Junction table linking users to roles.
* `user_id` (UUID, FK -> `users.id` ON DELETE CASCADE)
* `role_id` (UUID, FK -> `roles.id` ON DELETE CASCADE)
* `assigned_at` (TIMESTAMPTZ, default `NOW()`)
* **Primary Key**: `(user_id, role_id)`

#### `permissions`
Granular feature permissions.
* `id` (UUID, PK)
* `code` (VARCHAR(100), UNIQUE, NOT NULL) — e.g. `order:create`, `asset:moderate`, `dispute:resolve`
* `description` (TEXT)

#### `role_permissions`
Junction table for role permissions.
* `role_id` (UUID, FK -> `roles.id` ON DELETE CASCADE)
* `permission_id` (UUID, FK -> `permissions.id` ON DELETE CASCADE)
* **Primary Key**: `(role_id, permission_id)`

---

### 3.2 User Profiles & Preferences

#### `client_profiles`
Extended profile for clients commissioning Roblox projects.
* `id` (UUID, PK, default `gen_random_uuid()`)
* `user_id` (UUID, UNIQUE, FK -> `users.id` ON DELETE CASCADE)
* `discord_username` (VARCHAR(100), NULLABLE)
* `whatsapp_number` (VARCHAR(30), NULLABLE)
* `company_name` (VARCHAR(150), NULLABLE)
* `total_orders_count` (INTEGER, default `0`)
* `created_at` (TIMESTAMPTZ, default `NOW()`)
* `updated_at` (TIMESTAMPTZ, default `NOW()`)

#### `developer_profiles`
Extended profile for Roblox Studio developers.
* `id` (UUID, PK, default `gen_random_uuid()`)
* `user_id` (UUID, UNIQUE, FK -> `users.id` ON DELETE CASCADE)
* `bio` (TEXT, NULLABLE)
* `specialization` (VARCHAR(100), NOT NULL) — e.g. `Luau / Lua Scripting`, `Map Building`, `UI/UX`, `3D Modeling`
* `skills` (TEXT[], NOT NULL, default `'{}'`)
* `portfolio_url` (TEXT, NULLABLE)
* `verification_status` (VARCHAR(30), NOT NULL, default `'PENDING'`) — Enum: `PENDING`, `VERIFIED`, `ELITE`, `REJECTED`, `SUSPENDED`
* `developer_tier` (VARCHAR(30), NOT NULL, default `'VERIFIED'`) — Enum: `VERIFIED` (max 3 capacity), `ELITE` (max 5 capacity)
* `active_project_capacity` (INTEGER, NOT NULL, default `3`)
* `cached_completed_orders` (INTEGER, NOT NULL, default `0`) — Derived cache
* `cached_average_rating` (NUMERIC(3, 2), NOT NULL, default `0.00`) — Derived cache
* `created_at` (TIMESTAMPTZ, default `NOW()`)
* `updated_at` (TIMESTAMPTZ, default `NOW()`)
* **Indexes**: `idx_dev_verification_status`, `idx_dev_specialization`

#### `developer_verification_submissions`
Audit history of developer verification applications.
* `id` (UUID, PK)
* `developer_profile_id` (UUID, FK -> `developer_profiles.id` ON DELETE CASCADE)
* `portfolio_links` (TEXT[], NOT NULL)
* `specialization` (VARCHAR(100), NOT NULL)
* `submission_notes` (TEXT)
* `status` (VARCHAR(30), NOT NULL, default `'PENDING'`) — Enum: `PENDING`, `APPROVED`, `REJECTED`
* `rejection_reason` (TEXT, NULLABLE)
* `reviewed_by_user_id` (UUID, FK -> `users.id`, NULLABLE)
* `reviewed_at` (TIMESTAMPTZ, NULLABLE)
* `created_at` (TIMESTAMPTZ, default `NOW()`)

#### `user_preferences`
Localization and UI preferences.
* `user_id` (UUID, PK, FK -> `users.id` ON DELETE CASCADE)
* `language` (VARCHAR(10), NOT NULL, default `'id'`) — Enum: `id`, `en`
* `display_currency` (VARCHAR(10), NOT NULL, default `'IDR'`) — Enum: `IDR`, `USD`
* `timezone` (VARCHAR(50), default `'Asia/Jakarta'`)
* `updated_at` (TIMESTAMPTZ, default `NOW()`)

---

### 3.3 Services Catalog & Pricing Engine

#### `service_categories`
Taxonomy for marketplace services.
* `id` (UUID, PK)
* `name` (VARCHAR(100), NOT NULL)
* `slug` (VARCHAR(100), UNIQUE, NOT NULL)
* `description` (TEXT)
* `icon_name` (VARCHAR(50))
* `display_order` (INTEGER, default `0`)

#### `services`
Roblox development services offered by verified developers.
* `id` (UUID, PK, default `gen_random_uuid()`)
* `developer_profile_id` (UUID, FK -> `developer_profiles.id` ON DELETE CASCADE)
* `category_id` (UUID, FK -> `service_categories.id`)
* `title` (VARCHAR(200), NOT NULL)
* `slug` (VARCHAR(220), UNIQUE, NOT NULL)
* `description` (TEXT, NOT NULL)
* `pricing_type` (VARCHAR(30), NOT NULL, default `'FIXED'`) — Enum: `FIXED`, `STARTING_FROM`, `CUSTOM_QUOTE`
* `base_price` (NUMERIC(15, 2), NOT NULL) — Single source of truth value
* `base_currency` (VARCHAR(10), NOT NULL, default `'IDR'`) — Single source of truth currency
* `minimum_price` (NUMERIC(15, 2), NULLABLE)
* `maximum_price` (NUMERIC(15, 2), NULLABLE)
* `estimated_delivery_days` (INTEGER, NOT NULL)
* `status` (VARCHAR(30), NOT NULL, default `'ACTIVE'`) — Enum: `DRAFT`, `PENDING_APPROVAL`, `ACTIVE`, `INACTIVE`, `REJECTED`
* `created_at` (TIMESTAMPTZ, default `NOW()`)
* `updated_at` (TIMESTAMPTZ, default `NOW()`)
* **Indexes**: `idx_services_dev`, `idx_services_category`, `idx_services_status`

#### `exchange_rates`
Central currency exchange rate conversion table.
* `id` (UUID, PK)
* `base_currency` (VARCHAR(10), NOT NULL) — e.g. `USD`
* `quote_currency` (VARCHAR(10), NOT NULL) — e.g. `IDR`
* `rate` (NUMERIC(18, 6), NOT NULL) — e.g. `16200.000000`
* `effective_at` (TIMESTAMPTZ, NOT NULL, default `NOW()`)
* `source` (VARCHAR(100), default `'MANUAL_ADMIN'`)
* **Indexes**: `idx_exchange_rates_pair` (`base_currency`, `quote_currency`, `effective_at` DESC)

#### `service_price_history`
Historical audit of service price changes.
* `id` (UUID, PK)
* `service_id` (UUID, FK -> `services.id` ON DELETE CASCADE)
* `old_price` (NUMERIC(15, 2), NOT NULL)
* `new_price` (NUMERIC(15, 2), NOT NULL)
* `currency` (VARCHAR(10), NOT NULL)
* `changed_at` (TIMESTAMPTZ, default `NOW()`)

---

### 3.4 Orders, Projects & Execution

#### `orders`
Client commission orders.
* `id` (UUID, PK, default `gen_random_uuid()`)
* `order_number` (VARCHAR(50), UNIQUE, NOT NULL) — e.g. `KVS-20260731-001`
* `client_profile_id` (UUID, FK -> `client_profiles.id`)
* `developer_profile_id` (UUID, FK -> `developer_profiles.id`)
* `service_id` (UUID, FK -> `services.id`)
* `status` (VARCHAR(40), NOT NULL, default `'PENDING_REVIEW'`)  
  *Enum*: `PENDING_REVIEW`, `WAITING_PAYMENT`, `PAID`, `DEVELOPER_ASSIGNED`, `IN_PROGRESS`, `SUBMITTED`, `REVISION`, `COMPLETED`, `WARRANTY`, `DISPUTE`, `CANCELLED`, `REFUNDED`
* `title_snapshot` (VARCHAR(200), NOT NULL) — Immutable snapshot
* `description_snapshot` (TEXT, NOT NULL)
* `budget_amount_snapshot` (NUMERIC(15, 2), NOT NULL) — Immutable snapshot
* `currency_snapshot` (VARCHAR(10), NOT NULL)
* `exchange_rate_snapshot` (NUMERIC(18, 6), NOT NULL, default `1.0`)
* `platform_fee_rate_snapshot` (NUMERIC(5, 4), NOT NULL) — e.g. `0.1000` (10%)
* `platform_fee_amount_snapshot` (NUMERIC(15, 2), NOT NULL)
* `deadline_days` (INTEGER, NOT NULL)
* `target_delivery_date` (TIMESTAMPTZ, NULLABLE)
* `created_at` (TIMESTAMPTZ, default `NOW()`)
* `updated_at` (TIMESTAMPTZ, default `NOW()`)
* **Indexes**: `idx_orders_number` (UNIQUE), `idx_orders_client`, `idx_orders_dev`, `idx_orders_status`

#### `order_items`
Detailed line items for an order.
* `id` (UUID, PK)
* `order_id` (UUID, FK -> `orders.id` ON DELETE CASCADE)
* `service_id` (UUID, FK -> `services.id`)
* `title` (VARCHAR(200), NOT NULL)
* `unit_price_snapshot` (NUMERIC(15, 2), NOT NULL)
* `quantity` (INTEGER, NOT NULL, default `1`)
* `scope_description` (TEXT)

#### `projects`
Execution workspace corresponding to an active order.
* `id` (UUID, PK, default `gen_random_uuid()`)
* `order_id` (UUID, UNIQUE, FK -> `orders.id` ON DELETE CASCADE)
* `developer_profile_id` (UUID, FK -> `developer_profiles.id`)
* `client_profile_id` (UUID, FK -> `client_profiles.id`)
* `progress_percentage` (INTEGER, NOT NULL, default `0`)
* `status` (VARCHAR(30), NOT NULL, default `'NOT_STARTED'`) — Enum: `NOT_STARTED`, `IN_PROGRESS`, `UNDER_REVIEW`, `REVISION_REQUESTED`, `COMPLETED`
* `started_at` (TIMESTAMPTZ, NULLABLE)
* `completed_at` (TIMESTAMPTZ, NULLABLE) — Crucial timestamp for warranty trigger
* `updated_at` (TIMESTAMPTZ, default `NOW()`)

#### `project_milestones`
Checkpoints (25%, 50%, 75%, 100%) for project progress.
* `id` (UUID, PK)
* `project_id` (UUID, FK -> `projects.id` ON DELETE CASCADE)
* `percentage` (INTEGER, NOT NULL) — e.g. `25`, `50`, `75`, `100`
* `title` (VARCHAR(150), NOT NULL)
* `description` (TEXT)
* `status` (VARCHAR(30), NOT NULL, default `'PENDING'`) — Enum: `PENDING`, `SUBMITTED`, `APPROVED`, `REVISION_REQUESTED`
* `submitted_at` (TIMESTAMPTZ, NULLABLE)
* `approved_at` (TIMESTAMPTZ, NULLABLE)
* `revision_notes` (TEXT, NULLABLE)

#### `project_files`
Deliverable file attachments (.rbxl, .zip, .lua).
* `id` (UUID, PK)
* `project_id` (UUID, FK -> `projects.id` ON DELETE CASCADE)
* `milestone_id` (UUID, FK -> `project_milestones.id`, NULLABLE)
* `uploaded_by_user_id` (UUID, FK -> `users.id`)
* `file_name` (VARCHAR(255), NOT NULL)
* `file_size_bytes` (BIGINT, NOT NULL)
* `mime_type` (VARCHAR(100), NOT NULL)
* `storage_key` (TEXT, NOT NULL)
* `version` (VARCHAR(20), default `'1.0'`)
* `created_at` (TIMESTAMPTZ, default `NOW()`)

#### `order_events`
Audit trail of order lifecycle events.
* `id` (UUID, PK)
* `order_id` (UUID, FK -> `orders.id` ON DELETE CASCADE)
* `actor_user_id` (UUID, FK -> `users.id`, NULLABLE)
* `event_type` (VARCHAR(50), NOT NULL) — e.g. `ORDER_PAID`, `CHECKPOINT_SUBMITTED`, `DISPUTE_OPENED`
* `metadata_json` (JSONB, default `'{}'`)
* `created_at` (TIMESTAMPTZ, default `NOW()`)

---

### 3.5 Financials & Escrow Payment Protection

#### `platform_fee_settings`
Configurable fee rate table.
* `id` (UUID, PK)
* `fee_percentage` (NUMERIC(5, 4), NOT NULL, default `0.1000`) — 10%
* `effective_from` (TIMESTAMPTZ, NOT NULL, default `NOW()`)
* `created_by_user_id` (UUID, FK -> `users.id`)

#### `payments`
Main payment record.
* `id` (UUID, PK, default `gen_random_uuid()`)
* `order_id` (UUID, FK -> `orders.id` ON DELETE CASCADE)
* `amount` (NUMERIC(15, 2), NOT NULL)
* `currency` (VARCHAR(10), NOT NULL)
* `status` (VARCHAR(30), NOT NULL, default `'PENDING'`)  
  *Enum*: `PENDING`, `PROCESSING`, `PAID`, `FAILED`, `EXPIRED`, `CANCELLED`, `REFUND_PENDING`, `REFUNDED`
* `payment_method_category` (VARCHAR(50), NOT NULL) — Enum: `QRIS`, `VIRTUAL_ACCOUNT`, `E_WALLET`, `PAYPAL`
* `created_at` (TIMESTAMPTZ, default `NOW()`)
* `updated_at` (TIMESTAMPTZ, default `NOW()`)

#### `payment_transactions`
Individual payment provider transactions.
* `id` (UUID, PK)
* `payment_id` (UUID, FK -> `payments.id` ON DELETE CASCADE)
* `provider` (VARCHAR(50), NOT NULL) — e.g. `MIDTRANS`, `XENDIT`, `PAYPAL`
* `provider_transaction_id` (VARCHAR(255), NULLABLE)
* `amount` (NUMERIC(15, 2), NOT NULL)
* `currency` (VARCHAR(10), NOT NULL)
* `raw_provider_response` (JSONB)
* `created_at` (TIMESTAMPTZ, default `NOW()`)

#### `escrow_records`
KAEVY Payment Protection holding record.
* `id` (UUID, PK, default `gen_random_uuid()`)
* `order_id` (UUID, UNIQUE, FK -> `orders.id` ON DELETE CASCADE)
* `payment_id` (UUID, FK -> `payments.id`)
* `gross_amount` (NUMERIC(15, 2), NOT NULL)
* `platform_fee_amount` (NUMERIC(15, 2), NOT NULL)
* `net_developer_amount` (NUMERIC(15, 2), NOT NULL)
* `currency` (VARCHAR(10), NOT NULL)
* `status` (VARCHAR(30), NOT NULL, default `'HELD'`) — Enum: `HELD`, `RELEASE_PENDING`, `RELEASED`, `REFUNDED`, `DISPUTED`
* `locked_at` (TIMESTAMPTZ, NOT NULL, default `NOW()`)
* `released_at` (TIMESTAMPTZ, NULLABLE)
* `refunded_at` (TIMESTAMPTZ, NULLABLE)

---

### 3.6 Share Asset Marketplace

#### `asset_categories`
Taxonomy for digital assets.
* `id` (UUID, PK)
* `name` (VARCHAR(100), NOT NULL)
* `slug` (VARCHAR(100), UNIQUE, NOT NULL)

#### `assets`
Digital assets (scripts, 3D maps, UI suites, studio plugins).
* `id` (UUID, PK, default `gen_random_uuid()`)
* `uploader_developer_profile_id` (UUID, FK -> `developer_profiles.id`)
* `category_id` (UUID, FK -> `asset_categories.id`)
* `title` (VARCHAR(200), NOT NULL)
* `slug` (VARCHAR(220), UNIQUE, NOT NULL)
* `description` (TEXT, NOT NULL)
* `version` (VARCHAR(20), NOT NULL, default `'1.0.0'`)
* `license` (VARCHAR(50), default `'MIT'`)
* `visibility` (VARCHAR(20), NOT NULL, default `'PUBLIC'`) — Enum: `PUBLIC`, `PRIVATE`, `ADMIN_ONLY`
* `status` (VARCHAR(30), NOT NULL, default `'PENDING_SCAN'`)  
  *Enum*: `DRAFT`, `PENDING_SCAN`, `PENDING_MODERATION`, `APPROVED`, `REJECTED`, `HIDDEN`, `REMOVED`
* `downloads_count` (INTEGER, NOT NULL, default `0`)
* `rating_average` (NUMERIC(3, 2), default `0.00`)
* `created_at` (TIMESTAMPTZ, default `NOW()`)
* `updated_at` (TIMESTAMPTZ, default `NOW()`)
* **Indexes**: `idx_assets_uploader`, `idx_assets_status`, `idx_assets_slug`

#### `asset_files`
Binary files associated with a share asset (.zip, .rbxl).
* `id` (UUID, PK)
* `asset_id` (UUID, FK -> `assets.id` ON DELETE CASCADE)
* `file_name` (VARCHAR(255), NOT NULL)
* `file_size_bytes` (BIGINT, NOT NULL) — Max 500MB
* `mime_type` (VARCHAR(100), NOT NULL)
* `storage_key` (TEXT, NOT NULL)
* `checksum_sha256` (VARCHAR(64), NULLABLE)
* `version` (VARCHAR(20), default `'1.0.0'`)
* `uploaded_at` (TIMESTAMPTZ, default `NOW()`)

#### `asset_documentation_blocks`
Structured documentation sections (1 to 10 blocks).
* `id` (UUID, PK)
* `asset_id` (UUID, FK -> `assets.id` ON DELETE CASCADE)
* `title` (VARCHAR(150), NOT NULL)
* `content` (TEXT, NOT NULL)
* `position_order` (INTEGER, NOT NULL, default `1`)
* `created_at` (TIMESTAMPTZ, default `NOW()`)

#### `asset_tags` & `asset_tag_relations`
Tags for assets.
* `asset_tags`: `id` (UUID, PK), `tag_name` (VARCHAR(50), UNIQUE)
* `asset_tag_relations`: `asset_id` (FK), `tag_id` (FK) -> PK: `(asset_id, tag_id)`

#### `asset_downloads`
Download log.
* `id` (UUID, PK)
* `asset_id` (UUID, FK -> `assets.id` ON DELETE CASCADE)
* `user_id` (UUID, FK -> `users.id`, NULLABLE — Null for anonymous)
* `downloaded_at` (TIMESTAMPTZ, default `NOW()`)

#### `asset_security_scans`
Automated Lua AST security scan history.
* `id` (UUID, PK)
* `asset_file_id` (UUID, FK -> `asset_files.id` ON DELETE CASCADE)
* `scan_status` (VARCHAR(30), NOT NULL, default `'PENDING'`) — Enum: `PENDING`, `SCANNING`, `PASSED`, `FLAGGED`, `FAILED`
* `ast_lua_issues_found` (JSONB, default `'[]'`)
* `scanned_at` (TIMESTAMPTZ, default `NOW()`)

#### `asset_moderation_reviews`
Admin moderation audit log for share assets.
* `id` (UUID, PK)
* `asset_id` (UUID, FK -> `assets.id` ON DELETE CASCADE)
* `reviewed_by_user_id` (UUID, FK -> `users.id`)
* `decision` (VARCHAR(30), NOT NULL) — Enum: `APPROVED`, `REJECTED`, `FLAGGED`
* `notes` (TEXT)
* `created_at` (TIMESTAMPTZ, default `NOW()`)

---

### 3.7 Trust, Disputes & Guarantees

#### `reviews`
Client reviews for completed orders (source of truth).
* `id` (UUID, PK)
* `order_id` (UUID, UNIQUE, FK -> `orders.id` ON DELETE CASCADE)
* `client_profile_id` (UUID, FK -> `client_profiles.id`)
* `developer_profile_id` (UUID, FK -> `developer_profiles.id`)
* `rating` (INTEGER, NOT NULL, CHECK `rating BETWEEN 1 AND 5`)
* `review_text` (TEXT)
* `created_at` (TIMESTAMPTZ, default `NOW()`)
* `updated_at` (TIMESTAMPTZ, default `NOW()`)

#### `warranties`
30-Day Bug Warranty instance triggered upon project completion.
* `id` (UUID, PK, default `gen_random_uuid()`)
* `order_id` (UUID, UNIQUE, FK -> `orders.id` ON DELETE CASCADE)
* `project_id` (UUID, UNIQUE, FK -> `projects.id` ON DELETE CASCADE)
* `start_at` (TIMESTAMPTZ, NOT NULL) — Set strictly to `project.completed_at`
* `end_at` (TIMESTAMPTZ, NOT NULL) — `start_at + INTERVAL '30 days'`
* `status` (VARCHAR(30), NOT NULL, default `'ACTIVE'`) — Enum: `ACTIVE`, `CLAIMED`, `EXPIRED`
* `created_at` (TIMESTAMPTZ, default `NOW()`)

#### `warranty_tickets`
Bug reports submitted under an active warranty.
* `id` (UUID, PK)
* `warranty_id` (UUID, FK -> `warranties.id` ON DELETE CASCADE)
* `opened_by_client_id` (UUID, FK -> `client_profiles.id`)
* `title` (VARCHAR(200), NOT NULL)
* `bug_description` (TEXT, NOT NULL)
* `status` (VARCHAR(30), NOT NULL, default `'OPEN'`) — Enum: `OPEN`, `UNDER_REVIEW`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`, `EXPIRED`
* `resolved_at` (TIMESTAMPTZ, NULLABLE)
* `created_at` (TIMESTAMPTZ, default `NOW()`)

#### `disputes`
Formal order dispute tickets.
* `id` (UUID, PK, default `gen_random_uuid()`)
* `order_id` (UUID, UNIQUE, FK -> `orders.id` ON DELETE CASCADE)
* `opened_by_user_id` (UUID, FK -> `users.id`)
* `client_profile_id` (UUID, FK -> `client_profiles.id`)
* `developer_profile_id` (UUID, FK -> `developer_profiles.id`)
* `reason` (TEXT, NOT NULL)
* `status` (VARCHAR(30), NOT NULL, default `'OPEN'`) — Enum: `OPEN`, `UNDER_REVIEW`, `RESOLVED`, `CLOSED`
* `resolution_type` (VARCHAR(30), NULLABLE) — Enum: `FULL_REFUND`, `FULL_DEVELOPER_RELEASE`, `PARTIAL_SPLIT`
* `refund_amount` (NUMERIC(15, 2), default `0.00`)
* `developer_release_amount` (NUMERIC(15, 2), default `0.00`)
* `resolved_by_admin_user_id` (UUID, FK -> `users.id`, NULLABLE)
* `resolved_at` (TIMESTAMPTZ, NULLABLE)
* `created_at` (TIMESTAMPTZ, default `NOW()`)

#### `dispute_evidence`
File/text evidence attached to disputes.
* `id` (UUID, PK)
* `dispute_id` (UUID, FK -> `disputes.id` ON DELETE CASCADE)
* `submitted_by_user_id` (UUID, FK -> `users.id`)
* `statement` (TEXT)
* `file_storage_key` (TEXT, NULLABLE)
* `created_at` (TIMESTAMPTZ, default `NOW()`)

---

### 3.8 Governance & Communications

#### `conversations`, `conversation_members`, `messages`
Real-time client-developer messaging per order/project.
* `conversations`: `id` (UUID, PK), `order_id` (FK), `created_at`
* `conversation_members`: `conversation_id` (FK), `user_id` (FK) -> PK: `(conversation_id, user_id)`
* `messages`: `id` (UUID, PK), `conversation_id` (FK), `sender_id` (FK), `content` (TEXT), `attachments` (JSONB), `created_at`, `read_at`

#### `notifications`
User alert notifications.
* `id` (UUID, PK)
* `user_id` (UUID, FK -> `users.id` ON DELETE CASCADE)
* `type` (VARCHAR(50), NOT NULL) — e.g. `ORDER_PAID`, `MILESTONE_SUBMITTED`, `DISPUTE_OPENED`
* `title` (VARCHAR(200), NOT NULL)
* `message` (TEXT, NOT NULL)
* `read_at` (TIMESTAMPTZ, NULLABLE)
* `created_at` (TIMESTAMPTZ, default `NOW()`)

#### `audit_logs`
Append-only log for sensitive admin operations.
* `id` (UUID, PK, default `gen_random_uuid()`)
* `actor_user_id` (UUID, FK -> `users.id`)
* `action` (VARCHAR(100), NOT NULL) — e.g. `FORCE_REFUND`, `FORCE_RELEASE`, `SUSPEND_DEVELOPER`, `RESOLVE_DISPUTE`
* `entity_type` (VARCHAR(50), NOT NULL) — e.g. `ORDER`, `DEVELOPER_PROFILE`, `ASSET`
* `entity_id` (UUID, NOT NULL)
* `justification_reason` (TEXT, NOT NULL) — Requirement for sensitive operations
* `metadata_json` (JSONB, default `'{}'`)
* `created_at` (TIMESTAMPTZ, NOT NULL, default `NOW()`)
* **Indexes**: `idx_audit_logs_actor`, `idx_audit_logs_entity` (`entity_type`, `entity_id`)

---

## 4. ENTITY RELATIONSHIP MAP (ERD)

```
                       +-------------------+
                       |       users       |
                       +-------------------+
                         /       |       \
                        /        |        \
   +-----------------------+     |     +-----------------------+
   |    client_profiles    |     |     |  developer_profiles   |
   +-----------------------+     |     +-----------------------+
            |                    |             |          |
            |                    |             |          |
            v                    v             v          v
   +------------------------------------------------+  +-------------------+
   |                    orders                      |  |     services      |
   +------------------------------------------------+  +-------------------+
       /       |        |        |         \
      /        |        |        |          \
     v         v        v        v           v
+--------+ +------+ +--------+ +-------+ +----------+
|projects| |paymts| |reviews | |dispute| |warranties|
+--------+ +------+ +--------+ +-------+ +----------+
    |         |                    |          |
    v         v                    v          v
+---------+ +------+          +--------+ +----------+
|milestns | |escrow|          |evidence| |tickets   |
+---------+ +------+          +--------+ +----------+
```

---

## 5. MOCK DATA MIGRATION MAP

| Existing Source File | Existing Mock Data Object | Future Target Database Table | Transformation & Mapping Rule |
| :--- | :--- | :--- | :--- |
| `src/data/portalData.ts` | `sampleOrders` | `orders`, `order_items`, `projects`, `payments`, `escrow_records` | Map order metadata into `orders`. Extract milestones to `project_milestones` and payment status to `payments` & `escrow_records`. |
| `src/data/portalData.ts` | `serviceMarketplaceItems` | `services`, `service_categories`, `developer_profiles` | Extract developer identities to `developer_profiles`. Map `basePrice` and `currency` into `services`. |
| `src/data/shareAssetsData.ts` | `sampleShareAssets` | `assets`, `asset_files`, `asset_documentation_blocks`, `asset_categories` | Split asset files into `asset_files` and documentation blocks into `asset_documentation_blocks`. |
| `src/services/authService.ts` | `DEMO_USERS` | `users`, `user_roles`, `client_profiles`, `developer_profiles` | Map authentication credentials to `users`, role flags to `user_roles`, and profiles to respective client/dev tables. |

---

## 6. IMPLEMENTATION ROADMAP BY PHASE

### Phase 1: MVP Core (Current Priority Target)
- All 10 domain clusters defined above (`users`, `client_profiles`, `developer_profiles`, `services`, `orders`, `projects`, `milestones`, `payments`, `escrow_records`, `assets`, `reviews`, `warranties`, `disputes`, `audit_logs`).
- Full PostgreSQL database schema creation.

### Phase 2: Advanced Platform Capabilities
- Real-time WebSockets integration for `messages` and live project updates.
- Automated S3 / Cloud Storage upload pre-signed URLs for `asset_files` and `project_files`.
- Automated Webhook handlers for payment gateways (Midtrans / Xendit / PayPal).

### Phase 3: Ecosystem Extensions
- Roblox Open Cloud API integration (automated place deployment & asset publishing).
- Multi-user developer studio accounts & team earnings splitting.
- Roblox Studio Plugin OAuth integration.

---

## 7. OPEN DECISIONS & TECHNICAL RECOMMENDATIONS

1. **Database Migration Framework**: Recommend `Drizzle ORM` or `Prisma` with TypeScript types generated directly from the PostgreSQL schema.
2. **File Storage Strategy**: Large assets (up to 500MB) should be stored in Cloud Object Storage (Google Cloud Storage / S3) with `storage_key` saved in PostgreSQL.
3. **Audit Log Immutability**: Configure PostgreSQL table row permissions or append-only rules for `audit_logs` to ensure entries cannot be modified or deleted.
