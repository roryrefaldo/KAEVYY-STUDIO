import { pgTable, uuid, varchar, text, integer, numeric, timestamp, bigint, jsonb, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { clientProfiles, developerProfiles } from './profiles.js';
import { services } from './services.js';
import { users } from './identity.js';
import { orderStatusEnum, projectStatusEnum, milestoneStatusEnum } from './enums.js';

// 1. Orders table
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  clientProfileId: uuid('client_profile_id').references(() => clientProfiles.id),
  developerProfileId: uuid('developer_profile_id').references(() => developerProfiles.id),
  serviceId: uuid('service_id').references(() => services.id),
  status: orderStatusEnum('status').notNull().default('PENDING_REVIEW'),
  titleSnapshot: varchar('title_snapshot', { length: 200 }).notNull(),
  descriptionSnapshot: text('description_snapshot').notNull(),
  budgetAmountSnapshot: numeric('budget_amount_snapshot', { precision: 15, scale: 2 }).notNull(),
  currencySnapshot: varchar('currency_snapshot', { length: 10 }).notNull(),
  exchangeRateSnapshot: numeric('exchange_rate_snapshot', { precision: 18, scale: 6 }).notNull().default('1.000000'),
  platformFeeRateSnapshot: numeric('platform_fee_rate_snapshot', { precision: 5, scale: 4 }).notNull(),
  platformFeeAmountSnapshot: numeric('platform_fee_amount_snapshot', { precision: 15, scale: 2 }).notNull(),
  deadlineDays: integer('deadline_days').notNull(),
  targetDeliveryDate: timestamp('target_delivery_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_orders_number').on(table.orderNumber),
  index('idx_orders_client').on(table.clientProfileId),
  index('idx_orders_dev').on(table.developerProfileId),
  index('idx_orders_status').on(table.status),
]);

// 2. Order Items table
export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  serviceId: uuid('service_id').references(() => services.id),
  title: varchar('title', { length: 200 }).notNull(),
  unitPriceSnapshot: numeric('unit_price_snapshot', { precision: 15, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull().default(1),
  scopeDescription: text('scope_description'),
});

// 3. Projects table
export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().unique().references(() => orders.id, { onDelete: 'cascade' }),
  developerProfileId: uuid('developer_profile_id').references(() => developerProfiles.id),
  clientProfileId: uuid('client_profile_id').references(() => clientProfiles.id),
  progressPercentage: integer('progress_percentage').notNull().default(0),
  status: projectStatusEnum('status').notNull().default('NOT_STARTED'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Project Milestones table
export const projectMilestones = pgTable('project_milestones', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  percentage: integer('percentage').notNull(),
  title: varchar('title', { length: 150 }).notNull(),
  description: text('description'),
  status: milestoneStatusEnum('status').notNull().default('PENDING'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  revisionNotes: text('revision_notes'),
});

// 5. Project Files table
export const projectFiles = pgTable('project_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  milestoneId: uuid('milestone_id').references(() => projectMilestones.id),
  uploadedByUserId: uuid('uploaded_by_user_id').references(() => users.id),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  storageKey: text('storage_key').notNull(),
  version: varchar('version', { length: 20 }).default('1.0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 6. Order Events table
export const orderEvents = pgTable('order_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  actorUserId: uuid('actor_user_id').references(() => users.id),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  metadataJson: jsonb('metadata_json').default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
