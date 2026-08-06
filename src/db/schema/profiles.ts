import { pgTable, uuid, varchar, text, integer, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './identity.js';
import { devVerificationStatusEnum, devTierEnum } from './enums.js';

// 1. Client Profiles table
export const clientProfiles = pgTable('client_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  discordUsername: varchar('discord_username', { length: 100 }),
  whatsappNumber: varchar('whatsapp_number', { length: 30 }),
  companyName: varchar('company_name', { length: 150 }),
  totalOrdersCount: integer('total_orders_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Developer Profiles table
export const developerProfiles = pgTable('developer_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  bio: text('bio'),
  specialization: varchar('specialization', { length: 100 }).notNull(),
  skills: text('skills').array().notNull().default(sql`'{}'::text[]`),
  portfolioUrl: text('portfolio_url'),
  verificationStatus: devVerificationStatusEnum('verification_status').notNull().default('PENDING'),
  developerTier: devTierEnum('developer_tier').notNull().default('VERIFIED'),
  activeProjectCapacity: integer('active_project_capacity').notNull().default(3),
  cachedCompletedOrders: integer('cached_completed_orders').notNull().default(0),
  cachedAverageRating: numeric('cached_average_rating', { precision: 3, scale: 2 }).notNull().default('0.00'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_dev_verification_status').on(table.verificationStatus),
  index('idx_dev_specialization').on(table.specialization),
]);

// 3. Developer Verification Submissions table
export const developerVerificationSubmissions = pgTable('developer_verification_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  developerProfileId: uuid('developer_profile_id').notNull().references(() => developerProfiles.id, { onDelete: 'cascade' }),
  portfolioLinks: text('portfolio_links').array().notNull(),
  specialization: varchar('specialization', { length: 100 }).notNull(),
  submissionNotes: text('submission_notes'),
  status: devVerificationStatusEnum('status').notNull().default('PENDING'),
  rejectionReason: text('rejection_reason'),
  reviewedByUserId: uuid('reviewed_by_user_id').references(() => users.id),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. User Preferences table
export const userPreferences = pgTable('user_preferences', {
  userId: uuid('user_id').primaryKey().references(() => users.id, { onDelete: 'cascade' }),
  language: varchar('language', { length: 10 }).notNull().default('id'),
  displayCurrency: varchar('display_currency', { length: 10 }).notNull().default('IDR'),
  timezone: varchar('timezone', { length: 50 }).default('Asia/Jakarta'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
