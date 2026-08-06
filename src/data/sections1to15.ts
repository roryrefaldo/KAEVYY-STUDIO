import { PRDSection } from '../types/prd';

export const sections1to15: PRDSection[] = [
  {
    id: 1,
    title: '1. Executive Summary',
    slug: 'executive-summary',
    category: 'overview',
    summary: 'Platform high-level vision, core value propositions, target market, and system paradigm.',
    tags: ['Overview', 'Strategic Vision', 'Escrow', 'Roblox'],
    keyTakeaways: [
      'KAEVY STUDIO is a Managed Roblox Development Platform, not just a freelance listing site.',
      'Acts as a trusted escrow and quality assurance proxy between Roblox Game Creators (Clients) and Vetted Developers.',
      'Includes an integrated Share Asset digital library for community resources and reusable code/models.'
    ],
    contentMarkdown: `
# 1. Executive Summary

**KAEVY STUDIO** is a specialized, managed **Roblox Development & Digital Asset Platform**. It transforms the traditionally fragmented, high-risk Roblox freelance commission market into a secure, standardized, professional digital studio marketplace.

### Key Pillars
1. **Managed Escrow & Trust Layer**: Client funds are secured in escrow upon order creation. Payouts are released to developers only after checkpoint/final milestone sign-off or resolution of dispute windows.
2. **Standardized Workflows & Developer Queue**: Enforces developer capacity limits (Verified = 3 max, Elite = 5 max active projects simultaneously) to maintain delivery reliability, prevent burnout, and guarantee project quality.
3. **Structured Warranty & Dispute Guardrails**: Standard 30-day bug warranty protects clients, while clear scope-creep rules protect developer work.
4. **Share Asset Digital Library**: Integrated resource repository allowing verified creators and admins to publish, document, and distribute RBXL, Lua scripts, 3D models, and developer tools.

### Operational Model
> **CLIENT** → (1. Deposit & Brief) → **KAEVY STUDIO ESCROW & QA** → (2. Assign & Queue) → **VERIFIED DEVELOPER**
>                                                │
>                                      (3. Milestones & Audit)
>                                                │
>                                     (4. Inspection & Warranty)
>                                                │
> **CLIENT** ← (5. Approved Assets) ◄──────────────┼──────────────► (6. Released Earning - 10% Fee) → **DEVELOPER**
`
  },
  {
    id: 2,
    title: '2. Product Vision',
    slug: 'product-vision',
    category: 'overview',
    summary: 'Long-term goal to become the world standard for Roblox game studio delegation and developer asset economy.',
    tags: ['Vision', 'Market Positioning', 'Ecosystem'],
    keyTakeaways: [
      'Eliminate scam risk in Roblox developer commissions.',
      'Establish a gold standard for Lua / RBXL code quality, building, and UI design.',
      'Foster a thriving creator economy with verified asset distribution.'
    ],
    contentMarkdown: `
# 2. Product Vision

To become the primary, gold-standard infrastructure platform for Roblox studio outsourcing, talent recruitment, project execution, and digital asset sharing across Southeast Asia and global Roblox development ecosystems.

### Strategic Benchmarks
- **Scam Reduction Objective**: Target <0.1% fraudulent non-deliveries through system-enforced Escrow Vault workflow & Milestone verification.
- **Top 1% Talent Pool**: Gamified reputation, completion metrics, and transparent portfolio verification for developers.
- **Unified Ecosystem**: A seamless blend of custom studio services (Map building, Scripting, UI/UX, 3D Modeling, Animation) and pre-built modular Assets (RBXL, RBXLX, Lua plugins).
`
  },
  {
    id: 3,
    title: '3. Problem Statement',
    slug: 'problem-statement',
    category: 'overview',
    summary: 'Core friction points in existing Roblox freelance channels (Discord servers, Twitter, Talent Hub).',
    tags: ['Problems', 'Pain Points', 'Market Analysis'],
    keyTakeaways: [
      'Frequent scamming via Discord/Twitter un-collateralized upfront payments.',
      'Overcommitted developers taking 10+ projects and missing deadlines.',
      'Lack of post-delivery bug support or clear contractual scope boundaries.',
      'No centralized secure hub for free/paid Roblox development asset files with documentation.'
    ],
    contentMarkdown: `
# 3. Problem Statement

### Market Friction Analysis
1. **Client Trust Deficit**:
   - Clients frequently lose money to rogue developers who accept 50%-100% upfront deposits on Discord and ghost.
   - Deliverables are often bug-infested or fail to work on live Roblox servers.
2. **Developer Exploitation & Scope Creep**:
   - Freelance developers suffer from endless unpaid revision loops, vague client specifications, and delayed payments after project submission.
3. **Capacity & Reliability Breakdown**:
   - Developers over-promise by accepting more tasks than humanly manageable, causing project delays and abandoned codebases.
4. **Fragmented Asset Distribution**:
   - Developer tools and open-source RBXL files are scattered across shady Google Drive links or Discord attachments with zero security scanning or documentation standards.
`
  },
  {
    id: 4,
    title: '4. Product Goals',
    slug: 'product-goals',
    category: 'overview',
    summary: 'Measurable success criteria and operational objectives for Kaevy Studio.',
    tags: ['Goals', 'KPIs', 'Metrics'],
    keyTakeaways: [
      'Achieve >98% milestone delivery satisfaction.',
      'Maintain average dispute resolution timeframe under 48 hours.',
      'Sustain developer completion rates above 92% with active queue enforcement.'
    ],
    contentMarkdown: `
# 4. Product Goals

### Key Performance Indicators (KPIs)
- **Escrow Workflow Coverage**: 100% of order payments processed through Kaevy Studio Escrow Vault before developer assignment.
- **Order Delivery Reliability Objective**: >95% on-time project completion enforced by Developer Queue limits.
- **Warranty Resolution Speed Target**: <24 hours average response time for valid 30-day bug warranty claims.
- **Asset Share Inspection Target**: 100% of public Share Assets verified with Title, 1-10 Documentation blocks, and automated/manual malware security inspection.
`
  },
  {
    id: 5,
    title: '5. Non-Goals',
    slug: 'non-goals',
    category: 'overview',
    summary: 'Explicit boundaries and features outside the immediate scope of Kaevy Studio.',
    tags: ['Scope Boundaries', 'Non-Goals'],
    keyTakeaways: [
      'Not a generic freelance platform (Fiverr/Upwork) for non-Roblox topics.',
      'Not a direct Robux trading site or off-platform grey-market currency exchanger.',
      'Not an unmoderated peer-to-peer chat forum without transaction tracking.'
    ],
    contentMarkdown: `
# 5. Non-Goals

1. **Non-Roblox Freelancing**: Kaevy Studio will NOT support non-Roblox development categories (e.g. general web dev, video editing outside Roblox trailers).
2. **Off-Platform Payment Bypassing**: Direct cash/Robux handoffs outside Kaevy Studio escrow are prohibited to maintain warranty and platform liability guarantees.
3. **Automated Code Execution / Real-time In-Game Injection**: The platform providesRBXL / Lua download files; it does NOT execute code directly inside live Roblox game servers via HTTP service without user implementation.
`
  },
  {
    id: 6,
    title: '6. Target Users',
    slug: 'target-users',
    category: 'overview',
    summary: 'Demographic breakdown and target segments for Kaevy Studio.',
    tags: ['Audience', 'Demographics', 'Market Segments'],
    keyTakeaways: [
      'Roblox Game Studio Owners & Group Owners looking for vetted talent.',
      'Roblox Builders, Scripters, UI Designers, 3D Modelers seeking stable commissions.',
      'Platform Admins & QA Moderators ensuring studio quality standard.'
    ],
    contentMarkdown: `
# 6. Target Users

### Primary Market Segments
- **Roblox Group/Game Owners (Clients)**: Individuals or teams funding Roblox games, requiring professional custom maps, complex Lua scripting (combat systems, data stores, UI), 3D assets, or full game frameworks.
- **Roblox Developers / Freelancers**: Specialized scripters, builders, UI designers, animators, and VFX artists looking for secure payouts, steady project queues, and portfolio exposure.
- **Community Resource Consumers**: Roblox developers looking for verified, high-quality open-source assets, UI kits, RBXL templates, and utility scripts in Share Asset.
`
  },
  {
    id: 7,
    title: '7. User Personas',
    slug: 'user-personas',
    category: 'overview',
    summary: 'Detailed user profiles representing Client, Developer, and Admin operational needs.',
    tags: ['Personas', 'User Profiles'],
    keyTakeaways: [
      'Client Persona: Alex - Roblox Studio Founder needing guaranteed delivery for a $1,000 RPG map.',
      'Developer Persona: Kevin - Advanced Lua Scripter wanting structured orders without client ghosting within simultaneous capacity limits.',
      'Admin Persona: Sarah - Kaevy Studio Manager overseeing escrow, vetting talent, and inspecting asset uploads.'
    ],
    contentMarkdown: `
# 7. User Personas

### Persona A: Alex (Client - Game Studio Owner)
- **Background**: Manages a Roblox game group with 50,000 members.
- **Goals**: Order a custom Simulator Map with complete lighting and props under a strict $800 budget and 14-day deadline.
- **Pain Points**: Got scammed $300 on Discord last month; developers ghosted half-finished models.
- **Needs**: Secured Escrow, milestone tracking, 30-day bug warranty, direct chat with verified builder.

### Persona B: Kevin (Developer - Lua Scripter)
- **Background**: 4 years experience scripting Roblox custom inventories, DataStore2, and combat engines.
- **Goals**: Focus purely on coding without chasing unpaid invoices or endless unbudgeted client feature additions.
- **Pain Points**: Clients demanding free extra work after delivery or refusing to pay final balance.
- **Needs**: Clear project brief, locked scope, guaranteed platform payment upon client milestone approval, reputation rating.

### Persona C: Sarah (Admin - Kaevy Studio Lead)
- **Background**: Senior Roblox project manager and quality controller.
- **Goals**: Maintain high platform dispute resolution integrity, review developer applications, moderate uploaded assets.
- **Pain Points**: Dealing with malicious file uploads or unverified developers spamming client inboxes.
- **Needs**: Comprehensive Admin Dashboard, Audit Logs, Dispute Center, Developer Queue Override, Asset Moderation tools.
`
  },
  {
    id: 8,
    title: '8. User Roles & Permissions',
    slug: 'user-roles-permissions',
    category: 'roles',
    summary: 'RBAC (Role-Based Access Control) matrix defining privileges across Client, Developer, and Admin roles.',
    tags: ['RBAC', 'Permissions', 'Security Matrix'],
    keyTakeaways: [
      'Clients can create orders, deposit funds, review work, download purchased/public assets, and open disputes.',
      'Developers can claim/accept assigned orders, update checkpoints, submit deliverables, track earnings, and publish assets.',
      'Admins hold global privileges: order escrow release, developer approval/suspension, dispute judgment, asset moderation, fee adjustments.'
    ],
    contentMarkdown: `
# 8. User Roles & Permissions

| Capability / Resource | CLIENT | DEVELOPER | ADMIN |
| :--- | :---: | :---: | :---: |
| Account Registration / Profile Edit | ✅ | ✅ | ✅ |
| Browse Marketplace & Share Assets | ✅ | ✅ | ✅ |
| Create Order & Deposit to Escrow | ✅ | ❌ | ✅ (Override) |
| Accept Project / Submit Work | ❌ | ✅ (If Verified & Queue Open) | ✅ (Assign) |
| Download Public Share Asset | ✅ | ✅ | ✅ |
| Upload Share Asset | ❌ (Client) / Restricted | ✅ (Verified) | ✅ (Unrestricted) |
| Moderate / Delete Share Asset | ❌ | ❌ | ✅ |
| Approve Milestones / Release Escrow | ✅ | ❌ | ✅ (Force Release) |
| Dispute Resolution & Refund | ❌ (Initiate Only) | ❌ (Respond Only) | ✅ (Final Verdict) |
| View System Audit Logs & Fee Config | ❌ | ❌ | ✅ |
`
  },
  {
    id: 9,
    title: '9. Business Model',
    slug: 'business-model',
    category: 'business',
    summary: 'Monetization strategy, Platform Fee structure, Escrow mechanics, and financial guardrails.',
    tags: ['Business Model', 'Monetization', 'Platform Fee', 'Escrow'],
    keyTakeaways: [
      'Standard Platform Fee: Configurable 10% taken from gross order amount upon project completion.',
      'Escrow Model: Funds held in Kaevy Escrow Vault during project execution.',
      'Payout Pipeline: Developer receives 90% net earnings directly to withdrawal balance after client approval or warranty clearance.'
    ],
    contentMarkdown: `
# 9. Business Model

### Revenue Breakdown
Kaevy Studio operates as a managed platform commission model:
- **Platform Fee Rate**: Default **10.0%** (Configurable in Admin Settings from 0% to 25%).
- **Calculation Formula**:
  - Gross Order Amount = Base Service Price + Custom Scope Adjustments
  - Platform Fee = Gross Order Amount x 10%
  - Developer Earning = Gross Order Amount - Platform Fee

### Example Transaction Breakdown (Order #KVS-20260731-001)
- Client Total Payment: **$500.00**
- Held in Kaevy Escrow: **$500.00**
- Upon Final Approval & Warranty Clearance:
  - Developer Net Credit: **$450.00** (90%)
  - Kaevy Studio Platform Revenue: **$50.00** (10%)
`
  },
  {
    id: 10,
    title: '10. Core Product Features',
    slug: 'core-product-features',
    category: 'features',
    summary: 'High-level mapping of all 22 core modules forming the Kaevy Studio platform ecosystem.',
    tags: ['Features', 'System Modules', 'Core Capabilities'],
    keyTakeaways: [
      'Includes Authentication, 3 Role Dashboards, Service Marketplace, Escrow Engine, Developer Queue.',
      'Features Dispute Management, 30-Day Warranty System, Real-time Project Chat, and Share Asset Hub.',
      'Equipped with Admin Audit Logging, Fee Adjustment Controls, and Security Malware Scanning.'
    ],
    contentMarkdown: `
# 10. Core Product Features

1. **Authentication & Identity Hub**: Multi-role login, OAuth Discord/Google, profile verification badges.
2. **Service Marketplace**: Categorized Roblox service listings (Scripting, Map Building, UI/UX, 3D Assets, VFX, Full Game).
3. **Developer Directory & Reputation**: Portfolio showcases, verified developer tiers, queue status, completion rates.
4. **Order Brief & Escrow Deposit**: Form wizard with budget, references, Discord/WhatsApp sync, RBXL specifications.
5. **Developer Capacity Queue**: Automatic blocking of developer assignment if active project count reaches max limit (Verified Developer = 3 active projects simultaneously, Elite Developer = 5 active projects simultaneously across active statuses: Developer Assigned, In Progress, Revision).
6. **Milestone & Progress Tracker**: Step-by-step checkpoint updates, progress percentages, screenshot/video proofs.
7. **Escrow Vault & Payment Engine**: Multi-currency payment gateway proxy, escrow holding, payout releases.
8. **30-Day Bug Warranty Engine**: Automated warranty tracker protecting clients against code/asset bugs after delivery.
9. **Dispute & Refund Resolution Center**: Managed arbitration hub for clients and developers with Admin verdict controls.
10. **SHARE ASSET Resource Hub**: Public/Private digital file library for RBXL, Lua scripts, 3D models with documentation & moderation.
11. **Admin Audit & Analytics Suite**: Complete activity tracking, revenue metrics, developer performance, system settings.
`
  },
  {
    id: 11,
    title: '11. Detailed Feature Requirements',
    slug: 'detailed-feature-requirements',
    category: 'features',
    summary: 'Granular specification matrix outlining requirements for every functional subsystem.',
    tags: ['Specifications', 'Requirements Matrix'],
    keyTakeaways: [
      'All orders generated with unique format KVS-YYYYMMDD-XXX.',
      'Files validated for size, extension, MIME type, and security risk prior to storage.',
      'Notifications dispatched via system bell, email, and integrated Discord webhook hooks.'
    ],
    contentMarkdown: `
# 11. Detailed Feature Requirements

### System Specification Standards
- **Order ID Generation**: \`KVS-YYYYMMDD-[3-Digit Auto Increment]\` (e.g. \`KVS-20260731-001\`).
- **File Upload Limits**: Max 50MB for general brief attachments; Max 500MB for Share Asset RBXL/ZIP archives.
- **Allowed Asset Extensions**: \`.zip\`, \`.rar\`, \`.7z\`, \`.rbxl\`, \`.rbxlx\`, \`.png\`, \`.jpg\`, \`.psd\`, \`.blend\`, \`.fbx\`, \`.obj\`, \`.lua\`, \`.json\`, \`.mp4\`, \`.mp3\`, \`.pdf\`, \`.docx\`.
- **System Notification Events**: Order status change, Checkpoint updated, New message, Dispute filed, Warranty ticket created, Asset approved/rejected.
`
  },
  {
    id: 12,
    title: '12. Client Experience',
    slug: 'client-experience',
    category: 'experiences',
    summary: 'End-to-end journey and interface blueprint for Client users.',
    tags: ['Client Journey', 'UX Blueprint', 'Client Portal'],
    keyTakeaways: [
      'Streamlined 4-step order placement wizard.',
      'Interactive project dashboard with live progress bar and direct developer messaging.',
      'One-click milestone sign-off, invoice generation, rating submission, and bug warranty claim button.'
    ],
    contentMarkdown: `
# 12. Client Experience

### Journey Steps
1. **Discovery**: Client browses Service Marketplace or Developer Directory, filtering by Roblox skill, price, and developer queue availability.
2. **Order Briefing**: Client fills order wizard: Project name, Map theme, Detailed description, References, Discord/WhatsApp handles, Budget, and RBXL files.
3. **Escrow Deposit**: Client pays total via payment gateway. Order enters \`Paid\` / \`Pending Developer Acceptance\`.
4. **Execution & Supervision**: Client tracks live checkpoint updates (e.g., 25% Graybox, 50% Scripting, 75% Polishing, 100% Final Review), reviews screenshots, and communicates in order chat.
5. **Acceptance & Warranty**: Client inspects final files, signs off (releasing escrow to developer), leaves rating & review, and gains access to 30-Day Bug Warranty.
`
  },
  {
    id: 13,
    title: '13. Developer Experience',
    slug: 'developer-experience',
    category: 'experiences',
    summary: 'End-to-end workflow and interface blueprint for Developer users.',
    tags: ['Developer Journey', 'Developer Portal', 'Workflows'],
    keyTakeaways: [
      'Developer workspace showing assigned projects, queue slots (e.g., 2/3 active), and pending earnings.',
      'Checkpoint update modal with progress slider and file/screenshot attachment upload.',
      'Payout dashboard displaying escrow release history and withdrawal request controls.'
    ],
    contentMarkdown: `
# 13. Developer Experience

### Journey Steps
1. **Verification & Onboarding**: Developer submits portfolio, specialization (e.g. Scripter / Builder), and Discord handle for Admin verification.
2. **Project Acceptance**: Verified developer receives project invitation or claims available order from pool (if queue slot available).
3. **Project Execution**: Developer uploads progress proof at each milestone checkpoint, keeping client updated in real time.
4. **Deliverable Submission**: Developer uploads completed \`.rbxl\` / \`.zip\` package and triggers \`Client Review\`.
5. **Earning Release**: Upon client approval, net earnings (90%) are instantly deposited into developer wallet balance.
`
  },
  {
    id: 14,
    title: '14. Admin Experience',
    slug: 'admin-experience',
    category: 'experiences',
    summary: 'Management suite blueprint for Admin users controlling operations, security, and quality.',
    tags: ['Admin Portal', 'Operations', 'Control Suite'],
    keyTakeaways: [
      'Centralized command dashboard with live Escrow balance, Active orders, Developer queue status, and Disputes.',
      'Talent verification manager for reviewing developer portfolios and adjusting capacity limits.',
      'Share Asset moderation queue for approving or hiding user-submitted asset files.'
    ],
    contentMarkdown: `
# 14. Admin Experience

### Admin Control Capabilities
- **Order Lifecycle Management**: Force re-assign developer, extend deadline, override order status, initiate partial/full refund.
- **Developer Capacity & Verification**: Review pending developer profiles, approve verified badges, enforce maximum active project capacity limits per developer (Verified = 3 active projects, Elite = 5 active projects simultaneously).
- **Dispute Arbitration**: Inspect order brief, chat logs, deliverable files, and issue final binding payout or refund verdict.
- **Asset Moderation**: Review pending Share Assets, test file download safety, mark as Featured, or reject malicious scripts.
`
  },
  {
    id: 15,
    title: '15. Authentication & Authorization',
    slug: 'authentication-authorization',
    category: 'roles',
    summary: 'Security framework for identity management, session handling, JWT tokens, and Discord OAuth integration.',
    tags: ['Auth', 'JWT', 'OAuth', 'Security'],
    keyTakeaways: [
      'Bcrypt password hashing (salt round 12) + HttpOnly secure JWT cookies.',
      'Discord OAuth2 integration for fast login and group membership verification.',
      'Role-based middleware enforcing API route guards for Client, Developer, and Admin access.'
    ],
    contentMarkdown: `
# 15. Authentication & Authorization

### Architecture
- **Authentication Standard**: JSON Web Tokens (JWT) stored in \`HttpOnly\`, \`SameSite=Lax\`, \`Secure\` cookies with 7-day expiration.
- **OAuth Providers**: Discord OAuth2 (Primary for Roblox community identity) + Google Sign-In.
- **Password Security**: Argon2id or Bcrypt (cost factor 12).
- **Session Management**: Server-side session invalidation via token blacklist table in database upon logout or password reset.
`
  }
];
