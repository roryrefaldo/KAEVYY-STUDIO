import { pgTable, uuid, varchar, text, integer, numeric, timestamp } from 'drizzle-orm/pg-core';
import { orders, projects } from './orders.js';
import { clientProfiles, developerProfiles } from './profiles.js';
import { users } from './identity.js';
import { warrantyStatusEnum, warrantyTicketStatusEnum, disputeStatusEnum, disputeResolutionEnum } from './enums.js';

// 1. Reviews table
export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().unique().references(() => orders.id, { onDelete: 'cascade' }),
  clientProfileId: uuid('client_profile_id').references(() => clientProfiles.id),
  developerProfileId: uuid('developer_profile_id').references(() => developerProfiles.id),
  rating: integer('rating').notNull(),
  reviewText: text('review_text'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Warranties table (Starts strictly from project.completed_at)
export const warranties = pgTable('warranties', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().unique().references(() => orders.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').notNull().unique().references(() => projects.id, { onDelete: 'cascade' }),
  startAt: timestamp('start_at', { withTimezone: true }).notNull(),
  endAt: timestamp('end_at', { withTimezone: true }).notNull(),
  status: warrantyStatusEnum('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Warranty Tickets table
export const warrantyTickets = pgTable('warranty_tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  warrantyId: uuid('warranty_id').notNull().references(() => warranties.id, { onDelete: 'cascade' }),
  openedByClientId: uuid('opened_by_client_id').references(() => clientProfiles.id),
  title: varchar('title', { length: 200 }).notNull(),
  bugDescription: text('bug_description').notNull(),
  status: warrantyTicketStatusEnum('status').notNull().default('OPEN'),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Disputes table
export const disputes = pgTable('disputes', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().unique().references(() => orders.id, { onDelete: 'cascade' }),
  openedByUserId: uuid('opened_by_user_id').references(() => users.id),
  clientProfileId: uuid('client_profile_id').references(() => clientProfiles.id),
  developerProfileId: uuid('developer_profile_id').references(() => developerProfiles.id),
  reason: text('reason').notNull(),
  status: disputeStatusEnum('status').notNull().default('OPEN'),
  resolutionType: disputeResolutionEnum('resolution_type'),
  refundAmount: numeric('refund_amount', { precision: 15, scale: 2 }).default('0.00'),
  developerReleaseAmount: numeric('developer_release_amount', { precision: 15, scale: 2 }).default('0.00'),
  resolvedByAdminUserId: uuid('resolved_by_admin_user_id').references(() => users.id),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 5. Dispute Evidence table
export const disputeEvidence = pgTable('dispute_evidence', {
  id: uuid('id').defaultRandom().primaryKey(),
  disputeId: uuid('dispute_id').notNull().references(() => disputes.id, { onDelete: 'cascade' }),
  submittedByUserId: uuid('submitted_by_user_id').references(() => users.id),
  statement: text('statement'),
  fileStorageKey: text('file_storage_key'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
