import { DatabaseEntity } from '../types/prd';

export const databaseEntities: DatabaseEntity[] = [
  {
    name: 'Users',
    tableName: 'users',
    description: 'Central identity record for platform users (Clients, Developers, Admins).',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Unique user identifier' },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, description: 'Unique login email' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, description: 'Argon2id or Bcrypt password hash' },
      { name: 'full_name', type: 'VARCHAR(100)', nullable: false, description: 'User display name' },
      { name: 'discord_handle', type: 'VARCHAR(50)', nullable: true, description: 'Linked Discord username (e.g. user#1234)' },
      { name: 'whatsapp_number', type: 'VARCHAR(30)', nullable: true, description: 'Contact WhatsApp number' },
      { name: 'avatar_url', type: 'TEXT', nullable: true, description: 'Profile picture URL' },
      { name: 'role', type: 'ENUM', nullable: false, description: "Role type ('CLIENT', 'DEVELOPER', 'ADMIN')" },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Account status toggle' },
      { name: 'created_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Account registration timestamp' }
    ],
    relationships: [
      { type: '1:1', targetEntity: 'Profiles', description: 'User has one Profile' },
      { type: '1:N', targetEntity: 'Orders', description: 'User can create many Orders as Client' },
      { type: '1:N', targetEntity: 'Assets', description: 'User can upload many Share Assets' }
    ]
  },
  {
    name: 'Developers',
    tableName: 'developers',
    description: 'Specific profile and capacity metadata for Roblox development talent.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Developer record ID' },
      { name: 'user_id', type: 'UUID', isForeign: true, references: 'users.id', nullable: false, description: 'Linked user ID' },
      { name: 'specialization', type: 'VARCHAR(100)', nullable: false, description: 'Primary skill (Scripting, Building, UI/UX, 3D Modeling, Full Game)' },
      { name: 'verification_status', type: 'ENUM', nullable: false, description: "('PENDING', 'VERIFIED', 'GOLD', 'SUSPENDED', 'REJECTED')" },
      { name: 'max_active_queue', type: 'INTEGER', nullable: false, description: 'Max allowed active orders (Default 3)' },
      { name: 'current_active_count', type: 'INTEGER', nullable: false, description: 'Current ongoing order count' },
      { name: 'is_queue_full', type: 'BOOLEAN', nullable: false, description: 'Auto flag when current >= max' },
      { name: 'total_completed_orders', type: 'INTEGER', nullable: false, description: 'Lifetime completed project tally' },
      { name: 'average_rating', type: 'DECIMAL(3,2)', nullable: false, description: 'Current rating (1.00 to 5.00)' },
      { name: 'roblox_username', type: 'VARCHAR(50)', nullable: false, description: 'Official Roblox account username' }
    ],
    relationships: [
      { type: '1:N', targetEntity: 'Orders', description: 'Developer handles many assigned Orders' }
    ]
  },
  {
    name: 'Services',
    tableName: 'services',
    description: 'Marketplace service catalog listings offered by Kaevy Studio or verified developers.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Service ID' },
      { name: 'title', type: 'VARCHAR(150)', nullable: false, description: 'Service title' },
      { name: 'category', type: 'VARCHAR(50)', nullable: false, description: 'Roblox development category' },
      { name: 'base_price', type: 'DECIMAL(10,2)', nullable: false, description: 'Starting price in USD/IDR' },
      { name: 'estimated_days', type: 'INTEGER', nullable: false, description: 'Delivery duration in days' },
      { name: 'description', type: 'TEXT', nullable: false, description: 'Detailed package description' },
      { name: 'is_active', type: 'BOOLEAN', nullable: false, description: 'Service visibility flag' }
    ],
    relationships: [
      { type: '1:N', targetEntity: 'Orders', description: 'Service ordered in many Orders' }
    ]
  },
  {
    name: 'Orders',
    tableName: 'orders',
    description: 'Central project commission contract linking Client, Developer, Escrow, and Milestones.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Order ID' },
      { name: 'order_number', type: 'VARCHAR(30)', nullable: false, description: 'Unique order ID (e.g. KVS-20260731-001)' },
      { name: 'client_id', type: 'UUID', isForeign: true, references: 'users.id', nullable: false, description: 'Client user ID' },
      { name: 'developer_id', type: 'UUID', isForeign: true, references: 'developers.id', nullable: true, description: 'Assigned developer ID' },
      { name: 'service_id', type: 'UUID', isForeign: true, references: 'services.id', nullable: true, description: 'Service marketplace ID' },
      { name: 'project_title', type: 'VARCHAR(150)', nullable: false, description: 'Name of game or map' },
      { name: 'gross_amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Total price deposited by client' },
      { name: 'platform_fee_percent', type: 'DECIMAL(5,2)', nullable: false, description: 'Platform fee % (Default 10.00%)' },
      { name: 'platform_fee_amount', type: 'DECIMAL(10,2)', nullable: false, description: 'Gross * fee percent' },
      { name: 'developer_earning', type: 'DECIMAL(10,2)', nullable: false, description: 'Gross - platform fee' },
      { name: 'status', type: 'ENUM', nullable: false, description: "('PENDING', 'WAITING_PAYMENT', 'PAID', 'DEVELOPER_ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'CLIENT_REVIEW', 'REVISION', 'COMPLETED', 'WARRANTY', 'DISPUTED', 'CLOSED')" },
      { name: 'deadline', type: 'TIMESTAMPTZ', nullable: false, description: 'Agreed project deadline' }
    ],
    relationships: [
      { type: '1:N', targetEntity: 'OrderCheckpoints', description: 'Order has milestone progress checkpoints' },
      { type: '1:1', targetEntity: 'Payments', description: 'Order has payment record' },
      { type: '1:1', targetEntity: 'Warranties', description: 'Order has 30-day bug warranty record' }
    ]
  },
  {
    name: 'Assets',
    tableName: 'assets',
    description: 'Share Asset library digital resource records.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Asset ID' },
      { name: 'title', type: 'VARCHAR(150)', nullable: false, description: 'Asset Title' },
      { name: 'slug', type: 'VARCHAR(180)', nullable: false, description: 'URL friendly slug' },
      { name: 'creator_id', type: 'UUID', isForeign: true, references: 'users.id', nullable: false, description: 'Uploader user ID' },
      { name: 'category_id', type: 'UUID', isForeign: true, references: 'asset_categories.id', nullable: false, description: 'Category link' },
      { name: 'version', type: 'VARCHAR(20)', nullable: false, description: 'Semver format (e.g. 1.0.0)' },
      { name: 'license', type: 'VARCHAR(50)', nullable: false, description: 'License type' },
      { name: 'moderation_status', type: 'ENUM', nullable: false, description: "('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN', 'REMOVED')" },
      { name: 'download_count', type: 'INTEGER', nullable: false, description: 'Total successful downloads' },
      { name: 'is_featured', type: 'BOOLEAN', nullable: false, description: 'Featured banner flag' }
    ],
    relationships: [
      { type: '1:N', targetEntity: 'AssetFiles', description: 'Asset contains file records' },
      { type: '1:N', targetEntity: 'AssetDocumentation', description: 'Asset contains 1 to 10 documentation blocks' }
    ]
  },
  {
    name: 'AssetDocumentation',
    tableName: 'asset_documentation',
    description: 'Structured documentation sections for Share Assets (min 1, max 10).',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Doc section ID' },
      { name: 'asset_id', type: 'UUID', isForeign: true, references: 'assets.id', nullable: false, description: 'Parent asset ID' },
      { name: 'section_order', type: 'INTEGER', nullable: false, description: 'Order position (1 to 10)' },
      { name: 'section_title', type: 'VARCHAR(100)', nullable: false, description: 'Section title (e.g. Installation, Requirements)' },
      { name: 'content_markdown', type: 'TEXT', nullable: false, description: 'Markdown body text' }
    ],
    relationships: []
  },
  {
    name: 'Warranties',
    tableName: 'warranties',
    description: '30-Day Bug Warranty tracking record associated with completed orders.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Warranty ID' },
      { name: 'order_id', type: 'UUID', isForeign: true, references: 'orders.id', nullable: false, description: 'Parent order' },
      { name: 'start_date', type: 'TIMESTAMPTZ', nullable: false, description: 'Order completion date' },
      { name: 'expiration_date', type: 'TIMESTAMPTZ', nullable: false, description: '30 days post completion' },
      { name: 'status', type: 'ENUM', nullable: false, description: "('ACTIVE', 'EXPIRED', 'VOIDED', 'CLAIM_SUBMITTED')" },
      { name: 'total_claims', type: 'INTEGER', nullable: false, description: 'Bug report count' }
    ],
    relationships: []
  },
  {
    name: 'PaymentTransactions',
    tableName: 'payment_transactions',
    description: 'Indonesia-First payment transactions, gateway metadata, currency rates, and escrow ledger records.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Transaction ID' },
      { name: 'order_id', type: 'UUID', isForeign: true, references: 'orders.id', nullable: false, description: 'Parent order reference' },
      { name: 'client_id', type: 'UUID', isForeign: true, references: 'users.id', nullable: false, description: 'Payer user ID' },
      { name: 'payment_channel', type: 'ENUM', nullable: false, description: "('QRIS', 'BANK_TRANSFER_VA', 'E_WALLET', 'PAYPAL')" },
      { name: 'provider_code', type: 'VARCHAR(50)', nullable: false, description: 'Gateway vendor (e.g. MIDTRANS, XENDIT, PAYPAL)' },
      { name: 'va_number', type: 'VARCHAR(50)', nullable: true, description: 'Virtual Account Number (Provider supported banks e.g. BCA, Mandiri, BNI, BRI)' },
      { name: 'qris_payload', type: 'TEXT', nullable: true, description: 'QRIS string / Base64 QR code image payload' },
      { name: 'display_currency', type: 'VARCHAR(3)', nullable: false, description: "'IDR' or 'USD'" },
      { name: 'display_amount', type: 'DECIMAL(12,2)', nullable: false, description: 'Amount formatted for user locale' },
      { name: 'settlement_currency', type: 'VARCHAR(3)', nullable: false, description: "'IDR' or 'USD'" },
      { name: 'settlement_amount', type: 'DECIMAL(12,2)', nullable: false, description: 'Amount credited to platform Escrow' },
      { name: 'payment_status', type: 'ENUM', nullable: false, description: "('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'EXPIRED', 'CANCELLED', 'REFUND_PENDING', 'REFUNDED')" },
      { name: 'expires_at', type: 'TIMESTAMPTZ', nullable: false, description: 'Payment SLA countdown expiration (e.g. 24h)' },
      { name: 'paid_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Gateway confirmation timestamp' }
    ],
    relationships: [
      { type: '1:N', targetEntity: 'Orders', description: 'Transaction belongs to an Order' }
    ]
  },
  {
    name: 'PaymentMethodsConfig',
    tableName: 'payment_methods_config',
    description: 'Admin configuration for payment gateway options, active channels, fee overrides, and currency settings.',
    fields: [
      { name: 'id', type: 'UUID', isPrimary: true, nullable: false, description: 'Config ID' },
      { name: 'channel_key', type: 'VARCHAR(50)', nullable: false, description: "Unique channel key ('qris', 'bca_va', 'gopay', 'paypal')" },
      { name: 'display_name', type: 'VARCHAR(100)', nullable: false, description: 'Localized label' },
      { name: 'is_enabled', type: 'BOOLEAN', nullable: false, description: 'Channel availability toggle' },
      { name: 'is_indonesia_recommended', type: 'BOOLEAN', nullable: false, description: 'Priority badge flag' },
      { name: 'fee_flat', type: 'DECIMAL(10,2)', nullable: false, description: 'Gateway fixed fee' },
      { name: 'fee_percent', type: 'DECIMAL(5,2)', nullable: false, description: 'Gateway percentage fee' },
      { name: 'expiration_hours', type: 'INTEGER', nullable: false, description: 'SLA window before payment link expires (default 24)' }
    ],
    relationships: []
  }
];
