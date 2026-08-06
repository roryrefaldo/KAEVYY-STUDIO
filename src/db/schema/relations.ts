import { relations } from 'drizzle-orm';
import { users, roles, userRoles, permissions, rolePermissions } from './identity.js';
import { clientProfiles, developerProfiles, developerVerificationSubmissions, userPreferences } from './profiles.js';
import { serviceCategories, services, servicePriceHistory } from './services.js';
import { orders, orderItems, projects, projectMilestones, projectFiles, orderEvents } from './orders.js';
import { payments, paymentTransactions, escrowRecords } from './financials.js';
import { assetCategories, assets, assetFiles, assetDocumentationBlocks, assetTags, assetTagRelations, assetDownloads, assetSecurityScans, assetModerationReviews } from './shareAssets.js';
import { reviews, warranties, warrantyTickets, disputes, disputeEvidence } from './trust.js';
import { conversations, conversationMembers, messages, notifications } from './communication.js';
import { auditLogs } from './audit.js';

// Identity & Roles Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  userRoles: many(userRoles),
  clientProfile: one(clientProfiles, { fields: [users.id], references: [clientProfiles.userId] }),
  developerProfile: one(developerProfiles, { fields: [users.id], references: [developerProfiles.userId] }),
  preferences: one(userPreferences, { fields: [users.id], references: [userPreferences.userId] }),
  notifications: many(notifications),
  auditLogs: many(auditLogs),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, { fields: [userRoles.userId], references: [users.id] }),
  role: one(roles, { fields: [userRoles.roleId], references: [roles.id] }),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, { fields: [rolePermissions.permissionId], references: [permissions.id] }),
}));

// Profiles Relations
export const clientProfilesRelations = relations(clientProfiles, ({ one, many }) => ({
  user: one(users, { fields: [clientProfiles.userId], references: [users.id] }),
  orders: many(orders),
  reviews: many(reviews),
}));

export const developerProfilesRelations = relations(developerProfiles, ({ one, many }) => ({
  user: one(users, { fields: [developerProfiles.userId], references: [users.id] }),
  services: many(services),
  orders: many(orders),
  projects: many(projects),
  verificationSubmissions: many(developerVerificationSubmissions),
  reviews: many(reviews),
}));

// Services Relations
export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  developerProfile: one(developerProfiles, { fields: [services.developerProfileId], references: [developerProfiles.id] }),
  category: one(serviceCategories, { fields: [services.categoryId], references: [serviceCategories.id] }),
  priceHistory: many(servicePriceHistory),
  orders: many(orders),
}));

export const servicePriceHistoryRelations = relations(servicePriceHistory, ({ one }) => ({
  service: one(services, { fields: [servicePriceHistory.serviceId], references: [services.id] }),
}));

// Orders & Projects Relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  clientProfile: one(clientProfiles, { fields: [orders.clientProfileId], references: [clientProfiles.id] }),
  developerProfile: one(developerProfiles, { fields: [orders.developerProfileId], references: [developerProfiles.id] }),
  service: one(services, { fields: [orders.serviceId], references: [services.id] }),
  items: many(orderItems),
  project: one(projects, { fields: [orders.id], references: [projects.orderId] }),
  payments: many(payments),
  escrowRecord: one(escrowRecords, { fields: [orders.id], references: [escrowRecords.orderId] }),
  review: one(reviews, { fields: [orders.id], references: [reviews.orderId] }),
  warranty: one(warranties, { fields: [orders.id], references: [warranties.orderId] }),
  dispute: one(disputes, { fields: [orders.id], references: [disputes.orderId] }),
  events: many(orderEvents),
  conversations: many(conversations),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  service: one(services, { fields: [orderItems.serviceId], references: [services.id] }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  order: one(orders, { fields: [projects.orderId], references: [orders.id] }),
  developerProfile: one(developerProfiles, { fields: [projects.developerProfileId], references: [developerProfiles.id] }),
  clientProfile: one(clientProfiles, { fields: [projects.clientProfileId], references: [clientProfiles.id] }),
  milestones: many(projectMilestones),
  files: many(projectFiles),
  warranty: one(warranties, { fields: [projects.id], references: [warranties.projectId] }),
}));

export const projectMilestonesRelations = relations(projectMilestones, ({ one, many }) => ({
  project: one(projects, { fields: [projectMilestones.projectId], references: [projects.id] }),
  files: many(projectFiles),
}));

export const projectFilesRelations = relations(projectFiles, ({ one }) => ({
  project: one(projects, { fields: [projectFiles.projectId], references: [projects.id] }),
  milestone: one(projectMilestones, { fields: [projectFiles.milestoneId], references: [projectMilestones.id] }),
  uploadedByUser: one(users, { fields: [projectFiles.uploadedByUserId], references: [users.id] }),
}));

// Financials Relations
export const paymentsRelations = relations(payments, ({ one, many }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
  transactions: many(paymentTransactions),
  escrowRecord: one(escrowRecords, { fields: [payments.id], references: [escrowRecords.paymentId] }),
}));

export const paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
  payment: one(payments, { fields: [paymentTransactions.paymentId], references: [payments.id] }),
}));

export const escrowRecordsRelations = relations(escrowRecords, ({ one }) => ({
  order: one(orders, { fields: [escrowRecords.orderId], references: [orders.id] }),
  payment: one(payments, { fields: [escrowRecords.paymentId], references: [payments.id] }),
}));

// Share Assets Relations
export const assetCategoriesRelations = relations(assetCategories, ({ many }) => ({
  assets: many(assets),
}));

export const assetsRelations = relations(assets, ({ one, many }) => ({
  uploadedByUser: one(users, { fields: [assets.uploadedByUserId], references: [users.id] }),
  category: one(assetCategories, { fields: [assets.categoryId], references: [assetCategories.id] }),
  files: many(assetFiles),
  documentationBlocks: many(assetDocumentationBlocks),
  tagRelations: many(assetTagRelations),
  downloads: many(assetDownloads),
  moderationReviews: many(assetModerationReviews),
}));

export const assetFilesRelations = relations(assetFiles, ({ one, many }) => ({
  asset: one(assets, { fields: [assetFiles.assetId], references: [assets.id] }),
  securityScans: many(assetSecurityScans),
}));

export const assetDocumentationBlocksRelations = relations(assetDocumentationBlocks, ({ one }) => ({
  asset: one(assets, { fields: [assetDocumentationBlocks.assetId], references: [assets.id] }),
}));

export const assetTagsRelations = relations(assetTags, ({ many }) => ({
  tagRelations: many(assetTagRelations),
}));

export const assetTagRelationsRelations = relations(assetTagRelations, ({ one }) => ({
  asset: one(assets, { fields: [assetTagRelations.assetId], references: [assets.id] }),
  tag: one(assetTags, { fields: [assetTagRelations.tagId], references: [assetTags.id] }),
}));

export const assetSecurityScansRelations = relations(assetSecurityScans, ({ one }) => ({
  assetFile: one(assetFiles, { fields: [assetSecurityScans.assetFileId], references: [assetFiles.id] }),
}));

// Trust & Dispute Relations
export const reviewsRelations = relations(reviews, ({ one }) => ({
  order: one(orders, { fields: [reviews.orderId], references: [orders.id] }),
  clientProfile: one(clientProfiles, { fields: [reviews.clientProfileId], references: [clientProfiles.id] }),
  developerProfile: one(developerProfiles, { fields: [reviews.developerProfileId], references: [developerProfiles.id] }),
}));

export const warrantiesRelations = relations(warranties, ({ one, many }) => ({
  order: one(orders, { fields: [warranties.orderId], references: [orders.id] }),
  project: one(projects, { fields: [warranties.projectId], references: [projects.id] }),
  tickets: many(warrantyTickets),
}));

export const warrantyTicketsRelations = relations(warrantyTickets, ({ one }) => ({
  warranty: one(warranties, { fields: [warrantyTickets.warrantyId], references: [warranties.id] }),
  openedByClient: one(clientProfiles, { fields: [warrantyTickets.openedByClientId], references: [clientProfiles.id] }),
}));

export const disputesRelations = relations(disputes, ({ one, many }) => ({
  order: one(orders, { fields: [disputes.orderId], references: [orders.id] }),
  openedByUser: one(users, { fields: [disputes.openedByUserId], references: [users.id] }),
  evidenceList: many(disputeEvidence),
}));

export const disputeEvidenceRelations = relations(disputeEvidence, ({ one }) => ({
  dispute: one(disputes, { fields: [disputeEvidence.disputeId], references: [disputes.id] }),
  submittedByUser: one(users, { fields: [disputeEvidence.submittedByUserId], references: [users.id] }),
}));

// Communication Relations
export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  order: one(orders, { fields: [conversations.orderId], references: [orders.id] }),
  members: many(conversationMembers),
  messages: many(messages),
}));

export const conversationMembersRelations = relations(conversationMembers, ({ one }) => ({
  conversation: one(conversations, { fields: [conversationMembers.conversationId], references: [conversations.id] }),
  user: one(users, { fields: [conversationMembers.userId], references: [users.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, { fields: [messages.conversationId], references: [conversations.id] }),
  sender: one(users, { fields: [messages.senderId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));
