import { pgTable, uuid, varchar, text, integer, numeric, timestamp, index } from 'drizzle-orm/pg-core';
import { developerProfiles } from './profiles.js';
import { pricingTypeEnum, serviceStatusEnum } from './enums.js';

// 1. Service Categories table
export const serviceCategories = pgTable('service_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  iconName: varchar('icon_name', { length: 50 }),
  displayOrder: integer('display_order').notNull().default(0),
});

// 2. Services table
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  developerProfileId: uuid('developer_profile_id').notNull().references(() => developerProfiles.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => serviceCategories.id),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 220 }).notNull().unique(),
  description: text('description').notNull(),
  pricingType: pricingTypeEnum('pricing_type').notNull().default('FIXED'),
  basePrice: numeric('base_price', { precision: 15, scale: 2 }).notNull(),
  baseCurrency: varchar('base_currency', { length: 10 }).notNull().default('IDR'),
  minimumPrice: numeric('minimum_price', { precision: 15, scale: 2 }),
  maximumPrice: numeric('maximum_price', { precision: 15, scale: 2 }),
  estimatedDeliveryDays: integer('estimated_delivery_days').notNull(),
  status: serviceStatusEnum('status').notNull().default('ACTIVE'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('idx_services_dev').on(table.developerProfileId),
  index('idx_services_category').on(table.categoryId),
  index('idx_services_status').on(table.status),
]);

// 3. Exchange Rates table
export const exchangeRates = pgTable('exchange_rates', {
  id: uuid('id').defaultRandom().primaryKey(),
  baseCurrency: varchar('base_currency', { length: 10 }).notNull(),
  quoteCurrency: varchar('quote_currency', { length: 10 }).notNull(),
  rate: numeric('rate', { precision: 18, scale: 6 }).notNull(),
  effectiveAt: timestamp('effective_at', { withTimezone: true }).defaultNow().notNull(),
  source: varchar('source', { length: 100 }).default('MANUAL_ADMIN'),
}, (table) => [
  index('idx_exchange_rates_pair').on(table.baseCurrency, table.quoteCurrency, table.effectiveAt),
]);

// 4. Service Price History table
export const servicePriceHistory = pgTable('service_price_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  serviceId: uuid('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  oldPrice: numeric('old_price', { precision: 15, scale: 2 }).notNull(),
  newPrice: numeric('new_price', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  changedAt: timestamp('changed_at', { withTimezone: true }).defaultNow().notNull(),
});
