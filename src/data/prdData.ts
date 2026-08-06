import { PRDSection, WorkflowStep } from '../types/prd';
import { sections1to15 } from './sections1to15';
import { sections16to30 } from './sections16to30';
import { sections31to45 } from './sections31to45';
import { sections46to65 } from './sections46to65';
import { sections66to70 } from './sections66to70';
import { databaseEntities } from './databaseEntities';
import { apiEndpoints } from './apiEndpoints';

export const allPRDSections: PRDSection[] = [
  ...sections1to15,
  ...sections16to30,
  ...sections31to45,
  ...sections46to65,
  ...sections66to70
];

export const orderWorkflowSteps: WorkflowStep[] = [
  {
    stepNumber: 1,
    title: 'Client Creates Order Brief',
    actor: 'CLIENT',
    action: 'Fills project requirement wizard (Name, Map theme, Budget $500, RBXL reference specs).',
    systemStateChange: 'Order generated with ID KVS-20260731-001. Status: PENDING_REVIEW.',
    escrowOrAssetImpact: 'Escrow Vault pending deposit link generation.'
  },
  {
    stepNumber: 2,
    title: 'Escrow Deposit Holding',
    actor: 'CLIENT',
    action: 'Deposits $500 via Payment Gateway to Kaevy Escrow Vault.',
    systemStateChange: 'Status updated to PAID / WAITING_DEVELOPER_ASSIGNMENT.',
    escrowOrAssetImpact: '$500 locked securely in platform Escrow Ledger.'
  },
  {
    stepNumber: 3,
    title: 'Developer Assigned & Queue Lock',
    actor: 'DEVELOPER',
    action: 'Verified Scripter accepts assigned project.',
    systemStateChange: 'Status: DEVELOPER_ASSIGNED -> IN_PROGRESS. Queue counter updated (2/3 -> 3/3).',
    escrowOrAssetImpact: 'Developer capacity queue locked to prevent overbooking.'
  },
  {
    stepNumber: 4,
    title: 'Progress Checkpoints & Live Proofs',
    actor: 'DEVELOPER',
    action: 'Uploads 25% Graybox, 50% Lua Scripting, 75% Polish screenshots & video proof.',
    systemStateChange: 'Order checkpoints updated; Client notified in real-time order chat.',
    escrowOrAssetImpact: 'Escrow remains locked during active milestone execution.'
  },
  {
    stepNumber: 5,
    title: 'Final Deliverable Submission',
    actor: 'DEVELOPER',
    action: 'Uploads completed .RBXL / .ZIP game file package.',
    systemStateChange: 'Status updated to SUBMITTED / CLIENT_REVIEW. 7-day auto-response timer starts.',
    escrowOrAssetImpact: 'Client granted inspection access to final deliverables.'
  },
  {
    stepNumber: 6,
    title: 'Client Sign-off & Payout Release',
    actor: 'CLIENT',
    action: 'Tests map/scripting in Roblox Studio and clicks "Approve & Release Payment".',
    systemStateChange: 'Status updated to COMPLETED -> WARRANTY.',
    escrowOrAssetImpact: 'Escrow Vault releases $450 (90%) to Developer Wallet; $50 (10%) platform fee retained.'
  },
  {
    stepNumber: 7,
    title: '30-Day Bug Warranty Active',
    actor: 'CLIENT',
    action: 'Accesses 30-Day Bug Warranty ticket portal for any Lua runtime bugs.',
    systemStateChange: 'Status: WARRANTY. Expiration set to 30 days post completion.',
    escrowOrAssetImpact: 'Developer obligated to patch in-scope bugs within 48h SLA.'
  }
];

export const assetWorkflowSteps: WorkflowStep[] = [
  {
    stepNumber: 1,
    title: 'Creator Fills Upload Form',
    actor: 'DEVELOPER',
    action: 'Fills Asset Title, Category, Version 1.0.0, License, and 1-10 Documentation blocks.',
    systemStateChange: 'Asset record created in draft state.',
    escrowOrAssetImpact: 'Metadata logged in asset catalog.'
  },
  {
    stepNumber: 2,
    title: 'File Upload & Integrity Check',
    actor: 'DEVELOPER',
    action: 'Attaches .RBXL or .ZIP archive (up to 500MB).',
    systemStateChange: 'System computes SHA-256 hash, validates MIME type and binary magic-bytes.',
    escrowOrAssetImpact: 'File stored in isolated staging cloud storage.'
  },
  {
    stepNumber: 3,
    title: 'Automated Lua Security AST Scan',
    actor: 'SYSTEM',
    action: 'Parses script AST tree for backdoor patterns (require ID, getfenv, HTTP posts).',
    systemStateChange: 'Scan result recorded: PASSED_NO_BACKDOORS.',
    escrowOrAssetImpact: 'Prevents malicious code execution or server compromise.'
  },
  {
    stepNumber: 4,
    title: 'Admin Moderation Queue',
    actor: 'ADMIN',
    action: 'Admin tests RBXL file in Studio and inspects documentation completeness.',
    systemStateChange: 'Status changed from PENDING_MODERATION to APPROVED.',
    escrowOrAssetImpact: 'Asset published to public Share Asset library.'
  },
  {
    stepNumber: 5,
    title: 'Public Community Download',
    actor: 'CLIENT',
    action: 'User searches /share-assets, views detail page, and downloads file.',
    systemStateChange: 'download_count incremented (+1); Audit log entry created.',
    escrowOrAssetImpact: 'Tokenized signed URL generated for safe delivery.'
  }
];

export { databaseEntities } from './databaseEntities';
export { apiEndpoints } from './apiEndpoints';
