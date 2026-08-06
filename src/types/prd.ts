export type SectionCategory =
  | 'overview'
  | 'roles'
  | 'business'
  | 'features'
  | 'experiences'
  | 'order_system'
  | 'share_asset'
  | 'security_tech'
  | 'database_api'
  | 'architecture_flows'
  | 'quality_ops'
  | 'roadmap_risks';

export interface PRDSection {
  id: number;
  title: string;
  slug: string;
  category: SectionCategory;
  summary: string;
  contentMarkdown: string;
  keyTakeaways?: string[];
  tags?: string[];
}

export interface DatabaseEntity {
  name: string;
  tableName: string;
  description: string;
  fields: {
    name: string;
    type: string;
    isPrimary?: boolean;
    isForeign?: boolean;
    references?: string;
    nullable?: boolean;
    description: string;
  }[];
  relationships: {
    type: '1:1' | '1:N' | 'N:M';
    targetEntity: string;
    description: string;
  }[];
}

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  summary: string;
  roleRequired: 'PUBLIC' | 'CLIENT' | 'DEVELOPER' | 'ADMIN' | 'ANY_AUTH';
  headers: Record<string, string>;
  requestBodyExample?: string;
  responseExample: string;
  description: string;
}

export interface WorkflowStep {
  stepNumber: number;
  title: string;
  actor: 'CLIENT' | 'DEVELOPER' | 'ADMIN' | 'SYSTEM';
  action: string;
  systemStateChange: string;
  escrowOrAssetImpact: string;
}

// ==========================================
// SHARE ASSET TYPES
// ==========================================

export interface DocSection {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
}

export type AssetCategory =
  | 'Roblox Studio'
  | 'Maps'
  | 'Models'
  | 'Scripts'
  | 'UI'
  | 'Systems'
  | 'Plugins'
  | 'Templates'
  | 'Tools'
  | 'Resources';

export type ModerationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Hidden';

export interface ShareAssetItem {
  id: string;
  title: string;
  description: string;
  category: AssetCategory;
  tags: string[];
  version: string;
  license: string;
  fileFormat: string; // e.g. 'ZIP (Recommended)', 'RBXL', 'LUA', 'PNG'
  fileSize: string; // e.g. '24.5 MB'
  downloadsCount: number;
  rating: number;
  reviewsCount: number;
  creatorName: string;
  creatorAvatar: string;
  isVerifiedCreator: boolean;
  createdAt: string;
  updatedAt: string;
  moderationStatus: ModerationStatus;
  securityScanPassed: boolean;
  docSections: DocSection[];
  previewUrl?: string;
  changelog?: string[];
}

// ==========================================
// PLATFORM ORDER & USER TYPES
// ==========================================

export type OrderStatus =
  | 'Pending Review'
  | 'Waiting Payment'
  | 'Paid (In Escrow)'
  | 'Developer Assigned'
  | 'In Progress'
  | 'Submitted for Review'
  | 'Revision Requested'
  | 'Completed'
  | '30-Day Warranty'
  | 'Disputed';

export interface OrderCheckpoint {
  title: string;
  percentage: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  updatedAt?: string;
  proofNote?: string;
}

export interface OrderItem {
  id: string;
  serviceTitle: string;
  clientName: string;
  clientAvatar: string;
  developerName?: string;
  developerAvatar?: string;
  amount: number;
  escrowStatus: 'UNPAID' | 'LOCKED_IN_ESCROW' | 'RELEASED_TO_DEV' | 'REFUNDED_TO_CLIENT';
  orderStatus: OrderStatus;
  progressPercentage: number;
  deadline: string;
  createdAt: string;
  checkpoints: OrderCheckpoint[];
  description: string;
  warrantyDaysLeft?: number;
  messagesCount: number;
  deliverableFile?: string;
}

export interface ServiceMarketplaceItem {
  id: string;
  title: string;
  category: string;
  startingPrice: number;
  estimatedDays: number;
  rating: number;
  completedCount: number;
  iconName: string;
  description: string;
  features: string[];
}

export interface DeveloperProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  specialties: string[];
  rating: number;
  completedOrders: number;
  activeQueueCount: number; // e.g. 2 out of 3
  maxQueueCapacity: number; // default 3
  hourlyRate: number;
  bio: string;
  portfolioItems: { title: string; image: string; tag: string }[];
}
