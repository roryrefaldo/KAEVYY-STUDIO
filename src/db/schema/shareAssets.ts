import { pgTable, uuid, varchar, text, integer, numeric, timestamp, bigint, jsonb, primaryKey, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './identity.js';
import { assetVisibilityEnum, assetStatusEnum, scanStatusEnum } from './enums.js';

// 1. Asset Categories table
export const assetCategories = pgTable('asset_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
});

// 2. Assets table
export const assets = pgTable('assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  uploadedByUserId: uuid('uploaded_by_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => assetCategories.id),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 220 }).notNull().unique(),
  description: text('description').notNull(),
  version: varchar('version', { length: 20 }).notNull().default('1.0.0'),
  license: varchar('license', { length: 50 }).default('MIT'),
  visibility: assetVisibilityEnum('visibility').notNull().default('PUBLIC'),
  status: assetStatusEnum('status').notNull().default('PENDING_SCAN'),
  downloadsCount: integer('downloads_count').notNull().default(0),
  ratingAverage: numeric('rating_average', { precision: 3, scale: 2 }).default('0.00'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_assets_uploader').on(table.uploadedByUserId),
  index('idx_assets_category').on(table.categoryId),
  index('idx_assets_status').on(table.status),
  index('idx_assets_visibility').on(table.visibility),
]);

// 3. Asset Files table
export const assetFiles = pgTable('asset_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }).notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  storageKey: text('storage_key').notNull(),
  checksumSha256: varchar('checksum_sha256', { length: 64 }),
  version: varchar('version', { length: 20 }).default('1.0.0'),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Asset Documentation Blocks table (Min 1, Max 10 blocks)
export const assetDocumentationBlocks = pgTable('asset_documentation_blocks', {
  id: uuid('id').defaultRandom().primaryKey(),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 150 }).notNull(),
  content: text('content').notNull(),
  positionOrder: integer('position_order').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_asset_doc_order').on(table.assetId, table.positionOrder),
]);

// 5. Asset Tags table
export const assetTags = pgTable('asset_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  tagName: varchar('tag_name', { length: 50 }).notNull().unique(),
});

// 6. Asset Tag Relations junction table
export const assetTagRelations = pgTable('asset_tag_relations', {
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id').notNull().references(() => assetTags.id, { onDelete: 'cascade' }),
}, (table) => [
  primaryKey({ columns: [table.assetId, table.tagId] }),
]);

// 7. Asset Downloads log table
export const assetDownloads = pgTable('asset_downloads', {
  id: uuid('id').defaultRandom().primaryKey(),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => users.id),
  downloadedAt: timestamp('downloaded_at', { withTimezone: true }).defaultNow().notNull(),
});

// 8. Asset Security Scans table
export const assetSecurityScans = pgTable('asset_security_scans', {
  id: uuid('id').defaultRandom().primaryKey(),
  assetFileId: uuid('asset_file_id').notNull().references(() => assetFiles.id, { onDelete: 'cascade' }),
  scanStatus: scanStatusEnum('scan_status').notNull().default('PENDING'),
  astLuaIssuesFound: jsonb('ast_lua_issues_found').default(sql`'[]'::jsonb`),
  scannedAt: timestamp('scanned_at', { withTimezone: true }).defaultNow().notNull(),
});

// 9. Asset Moderation Reviews table
export const assetModerationReviews = pgTable('asset_moderation_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  assetId: uuid('asset_id').notNull().references(() => assets.id, { onDelete: 'cascade' }),
  reviewedByUserId: uuid('reviewed_by_user_id').references(() => users.id),
  decision: varchar('decision', { length: 30 }).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
