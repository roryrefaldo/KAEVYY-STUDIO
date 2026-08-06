import { PRDSection } from '../types/prd';

export const sections66to70: PRDSection[] = [
  {
    id: 66,
    title: '66. Internationalization & i18n Architecture',
    slug: 'internationalization-i18n-architecture',
    category: 'quality_ops',
    summary: 'Multi-language localization requirements, locale detection, session persistence, and translation key coverage.',
    tags: ['i18n', 'Localization', 'Bahasa Indonesia', 'English', 'UX'],
    keyTakeaways: [
      'MVP supports Bahasa Indonesia and English with locale auto-detection and persistent manual toggle.',
      'Language switcher available across public website, onboarding, user settings, and main navigation header.',
      'Comprehensive localization coverage across Navigation, Marketplace, Checkout, Payments, Dashboard, Warranty, Disputes, Share Assets, and Errors.',
      'Strict decoupling: No hardcoded user-facing text strings in core UI components.'
    ],
    contentMarkdown: `
# 66. Internationalization & i18n Architecture

### Core Directive
KAEVY STUDIO must support multi-language localization to serve both domestic Indonesian creators and global clients seamlessly.

### MVP Language Specifications
1. **Bahasa Indonesia (id)**
2. **English (en)**

### Language Selection & Persistence Rules
- **Access Points**: The language selector dropdown/toggle must be permanently accessible in:
  - Top Navigation Header
  - Public Website & Landing Pages
  - Onboarding & Role Selection Wizard
  - User Account Profile Settings
- **Default Language Auto-Detection**:
  - If user IP / browser locale is identified as **Indonesia (\`id\`)**: Default to **Bahasa Indonesia**.
  - Otherwise: Default to **English (\`en\`)**.
  - **Manual Override**: Users can switch languages at any point; the choice is persisted in browser local storage and saved to the user account profile.

### Translation Key Coverage Scope
No user-facing text strings may be hardcoded directly into JSX/UI components. The localization dictionary (\`src/locales/id.json\` & \`src/locales/en.json\`) covers:
- Main Navigation & Header Tabs
- Marketplace Brief Cards & Service Descriptions
- Custom Order Request Wizard & Scope Selectors
- Indonesia-First Checkout & Payment Gateway UI
- Escrow Vault Statuses & Transaction Histories
- Developer Queue Dashboard & Milestone Checkpoint Updates
- Admin Moderation Console & Audit Stream Logs
- 30-Day Warranty Claims & Dispute Arbitration Center
- Share Asset Library Filters, Tags, & Documentation Blocks
- Toast Notifications, Error Messages, and System Status Messages

### Extensible i18n Architecture
The system uses a standardized dictionary lookup pattern (\`t('namespace.key')\`). Additional languages (e.g., Tagalog, Japanese, Spanish, Portuguese) can be introduced by appending locale JSON files without refactoring component architecture.
`
  },
  {
    id: 67,
    title: '67. Indonesia-First Payment Architecture & Escrow Settlement',
    slug: 'indonesia-first-payment-architecture',
    category: 'security_tech',
    summary: 'Indonesia-First checkout UX, QRIS priority, Virtual Account, E-Wallets, PayPal integration, multi-currency display vs settlement, and gateway abstraction.',
    tags: ['Payment Architecture', 'Indonesia-First', 'QRIS', 'Virtual Account', 'E-Wallet', 'PayPal', 'Escrow', 'Multi-Currency'],
    keyTakeaways: [
      'Checkout experience is Indonesia-First: QRIS (Recommended), Bank Virtual Accounts, E-Wallets (GoPay, OVO, DANA, ShopeePay), PayPal (International).',
      'QRIS is placed at top visual priority for fast Indonesian mobile QR scanning.',
      'Multi-Currency Architecture explicitly separates Display Currency (IDR/USD), Payment Currency, and Settlement Currency.',
      'Payment Provider Abstraction Layer decouples business logic from specific payment gateway vendors.',
      'Payment Status Lifecycle: Pending -> Processing -> Paid -> Failed -> Expired -> Cancelled -> Refund Pending -> Refunded.'
    ],
    contentMarkdown: `
# 67. Indonesia-First Payment Architecture & Escrow Settlement

### Product Principle: Local First, Global Ready
KAEVY STUDIO serves Indonesian Roblox creators as its primary home market while providing world-class international accessibility for global buyers.

### Payment Method Visual Hierarchy (Indonesian Locale)
For users in Indonesia or paying in IDR, checkout presents payment options in order of local popularity and speed:

\`\`\`
------------------------------------------------------------------
PAYMENT METHOD SELECTION (INDONESIA-FIRST)
------------------------------------------------------------------
[RECOMMENDED FOR INDONESIA]
1. QRIS (Instant Scan with Mobile Banking / E-Wallet Apps)

------------------------------------------------------------------
2. BANK TRANSFER / VIRTUAL ACCOUNT
   (Dynamic list dependent on payment provider, e.g., BCA, Mandiri, BNI, BRI)

------------------------------------------------------------------
3. E-WALLET / DIGITAL WALLETS
   (e.g., GoPay, OVO, DANA, ShopeePay, LinkAja)

------------------------------------------------------------------
4. INTERNATIONAL PAYMENTS
   ○ PayPal (Primary International Option / USD Settlement)
------------------------------------------------------------------
\`\`\`

For English / International users:
- **Primary Required Option**: PayPal (USD Settlement).
- **Secondary / Optional**: Credit card processing and alternative local channels when supported by the active payment provider integration.

### Bank Virtual Account Execution Specifications
Supported Virtual Account banks are dynamically retrieved from the configured payment provider (e.g. BCA, Mandiri, BNI, BRI) rather than hardcoded into business logic. When a Virtual Account is selected, the payment interface displays:
- **Bank Name & Logo**: (e.g., BCA, Mandiri, BNI, BRI, or provider-enabled banks)
- **VA Account Number**: Clean numeric string with 1-click **[ COPY VA NUMBER ]** button.
- **Total Amount**: Formatted in IDR (e.g., \`Rp 2.500.000\`).
- **Expiration Countdown**: Real-time timer (e.g. \`Expires in 23:59:00 WIB\`).
- **Live Status Checker**: **[ CHECK PAYMENT STATUS ]** button polling real-time gateway webhooks.
- **Step-by-Step Payment Instructions**: Collapsible m-banking & ATM guide.

### Payment Provider Abstraction Architecture
The platform implements a modular Payment Provider Abstraction Layer (\`IKaevyPaymentGateway\`):

\`\`\`
                    ┌─────────────────────────┐
                    │  KAEVY PAYMENT SERVICE  │
                    └────────────┬────────────┘
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼                                           ▼
┌─────────────────────────┐               ┌─────────────────────────┐
│ Indonesian Gateway      │               │ International Provider  │
│ (e.g., Midtrans/Xendit) │               │ (e.g., PayPal API)      │
├─────────────────────────┤               ├─────────────────────────┤
│ • QRIS                  │               │ • PayPal Checkout       │
│ • Provider VA Banks     │               │ • Credit Cards (Option) │
│ • Supported E-Wallets   │               │ • Multi-Currency USD    │
└─────────────────────────┘               └─────────────────────────┘
\`\`\`

*Note: Vendor integrations are controlled via Admin System Settings and environment config rather than permanently hardcoding specific bank/gateway vendor logic into business modules.*

### Multi-Currency & Financial Separation
The PRD strictly decouples three financial concepts:
1. **Display Currency**: Currency shown to the user based on location/preference (IDR \`Rp\` vs USD \`$\`).
2. **Payment Currency**: Currency processed at payment checkout by gateway (IDR or USD).
3. **Settlement Currency**: Currency stored in platform Escrow Vault and credited to developer wallets.

### Payment Lifecycle States
Every transaction progresses through deterministic payment states:
- \`Pending\`: Order initialized, payment link / VA / QRIS generated.
- \`Processing\`: Gateway received buyer authorization, waiting for bank confirmation.
- \`Paid\`: Funds successfully received and locked into Kaevy Escrow Vault.
- \`Failed\`: Payment declined by bank or gateway error.
- \`Expired\`: Payment link / VA expired without completion within SLA window.
- \`Cancelled\`: Payment abandoned by user.
- \`Refund Pending\`: Approved dispute awaiting payout reversal.
- \`Refunded\`: Escrow funds returned to client payment method.

### Admin Payment Controls & Immutable Audit Logging
Admin Console includes dense financial controls:
- Enable/Disable specific payment channels (QRIS, VA, E-Wallet, PayPal).
- Configurable Payment Expiration Window (default: 24 hours).
- Default & Supported Currencies toggle.
- Transaction fee overrides and refund processing.
- All payment transactions, gateway response payloads, and manual refund overrides produce immutable entries in \`payment_audit_logs\`.
`
  }
];
