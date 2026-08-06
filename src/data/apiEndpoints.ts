import { ApiEndpoint } from '../types/prd';

export const apiEndpoints: ApiEndpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/auth/register',
    summary: 'Register new Client or Developer user account',
    roleRequired: 'PUBLIC',
    headers: { 'Content-Type': 'application/json' },
    requestBodyExample: JSON.stringify({
      email: 'client@robloxgame.com',
      password: 'StrongPassword123!',
      fullName: 'Alex Studio Founder',
      role: 'CLIENT',
      discordHandle: 'alex_roblox#1234'
    }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      data: { userId: 'usr_892f3a', role: 'CLIENT', token: 'jwt_eyJhbGciOi...' },
      timestamp: '2026-07-30T19:40:00Z'
    }, null, 2),
    description: 'Creates user record, hashes password with Bcrypt, issues HttpOnly JWT cookie.'
  },
  {
    method: 'GET',
    path: '/api/v1/services',
    summary: 'Browse and search Roblox development service marketplace catalog',
    roleRequired: 'PUBLIC',
    headers: { 'Content-Type': 'application/json' },
    responseExample: JSON.stringify({
      success: true,
      data: [
        {
          id: 'srv_scripting_01',
          title: 'Custom Roblox Lua Combat & Inventory Framework',
          category: 'Scripting',
          basePrice: 250.00,
          estimatedDays: 7,
          isQueueAvailable: true
        }
      ]
    }, null, 2),
    description: 'Returns active service listings with category, price filter, and developer queue availability.'
  },
  {
    method: 'POST',
    path: '/api/v1/orders',
    summary: 'Create new project commission order and brief',
    roleRequired: 'CLIENT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <JWT>' },
    requestBodyExample: JSON.stringify({
      serviceId: 'srv_scripting_01',
      projectTitle: 'Simulator Map & Pet Scripting',
      description: 'Requires full low poly map with pet hatching and DataStore2 saving.',
      budget: 500.00,
      deadlineDays: 10,
      discordHandle: 'alex_roblox#1234',
      whatsappNumber: '+628123456789'
    }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      data: {
        orderId: 'ord_9281a',
        orderNumber: 'KVS-20260731-001',
        grossAmount: 500.00,
        status: 'WAITING_PAYMENT',
        paymentGatewayUrl: 'https://payment.kaevystudio.com/pay/KVS-20260731-001'
      }
    }, null, 2),
    description: 'Generates order ID KVS-YYYYMMDD-XXX and initializes Escrow Vault payment link.'
  },
  {
    method: 'POST',
    path: '/api/v1/orders/:id/escrow-deposit',
    summary: 'Deposit client payment into Kaevy Escrow Vault',
    roleRequired: 'CLIENT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <JWT>' },
    responseExample: JSON.stringify({
      success: true,
      data: {
        orderNumber: 'KVS-20260731-001',
        escrowStatus: 'LOCKED',
        amountLocked: 500.00,
        nextStep: 'Developer Assignment & Queue Lock'
      }
    }, null, 2),
    description: 'Locks client deposit in isolated Escrow Vault. Updates order status to PAID.'
  },
  {
    method: 'POST',
    path: '/api/v1/orders/:id/approve',
    summary: 'Client approves deliverable and releases escrow payment',
    roleRequired: 'CLIENT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <JWT>' },
    responseExample: JSON.stringify({
      success: true,
      data: {
        orderNumber: 'KVS-20260731-001',
        escrowReleased: true,
        developerCreditedNet: 450.00,
        platformFeeRetained: 50.00,
        warrantyStatus: 'ACTIVE_30_DAYS'
      }
    }, null, 2),
    description: 'Transfers 90% net earnings to developer wallet, retains 10% platform fee, activates 30-Day Bug Warranty.'
  },
  {
    method: 'GET',
    path: '/api/v1/share-assets',
    summary: 'Search public Share Asset digital resource library',
    roleRequired: 'PUBLIC',
    headers: { 'Content-Type': 'application/json' },
    responseExample: JSON.stringify({
      success: true,
      data: [
        {
          id: 'ast_921a',
          title: 'Advanced Roblox DataStore2 & Inventory Template (.rbxl)',
          category: 'Frameworks',
          version: '1.2.0',
          fileSizeMB: 14.5,
          downloadCount: 342,
          isFeatured: true
        }
      ]
    }, null, 2),
    description: 'Retrieves approved public assets with filters for search, category, file type, and popularity.'
  },
  {
    method: 'POST',
    path: '/api/v1/share-assets/upload',
    summary: 'Upload new Share Asset with documentation and files',
    roleRequired: 'DEVELOPER',
    headers: { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer <JWT>' },
    responseExample: JSON.stringify({
      success: true,
      data: {
        assetId: 'ast_921a',
        title: 'Advanced Roblox DataStore2 Template',
        status: 'PENDING_MODERATION',
        securityScan: 'PASSED_NO_BACKDOORS',
        message: 'Submitted to Admin Moderation Queue.'
      }
    }, null, 2),
    description: 'Scans uploaded file for Lua backdoors and places asset in Admin Moderation queue.'
  },
  {
    method: 'POST',
    path: '/api/v1/admin/assets/:id/moderate',
    summary: 'Admin approves, rejects, or hides uploaded Share Asset',
    roleRequired: 'ADMIN',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <JWT>' },
    requestBodyExample: JSON.stringify({
      status: 'APPROVED',
      isFeatured: true,
      notes: 'Verified safe and high quality.'
    }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      data: { assetId: 'ast_921a', status: 'APPROVED', publishedAt: '2026-07-30T19:40:00Z' }
    }, null, 2),
    description: 'Publishes or hides asset from public catalog.'
  },
  {
    method: 'GET',
    path: '/api/v1/payments/methods',
    summary: 'Retrieve active payment methods (QRIS, VA, E-Wallet, PayPal) and current currency config',
    roleRequired: 'PUBLIC',
    headers: { 'Content-Type': 'application/json' },
    responseExample: JSON.stringify({
      success: true,
      data: {
        supportedCurrencies: ['IDR', 'USD'],
        defaultCurrency: 'IDR',
        methods: [
          { key: 'qris', name: 'QRIS (All Indonesian E-Wallets & Mobile Banking)', isRecommended: true, enabled: true },
          { key: 'bank_va', name: 'Virtual Account (Provider Banks e.g. BCA, Mandiri, BNI, BRI)', isRecommended: false, enabled: true },
          { key: 'gopay', name: 'GoPay E-Wallet', isRecommended: false, enabled: true },
          { key: 'paypal', name: 'PayPal (USD / International Primary)', isRecommended: false, enabled: true }
        ]
      }
    }, null, 2),
    description: 'Provides localized payment options based on user locale and admin payment settings.'
  },
  {
    method: 'POST',
    path: '/api/v1/payments/checkout',
    summary: 'Initialize Indonesia-First or PayPal payment transaction for an order',
    roleRequired: 'CLIENT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <JWT>' },
    requestBodyExample: JSON.stringify({
      orderId: 'ord_9281a',
      channelKey: 'qris',
      displayCurrency: 'IDR',
      locale: 'id'
    }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      data: {
        transactionId: 'trx_7781a',
        orderNumber: 'KVS-20260731-001',
        paymentChannel: 'QRIS',
        qrisPayload: '00020101021226680016ID.LINKAJA.WWW0118936009110022010213200...',
        displayAmount: 'Rp 2.500.000',
        expiresAt: '2026-08-01T19:40:00Z',
        status: 'PENDING'
      }
    }, null, 2),
    description: 'Creates payment transaction, generates QRIS or Virtual Account number, sets 24-hour expiration.'
  },
  {
    method: 'POST',
    path: '/api/v1/payments/webhooks',
    summary: 'Gateway status webhook callback (Midtrans / Xendit / PayPal)',
    roleRequired: 'PUBLIC',
    headers: { 'Content-Type': 'application/json', 'X-Signature-Key': 'sha256_hash' },
    requestBodyExample: JSON.stringify({
      transactionId: 'trx_7781a',
      orderNumber: 'KVS-20260731-001',
      transactionStatus: 'settlement',
      statusCode: '200'
    }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      message: 'Transaction verified and Escrow locked.'
    }, null, 2),
    description: 'Validates gateway digital signature, transitions payment status to PAID, and locks deposit in Escrow Vault.'
  }
];
