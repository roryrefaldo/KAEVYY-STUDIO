import { PRDSection } from '../types/prd';

export const sections16to30: PRDSection[] = [
  {
    id: 16,
    title: '16. Service Marketplace',
    slug: 'service-marketplace',
    category: 'features',
    summary: 'Catalog architecture for Roblox development services, pricing tiers, and delivery packages.',
    tags: ['Marketplace', 'Services', 'Pricing Tiers'],
    keyTakeaways: [
      'Services categorized into Scripting, Map Building, UI/UX, 3D Asset Modeling, Animation/VFX, Full Game.',
      'Includes Basic, Standard, and Premium package tiers with explicit deliverable checklists.',
      'Dynamic search, filter by price range, delivery time, and developer rating.'
    ],
    contentMarkdown: `
# 16. Service Marketplace

### Service Categories
1. **Roblox Lua Scripting**: Frameworks, DataStores, Combat, Inventory, Pet Systems, Admin Commands, Custom APIs.
2. **Environment & Map Building**: Simulators, Realistic Terrain, Low-Poly Maps, Lighting, Prop Placement.
3. **UI / UX Design & Scripting**: Vector UI Kits, HUD Layouts, Animated Menus, Shop UIs, Custom Tweens.
4. **3D Modeling & Texturing**: Custom Characters, Accessories, Weapons, Vehicles, Blender FBX/OBJ to Roblox Studio.
5. **Animation & VFX**: Character Animations, Combat Abilities, Particle Effects, Cutscenes.
6. **Full Game Studio Studio Projects**: Turnkey game production from GDD to release-ready RBXL file.
`
  },
  {
    id: 17,
    title: '17. Order Management',
    slug: 'order-management',
    category: 'order_system',
    summary: 'Comprehensive order lifecycle, status state transitions, and tracking specifications.',
    tags: ['Order System', 'Lifecycle', 'State Machine'],
    keyTakeaways: [
      'Order Status Flow: Pending, Review, Waiting Payment, Paid, Developer Assigned, In Progress, Submitted, Client Review, Revision, Completed, Warranty, Closed.',
      'Automated Order ID generation: KVS-YYYYMMDD-XXX.',
      'Checkpoints allow progressive milestone tracking with proof uploads.'
    ],
    contentMarkdown: `
# 17. Order Management

### Order State Machine Lifecycle
- **Step 1 (Created)**: Brief submitted by client, awaiting feasibility check.
- **Step 2 (Waiting Payment)**: Scope verified; client deposits funds into Kaevy Escrow Vault.
- **Step 3 (Paid)**: Funds locked in Escrow; order queued for developer assignment.
- **Step 4 (Developer Assigned)**: Verified developer accepts order; queue slot decremented.
- **Step 5 (In Progress)**: Developer actively working; checkpoints updated.
- **Step 6 (Submitted)**: Developer uploads final RBXL deliverables for client review.
- **Step 7 (Completed)**: Client approves work; escrow released; rating unlocked; 30-day warranty starts.

### Detailed Status Definitions
- **Pending Review**: Brief submitted by client, awaiting admin/developer feasibility check.
- **Waiting Payment**: Order scope verified; client must deposit funds into Kaevy Escrow.
- **Paid**: Funds locked in Escrow Vault; order queued for developer assignment.
- **Developer Assigned**: Verified developer accepts order; queue slot decremented.
- **In Progress**: Developer actively working; checkpoints updated.
- **Submitted**: Developer uploads final .rbxl deliverables for client review.
- **Revision**: Client requests adjustments within original scope.
- **Completed**: Client approves work; escrow released; rating unlocked; 30-day warranty starts.
- **Warranty**: Active 30-day bug warranty period.
- **Dispute**: Order frozen due to unresolved conflict; escalated to Admin arbitration.
`
  },
  {
    id: 18,
    title: '18. Payment & Escrow',
    slug: 'payment-escrow',
    category: 'order_system',
    summary: 'Escrow Vault architecture, payout releases, multi-payment gateway integration, and financial security.',
    tags: ['Escrow', 'Payment Gateway', 'Payouts'],
    keyTakeaways: [
      'Funds locked securely upon client deposit; developer cannot withdraw before client sign-off or admin verdict.',
      '10% platform commission auto-deducted at point of escrow release.',
      'Supports credit cards, PayPal, Midtrans / Local Bank Transfer, and crypto/Robux equivalency logs.'
    ],
    contentMarkdown: `
# 18. Payment & Escrow

### Escrow Vault Mechanics
1. **Deposit Guard**: Money paid by client is held in isolated platform Escrow Vault ledger account (\`ESCROW_HOLDING_ACCOUNT\`).
2. **Milestone Partial Escrow (Optional)**: For orders over $1,000, funds can be split into 50% Mid-point / 50% Final release milestones.
3. **Release Trigger**: Escrow released ONLY when:
   - Client clicks \`Approve & Release Payment\` in Order Dashboard.
   - Client fails to respond within 7 days after final deliverable submission (Auto-Release Safety Guard).
   - Admin resolves dispute in favor of developer.
4. **Refund Trigger**:
   - Developer fails to start order within deadline window.
   - Admin resolves dispute in favor of client (Full or Partial refund).
`
  },
  {
    id: 19,
    title: '19. Developer Management',
    slug: 'developer-management',
    category: 'experiences',
    summary: 'Developer onboarding, portfolio verification, badge tiers, and performance monitoring.',
    tags: ['Developers', 'Verification', 'Talent Tiers'],
    keyTakeaways: [
      'Verification Tiers: Pending -> Verified -> Gold Developer -> Elite Studio Partner.',
      'Suspension triggers for repeated missed deadlines, toxic conduct, or stolen asset submissions.',
      'Performance metrics track completion rate, average delivery speed, and client review score.'
    ],
    contentMarkdown: `
# 19. Developer Management

### Developer Status Matrix
- **Pending Verification**: Account registered; portfolio under admin review. Cannot accept orders.
- **Verified**: Approved talent; allowed up to standard max active project queue (maximum 3 active projects simultaneously).
- **Active / Elite**: Proven track record (>10 completed orders, >4.8 rating); queue limit up to maximum 5 active projects simultaneously.
- **Suspended**: Account frozen due to TOS violation, missed deadlines, or plagiarized code.
- **Rejected**: Application failed quality test or background verification.
`
  },
  {
    id: 20,
    title: '20. Developer Queue',
    slug: 'developer-queue',
    category: 'order_system',
    summary: 'Capacity management system preventing developer burnout, project delays, and quality degradation.',
    tags: ['Queue', 'Capacity Management', 'Quality Control'],
    keyTakeaways: [
      'Default limit: Max 3 active orders per developer per week (Configurable by Admin).',
      'System automatically hides developer from assignment pool when max queue capacity is reached.',
      'Protects client delivery deadlines and maintains studio output quality.'
    ],
    contentMarkdown: `
# 20. Developer Queue

### Business Logic
$$\\text{Active Projects} = \\text{Count of Orders where Status } \\in \\{\\text{'Developer Assigned'}, \\text{'In Progress'}, \\text{'Revision'}\\}$$
- If $\\text{Active Projects} \\ge \\text{Max Allowed Queue}$ (e.g. 3), system sets \`developer.is_queue_full = true\`.
- In the Service Marketplace & Developer Directory, full-queue developers display a badge: \`[QUEUE FULL - 3/3 Active Projects]\`.
- Clients cannot assign orders to a full-queue developer unless Admin applies an explicit queue override.
`
  },
  {
    id: 21,
    title: '21. Rating & Review',
    slug: 'rating-review',
    category: 'experiences',
    summary: 'Verified client review system with 5-star metric breakdown and developer responses.',
    tags: ['Ratings', 'Reviews', 'Reputation'],
    keyTakeaways: [
      'Reviews allowed ONLY after order is marked Completed by Client or Admin.',
      'Detailed rating criteria: Communication, Quality of Work, On-Time Delivery, Script/Build Cleanliness.',
      'Developers can post 1 official reply per review.'
    ],
    contentMarkdown: `
# 21. Rating & Review

### Rating Dimensions (1 to 5 Stars)
1. **Communication**: Responsiveness and clarity in order chat.
2. **Quality of Delivery**: Accuracy relative to initial project brief and references.
3. **On-Time Delivery**: Adherence to agreed project deadline.
4. **Code / Asset Cleanliness**: Organization of Roblox Studio Explorer hierarchy, Lua comment quality, mesh optimization.

Reviews are publicly displayed on the Developer's Profile and Service Marketplace cards.
`
  },
  {
    id: 22,
    title: '22. Dispute System',
    slug: 'dispute-system',
    category: 'order_system',
    summary: 'Managed dispute escalation, evidence collection, and admin arbitration workflow.',
    tags: ['Dispute', 'Arbitration', 'Refunds'],
    keyTakeaways: [
      'Either party can open dispute during In Progress, Submitted, or Revision states.',
      'Order funds remain locked in Escrow Vault while dispute is active.',
      'Admin inspects brief, chat logs, uploaded files, and issues binding verdict (100% Refund, Partial Split, or 100% Developer Payout).'
    ],
    contentMarkdown: `
# 22. Dispute System

### Dispute Process
1. **Initiation**: Client or Developer clicks \`Report Issue / Open Dispute\` from Order Dashboard.
2. **Evidence Submission Window (48 Hours)**: Both parties submit brief requirements, screenshot proofs, chat export, and explanation.
3. **Admin Review & Verdict**: Kaevy Admin inspects deliverables, tests RBXL files if applicable, and selects one of 3 outcomes:
   - **Full Refund to Client**: If developer failed to meet core brief specifications or abandoned project.
   - **Full Release to Developer**: If client requested out-of-scope work without paying extra or abused revision loops.
   - **Partial Split (e.g. 50/50 or 70/30)**: If partial work was delivered satisfactorily but final completion was mutually derailed.
`
  },
  {
    id: 23,
    title: '23. Warranty System',
    slug: 'warranty-system',
    category: 'order_system',
    summary: 'Post-delivery 30-day bug warranty coverage rules, scope boundaries, and ticket tracking.',
    tags: ['Warranty', 'Bug Fixes', 'Post-Delivery'],
    keyTakeaways: [
      'Default 30-day bug warranty automatically triggered upon order completion.',
      'Valid ONLY for bugs directly related to original delivered scope (e.g., Lua runtime errors, broken Datastore).',
      'Excludes new feature requests, total redesigns, or client-induced code tampering.'
    ],
    contentMarkdown: `
# 23. Warranty System

### Warranty Rules Matrix
| Scenario | Covered under 30-Day Warranty? | Action Required |
| :--- | :---: | :--- |
| Script throws Lua error when 10+ players join game | ✅ YES | Developer must release patch within 48h. |
| UI breaks on mobile device resolutions | ✅ YES | Developer adjusts UI scale/aspect ratio. |
| Client requests adding a new Pet Trading system | ❌ NO | Client must open a new custom order. |
| Code broken because Client modified Lua scripts after delivery | ❌ NO | Voided; developer can charge patch fee. |
| Client wants map converted from Low-Poly to Photorealistic | ❌ NO | Out of scope; requires new project. |
`
  },
  {
    id: 24,
    title: '24. Notification System',
    slug: 'notification-system',
    category: 'quality_ops',
    summary: 'Omni-channel notification architecture covering In-App, Email, and Discord Webhooks.',
    tags: ['Notifications', 'Discord Webhooks', 'Alerts'],
    keyTakeaways: [
      'In-App notification bell with real-time WebSocket / polling alerts.',
      'Discord Webhook integration sending private updates to Client/Developer Discord servers or DMs.',
      'Configurable notification preferences per user account.'
    ],
    contentMarkdown: `
# 24. Notification System

### Notification Channels
- **In-App Bell Alerts**: Badge counter in top navigation bar for all account events.
- **Discord Bot / Webhooks**: Instant notification sent directly to user's linked Discord handle.
- **Email Digest**: Immediate notification for financial events (Escrow deposit, Payout release, Dispute opened).
`
  },
  {
    id: 25,
    title: '25. SHARE ASSET',
    slug: 'share-asset',
    category: 'share_asset',
    summary: 'Core digital asset repository for Roblox models, scripts, UI kits, RBXL files, and developer resources.',
    tags: ['Share Asset', 'Digital Library', 'Roblox Resources'],
    keyTakeaways: [
      'Central hub at /share-assets for community and studio digital assets.',
      'Supports all file formats (.rbxl, .zip, .lua, .blend, .fbx, .psd, etc.) with ZIP strongly recommended.',
      'Public experience features search, category filter, download counts, license info, and asset detail pages.'
    ],
    contentMarkdown: `
# 25. SHARE ASSET

**Share Asset** is the digital resource library embedded within Kaevy Studio. It serves as a verified repository for Roblox developers to discover, preview, document, and download essential development assets.

### Key Capabilities
- **Universal Format Support**: Accepts RBXL, RBXLX, ZIP, RAR, 7Z, PNG, PSD, BLEND, FBX, OBJ, LUA, JSON, MP4, MP3, PDF.
- **Rich Documentation Requirement**: Every asset must contain detailed usage notes, installation instructions, script requirements, and license guidelines.
- **Malware & Script Security**: Automatic security screening checking for malicious Roblox backdoor scripts (\`require(asset_id)\`, \`getfenv\`, \`setfenv\`) prior to publication.
- **Public & Future Private Access Controls**: Flexible visibility schema designed for public free resources and future creator monetization/private studio assets.
`
  },
  {
    id: 26,
    title: '26. Asset Upload Flow',
    slug: 'asset-upload-flow',
    category: 'share_asset',
    summary: 'Step-by-step submission process for creators sharing assets.',
    tags: ['Upload Flow', 'Documentation', 'Asset Creation'],
    keyTakeaways: [
      'Form requires Asset Title, Category, Version, License, 1-10 Documentation blocks, and File Attachments.',
      'Automatic client & server file validation (MIME type, size, extension, checksum).',
      'Asset enters Pending Moderation status for Admin review.'
    ],
    contentMarkdown: `
# 26. Asset Upload Flow

### Submission Pipeline
1. **Details Entry**: Creator fills Asset Title, Category, Version, License.
2. **Documentation**: Adds 1 to 10 documentation blocks (Text, Screenshots, Requirements).
3. **File Attachment**: Attaches archive (ZIP, RBXL, LUA, Mesh) up to 500MB.
4. **Automated Security**: System performs integrity scan (Size, MIME, AST security check).
5. **Moderation Queue**: Asset enters Pending Moderation status for Admin review.

### Upload Form Requirements
1. **Asset Title**: Required (Max 100 characters, unique per creator).
2. **Category**: Required (e.g., Lua Scripts, Maps & Architecture, UI Kits, 3D Assets, VFX, Full RBXL Frameworks).
3. **Documentation**: Minimum 1 section, Maximum 10 sections. Each section includes section title and markdown content/screenshots.
4. **File Upload**: Minimum 1 file required. Maximum file size 500MB per archive.
`
  },
  {
    id: 27,
    title: '27. Asset Download Flow',
    slug: 'asset-download-flow',
    category: 'share_asset',
    summary: 'Secure asset browsing, detail viewing, and file download pipeline.',
    tags: ['Download Flow', 'Asset Detail', 'Public Assets'],
    keyTakeaways: [
      'Public users can search, filter, view preview screenshots, read documentation, and download assets.',
      'Download counter automatically incremented with IP rate-limiting to prevent download abuse.',
      'Direct secure download URL generated with tokenized one-time access link.'
    ],
    contentMarkdown: `
# 27. Asset Download Flow

1. User visits \`/share-assets\`.
2. Searches by keyword or filters by Category, File Extension, Upload Date, or Popularity.
3. Clicks asset card to open **Asset Detail Page** (\`/share-assets/:id\`).
4. Views preview images, version changelog, installation guide, and file checklist.
5. Clicks \`Download Asset\`. System verifies permissions, increments \`download_count\`, logs audit event, and delivers file payload.
`
  },
  {
    id: 28,
    title: '28. Asset Moderation',
    slug: 'asset-moderation',
    category: 'share_asset',
    summary: 'Admin moderation suite for reviewing, approving, featuring, or rejecting assets.',
    tags: ['Moderation', 'Safety', 'Admin Review'],
    keyTakeaways: [
      'Moderation States: Pending -> Approved / Rejected / Hidden / Removed.',
      'Admin capability to feature top quality assets on homepage banner.',
      'Reporting system allowing community users to flag stolen or broken assets.'
    ],
    contentMarkdown: `
# 28. Asset Moderation

### Moderation Actions
- **Approve**: Marks asset as \`Approved\` and publishes it to the public Share Asset library.
- **Reject**: Rejects submission with compulsory reason delivered to uploader.
- **Hide / Quarantine**: Instantly hides asset from public search if flagged for copyright or security inspection.
- **Feature / Unfeature**: Toggles \`is_featured = true\`, pinning asset to the top of Share Asset recommendations.
`
  },
  {
    id: 29,
    title: '29. Asset Permission',
    slug: 'asset-permission',
    category: 'share_asset',
    summary: 'Access control schema for asset visibility and download rights.',
    tags: ['Permissions', 'Access Control', 'Visibility'],
    keyTakeaways: [
      'Visibility Modes: Public (Everyone), Verified Only (Logged-in Verified Devs), Admin Only.',
      'Extensible database schema ready for Phase 2 Paid/Private asset access keys.',
      'Strict server-side route guards enforcing download permissions.'
    ],
    contentMarkdown: `
# 29. Asset Permission

### Permission Matrix
- **Public Asset**: Viewable and downloadable by all site visitors.
- **Verified Creator Asset**: Downloadable only by authenticated, verified developers or clients.
- **Private / Unlisted Asset**: Accessible only via direct shared token link or project assignment.
- **Admin Managed Asset**: Official Kaevy Studio studio assets published exclusively by platform administrators.
`
  },
  {
    id: 30,
    title: '30. Asset Data Structure',
    slug: 'asset-data-structure',
    category: 'share_asset',
    summary: 'Entity schema mapping for Assets, AssetFiles, AssetDocumentation, Categories, and Download Logs.',
    tags: ['Data Model', 'Asset Schema', 'Database'],
    keyTakeaways: [
      'Normalized schema linking Assets to Creator, Files, Documentation Blocks, Categories, and Tags.',
      'Includes security hash (SHA-256) for file verification and anti-duplication.',
      'Download audit table records IP, user ID, timestamp, and user agent.'
    ],
    contentMarkdown: `
# 30. Asset Data Structure

### Core Entities
- \`assets\`: Id, title, slug, creator_id, category_id, version, summary, license, visibility, moderation_status, download_count, view_count, is_featured, created_at.
- \`asset_files\`: Id, asset_id, file_name, file_path, file_size_bytes, file_extension, mime_type, sha256_hash, download_url.
- \`asset_documentation\`: Id, asset_id, section_order, section_title, content_markdown, screenshot_urls.
- \`asset_downloads\`: Id, asset_id, user_id, ip_address, downloaded_at.
`
  }
];
