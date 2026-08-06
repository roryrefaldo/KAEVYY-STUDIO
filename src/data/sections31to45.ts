import { PRDSection } from '../types/prd';

export const sections31to45: PRDSection[] = [
  {
    id: 31,
    title: '31. Security Requirements',
    slug: 'security-requirements',
    category: 'security_tech',
    summary: 'Platform security guardrails, malware scanning, rate limiting, XSS/CSRF defense, and data protection.',
    tags: ['Security', 'Malware Scan', 'OWASP', 'CSRF', 'Rate Limit'],
    keyTakeaways: [
      'Strict MIME-type verification and binary magic bytes check for all uploaded files.',
      'Lua security scanner checks for malicious require() IDs, getfenv/setfenv, loadstring, and obfuscated code.',
      'Rate limiting enforced on auth routes (5 requests/min) and download endpoints (10 requests/min).'
    ],
    contentMarkdown: `
# 31. Security Requirements

### Defensive Security Matrix
1. **File Upload Hardening**:
   - Validation against fake extension spoofing using binary magic-bytes checking (e.g., verifying PK header for ZIP/RBXL).
   - Maximum upload limits enforced at Nginx / API gateway layer before memory allocation.
   - Files stored outside web root with randomized UUID filenames in Cloud Storage buckets.
2. **Roblox Lua Security Inspection**:
   - Automated AST parser scanning uploaded \`.lua\` scripts and \`.rbxl\` XML nodes for known backdoor patterns:
     - \`require(12345678)\` (Remote module injection)
     - \`getfenv()\` / \`setfenv()\` (Environment manipulation)
     - \`HttpService:PostAsync()\` sending secret keys to unauthorized webhooks.
3. **API & Data Security**:
   - CSRF tokens for state-changing POST/PUT requests.
   - Parameterized queries to eliminate SQL Injection risks.
   - Content Security Policy (CSP) headers restricting script execution sources.
`
  },
  {
    id: 32,
    title: '32. Database Architecture',
    slug: 'database-architecture',
    category: 'database_api',
    summary: 'Relational database architecture, indexing strategy, foreign key constraints, and transactions.',
    tags: ['Database', 'PostgreSQL', 'Indexing', 'Transactions'],
    keyTakeaways: [
      'PostgreSQL relational schema with Drizzle ORM or Prisma mapping.',
      'ACID transactional isolation for all Escrow wallet balance movements.',
      'Indexes optimized for fast order lookup (by status, client_id, developer_id) and asset search.'
    ],
    contentMarkdown: `
# 32. Database Architecture

### Architectural Principles
- **Engine**: PostgreSQL 16+ with strict Foreign Key constraints and CASCADE/RESTRICT delete rules.
- **Transactions**: All escrow movements (\`payments\`, \`escrow_ledger\`, \`developer_wallets\`) wrapped in strict \`BEGIN ... COMMIT\` blocks with \`SERIALIZABLE\` or \`REPEATABLE READ\` isolation.
- **Indexes**: B-Tree indexes on \`orders.order_id\`, \`orders.client_id\`, \`orders.developer_id\`, \`assets.slug\`, \`assets.category_id\`, and \`audit_logs.created_at\`.
`
  },
  {
    id: 33,
    title: '33. Entity Relationship / Data Model',
    slug: 'entity-relationship-data-model',
    category: 'database_api',
    summary: 'Complete list of 28 core database entities and their relational mappings.',
    tags: ['ERD', 'Database Schema', 'Entities'],
    keyTakeaways: [
      'Entities: Users, Roles, Profiles, Developers, Clients, Admins, Services, Orders, OrderItems, Projects, Payments, Escrow, Reviews, Ratings, Disputes, Warranty, Notifications, Assets, AssetFiles, AssetDocumentation, AssetCategories, AssetTags, AssetDownloads, AssetReports, AssetVersions, AuditLogs.',
      'Strict normalized relationships supporting full financial and asset auditability.',
      'Visual interactive ERD Explorer integrated into Kaevy Studio platform viewer.'
    ],
    contentMarkdown: `
# 33. Entity Relationship / Data Model

### Core Entity Summary (28 Tables)
- **Users & Auth**: \`users\`, \`roles\`, \`user_roles\`, \`profiles\`, \`auth_sessions\`
- **Talent & Marketplace**: \`developers\`, \`clients\`, \`admins\`, \`services\`, \`service_packages\`
- **Order & Escrow System**: \`orders\`, \`order_checkpoints\`, \`payments\`, \`escrow_ledgers\`, \`developer_wallets\`
- **Post-Delivery Quality**: \`reviews\`, \`disputes\`, \`warranties\`, \`warranty_tickets\`
- **Share Asset Hub**: \`assets\`, \`asset_files\`, \`asset_documentation\`, \`asset_categories\`, \`asset_tags\`, \`asset_downloads\`, \`asset_reports\`, \`asset_versions\`
- **Ops & Safety**: \`notifications\`, \`audit_logs\`
`
  },
  {
    id: 34,
    title: '34. API Requirements',
    slug: 'api-requirements',
    category: 'database_api',
    summary: 'RESTful API endpoints, request schemas, headers, authentication guards, and response payload standards.',
    tags: ['API Spec', 'REST API', 'Endpoints', 'JSON'],
    keyTakeaways: [
      'Standard JSON API envelope: { success: boolean, data: T, error?: string, timestamp: string }.',
      'Endpoints cover Auth, Services, Orders, Escrow, Developer Queue, Warranty, Share Asset, and Admin Ops.',
      'Interactive API Spec Inspector built into Kaevy Studio platform viewer.'
    ],
    contentMarkdown: `
# 34. API Requirements

### API Standard Conventions
- Base URL: \`/api/v1\`
- Headers: \`Content-Type: application/json\`, \`Authorization: Bearer <JWT_TOKEN>\`
- Status Codes: \`200 OK\`, \`201 Created\`, \`400 Bad Request\`, \`401 Unauthorized\`, \`403 Forbidden\`, \`404 Not Found\`, \`409 Conflict\`, \`422 Unprocessable Entity\`, \`500 Internal Error\`.
`
  },
  {
    id: 35,
    title: '35. Page / Screen Architecture',
    slug: 'page-screen-architecture',
    category: 'architecture_flows',
    summary: 'Site map, URL routes, and page hierarchy across landing page, marketplace, dashboards, and asset hub.',
    tags: ['Sitemap', 'Routes', 'UI Hierarchy'],
    keyTakeaways: [
      'Public Routes: /, /services, /services/:id, /developers, /developers/:id, /share-assets, /share-assets/:id, /login, /register.',
      'Client Dashboard: /client/dashboard, /client/orders, /client/orders/:id, /client/warranty, /client/profile.',
      'Developer Dashboard: /developer/dashboard, /developer/projects, /developer/queue, /developer/wallet, /developer/portfolio.',
      'Admin Control Suite: /admin/dashboard, /admin/users, /admin/developers, /admin/orders, /admin/disputes, /admin/assets, /admin/logs.'
    ],
    contentMarkdown: `
# 35. Page / Screen Architecture

### URL Route Hierarchy
- **Public Routes**:
  - Home Landing Page
  - /services (Service Marketplace) -> /services/{id} (Service Detail & Order Wizard)
  - /developers (Developer Directory) -> /developers/{id} (Developer Profile & Portfolio)
  - /share-assets (Share Asset Library) -> /share-assets/{id} and /share-assets/upload
- **Client Portal**:
  - /client/dashboard (Overview, Active Orders, Recent Assets)
  - /client/orders/{id} (Order Brief, Chat, Escrow Status, Milestones)
  - /client/warranty (Active Warranty Tickets & Bug Reports)
- **Developer Portal**:
  - /developer/dashboard (Queue Status 2/3, Assigned Projects, Earnings)
  - /developer/projects/{id} (Checkpoint Updates, Deliverable Upload, Chat)
  - /developer/wallet (Available Balance & Withdrawal Request)
- **Admin Control Suite**:
  - /admin/dashboard (Platform KPIs, Escrow Volume, System Status)
  - /admin/orders (Order List, Force Escrow Release, Queue Overrides)
  - /admin/disputes (Dispute Arbitration Center)
  - /admin/assets (Asset Moderation Queue & Report Review)
`
  },
  {
    id: 36,
    title: '36. Dashboard Architecture',
    slug: 'dashboard-architecture',
    category: 'architecture_flows',
    summary: 'UI widget layout and state distribution for Client, Developer, and Admin dashboard views.',
    tags: ['Dashboards', 'UI Layouts', 'Widget Grid'],
    keyTakeaways: [
      'Client Dashboard emphasizes order progress, escrow status, quick action buttons, and warranty status.',
      'Developer Dashboard highlights active capacity queue counter (e.g. 2/3), pending earnings, and urgent milestones.',
      'Admin Dashboard displays system escrow vault balance, pending developer approvals, open disputes, and security flags.'
    ],
    contentMarkdown: `
# 36. Dashboard Architecture

### Dashboard Layout Specifications
- **Client View**: Active Orders Widget -> Escrow Held Summary -> Warranty Tracker -> Recommended Share Assets.
- **Developer View**: Active Queue Status Gauge (2/3) -> Milestone Countdown -> Pending Wallet Earnings -> Client Chat Messages.
- **Admin View**: Total Platform GMV -> Active Escrow Vault Balance -> Open Disputes Alert Box -> Developer Verification Queue -> Asset Moderation Queue.
`
  },
  {
    id: 37,
    title: '37. User Flow',
    slug: 'user-flow',
    category: 'architecture_flows',
    summary: 'General user browsing, registration, and role initialization pathways.',
    tags: ['User Flow', 'Onboarding'],
    keyTakeaways: [
      'Unauthenticated user browses services and share assets freely.',
      'Upon registration, user selects role preference (Client or Developer Applicant).',
      'Account initialization sets profile preferences and Discord webhook link.'
    ],
    contentMarkdown: `
# 37. User Flow

### General Onboarding Pipeline
1. **Visitor Entry**: Browse Landing Page, Service Catalog, and Share Asset Library.
2. **Call to Action**: Click "Order Service" or "Upload Share Asset".
3. **Authentication**: Prompt Login or Registration modal.
4. **Role Preference**:
   - **Client Registration**: Set Studio/Client profile -> Access Client Portal.
   - **Developer Registration**: Submit Portfolio & Skills -> Await Admin Vetting.
`
  },
  {
    id: 38,
    title: '38. Developer Flow',
    slug: 'developer-flow',
    category: 'architecture_flows',
    summary: 'Developer verification, order claiming, checkpoint submission, and payout withdrawal pipeline.',
    tags: ['Developer Flow', 'Workflows'],
    keyTakeaways: [
      'Developer applies -> Admin verifies -> Queue capacity unlocked (3 slots).',
      'Developer accepts order -> System locks 1 queue slot -> Updates checkpoints -> Submits deliverable.',
      'Client approves -> 90% payout credited to wallet -> Queue slot unlocked.'
    ],
    contentMarkdown: `
# 38. Developer Flow

### Execution Pipeline
1. **Verification**: Developer applies -> Admin approves portfolio -> Status becomes Verified.
2. **Queue Check**: System checks developer queue capacity (max 3 active orders).
3. **Claiming**: Developer accepts assigned order -> 1 queue slot consumed.
4. **Milestones**: Updates progressive checkpoints (25% Graybox, 50% Scripting, 75% Polish, 100% Final).
5. **Deliverable**: Uploads RBXL or ZIP package to order file vault.
6. **Payout**: Client approves -> 90% payout credited to wallet; queue slot released.
`
  },
  {
    id: 39,
    title: '39. Admin Flow',
    slug: 'admin-flow',
    category: 'architecture_flows',
    summary: 'Admin operational workflows for developer vetting, order overrides, dispute arbitration, and asset moderation.',
    tags: ['Admin Flow', 'Operational Workflows'],
    keyTakeaways: [
      'Daily Admin Routine: Review Pending Developers -> Resolve Escalated Disputes -> Moderate Submitted Assets -> Audit Logs Inspection.',
      'Full administrative authority over platform fees, user statuses, and escrow releases.'
    ],
    contentMarkdown: `
# 39. Admin Flow

1. Admin logs into /admin/dashboard.
2. Inspects pending developer applications -> Approves or Rejects portfolios.
3. Reviews active disputes -> Reads evidence, tests RBXL files -> Issues Escrow release or refund verdict.
4. Inspects pending Share Assets -> Audits Lua security scan -> Marks Approved or Rejected.
`
  },
  {
    id: 40,
    title: '40. Asset Flow',
    slug: 'asset-flow',
    category: 'architecture_flows',
    summary: 'Lifecycle of a Share Asset from initial upload to public download and moderation.',
    tags: ['Asset Flow', 'Lifecycle'],
    keyTakeaways: [
      'Upload -> Malware/AST Script Scan -> Admin Moderation Queue -> Approved -> Public Library -> Track Downloads & Audits.'
    ],
    contentMarkdown: `
# 40. Asset Flow

### Asset Moderation Pipeline
1. **Upload**: Creator submits Title, Category, Version, Docs, and RBXL/ZIP File.
2. **Security Scan**: Automated Lua AST & malware scanner runs instantly.
3. **Failed Scan**: If malicious scripts detected -> Automatically Rejected.
4. **Moderation**: If passed scan -> Moves to Pending Moderation queue for Admin inspection.
5. **Approval**: Admin tests file -> Approved & Published to public library.
6. **Tracking**: Public download enabled; all access logged in audit history.
`
  },
  {
    id: 41,
    title: '41. Order Flow',
    slug: 'order-flow',
    category: 'architecture_flows',
    summary: 'Step-by-step state transition flow for a Kaevy Studio commission order.',
    tags: ['Order Flow', 'Escrow Lifecycle'],
    keyTakeaways: [
      'Brief Creation -> Escrow Deposit -> Developer Assignment -> Milestone Checkpoints -> Submission -> Approval -> Warranty.'
    ],
    contentMarkdown: `
# 41. Order Flow

1. **Client Brief**: Fills details, map theme, budget, reference images. Order ID generated (\`KVS-20260731-001\`).
2. **Deposit**: Client deposits funds into Kaevy Escrow Vault. Status: \`Paid\`.
3. **Assignment**: Verified developer accepts order. Status: \`Developer Assigned\`. Queue slot used (1/3).
4. **Execution**: Developer posts progress (25% Graybox, 50% Scripting, 75% Polish). Status: \`In Progress\`.
5. **Submission**: Developer uploads final \`.rbxl\` package. Status: \`Submitted\`.
6. **Approval**: Client tests project, approves delivery. Escrow releases 90% to developer wallet; 10% platform fee retained. Status: \`Completed\`.
7. **Warranty**: Order enters 30-Day Bug Warranty period. Status: \`Warranty\`.
`
  },
  {
    id: 42,
    title: '42. Payment Flow',
    slug: 'payment-flow',
    category: 'architecture_flows',
    summary: 'Financial flow from client payment gateway to platform escrow holding and developer payout.',
    tags: ['Payment Flow', 'Financial Engine'],
    keyTakeaways: [
      'Client Gateway Payment -> Platform Escrow Vault -> (On Approval) 90% Developer Balance + 10% Kaevy Revenue -> Developer Payout Request.'
    ],
    contentMarkdown: `
# 42. Payment Flow

### Payment & Escrow Pipeline
1. **Client Deposit**: Client pays order amount ($500) via Payment Gateway.
2. **Escrow Locking**: Kaevy Studio Escrow Vault holds $500 securely.
3. **Execution & Delivery**: Developer completes order deliverables.
4. **Approval & Split**: Client approves delivery -> Platform splits funds:
   - **Developer Wallet**: $450 Credited (90% Net Earning).
   - **Kaevy Platform Revenue**: $50 Retained (10% Commission).
5. **Payout Withdrawal**: Developer requests payout withdrawal to Bank / PayPal.
`
  },
  {
    id: 43,
    title: '43. Error States',
    slug: 'error-states',
    category: 'quality_ops',
    summary: 'System error handling, HTTP status mapping, user-facing error dialogs, and recovery steps.',
    tags: ['Error Handling', 'UX Resilience'],
    keyTakeaways: [
      'Standardized error dialogs with actionable error codes and clear troubleshooting instructions.',
      'Automatic session recovery for interrupted file uploads and network drops.'
    ],
    contentMarkdown: `
# 43. Error States

- **Payment Failure**: "Your deposit could not be processed. Escrow funds were not deducted. Please check your payment method and retry."
- **Developer Queue Full**: "This developer has reached their maximum active projects simultaneously limit. Please choose another verified developer or join their waitlist."
- **Malicious File Detected**: "Upload rejected: The file contains prohibited Lua execution functions (getfenv / external require). Please remove backdoor scripts and re-upload."
`
  },
  {
    id: 44,
    title: '44. Edge Cases',
    slug: 'edge-cases',
    category: 'quality_ops',
    summary: 'Corner cases and unexpected user behaviors requiring pre-engineered safeguards.',
    tags: ['Edge Cases', 'Safeguards'],
    keyTakeaways: [
      'Unresponsive Client after submission: Auto-approval after 7 days.',
      'Unresponsive Developer after accepting assignment: Auto-reassign or 100% refund after 48 hours of zero progress.',
      'Simultaneous developer assignment when only 1 queue slot remains: Locked with database row level lock.'
    ],
    contentMarkdown: `
# 44. Edge Cases

1. **Client Ghosting**: If developer submits 100% complete deliverable and client does not respond within 7 calendar days, system triggers \`Auto-Approval\` and releases escrow to developer.
2. **Developer Abandonment**: If developer accepts order but fails to post 1st checkpoint within agreed start window (e.g., 48 hours), system cancels assignment, restores queue slot, and offers client option to reassign or receive 100% refund.
3. **Queue Race Condition**: Database uses \`SELECT ... FOR UPDATE\` transaction locks when assigning orders to prevent developer exceeding active project limit.
`
  },
  {
    id: 45,
    title: '45. Empty States',
    slug: 'empty-states',
    category: 'quality_ops',
    summary: 'UX designs for initial or empty state conditions across all platform screens.',
    tags: ['Empty States', 'UX Guidance'],
    keyTakeaways: [
      'Empty state screens feature helpful iconography, informative messaging, and clear CTA buttons.',
      'New Client: "No active orders yet. Browse our Service Marketplace to start your first Roblox project."'
    ],
    contentMarkdown: `
# 45. Empty States

- **No Orders**: Displays illustration + "You haven't placed any Roblox commissions yet." + CTA \`[Explore Marketplace Services]\`.
- **No Share Assets Found**: "No digital assets matched your filter criteria." + CTA \`[Reset Filters]\` or \`[Upload New Asset]\`.
- **No Developer Reviews**: "This developer hasn't completed their first order yet. Be their first client with Escrow-based payment protection!"
`
  }
];
