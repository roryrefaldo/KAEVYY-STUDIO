import { pgTable, uuid, varchar, numeric, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { orders } from './orders.js';
import { users } from './identity.js';
import { paymentStatusEnum, paymentMethodEnum, escrowStatusEnum } from './enums.js';

// 1. Platform Fee Settings table
export const platformFeeSettings = pgTable('platform_fee_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  feePercentage: numeric('fee_percentage', { precision: 5, scale: 4 }).notNull().default('0.1000'),
  effectiveFrom: timestamp('effective_from', { withTimezone: true }).defaultNow().notNull(),
  createdByUserId: uuid('created_by_user_id').references(() => users.id),
});

// 2. Payments table
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  status: paymentStatusEnum('status').notNull().default('PENDING'),
  paymentMethodCategory: paymentMethodEnum('payment_method_category').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Payment Transactions table
export const paymentTransactions = pgTable('payment_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  paymentId: uuid('payment_id').notNull().references(() => payments.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 50 }).notNull(),
  providerTransactionId: varchar('provider_transaction_id', { length: 255 }),
  amount: numeric('amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  rawProviderResponse: jsonb('raw_provider_response'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Escrow Records table
export const escrowRecords = pgTable('escrow_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().unique().references(() => orders.id, { onDelete: 'cascade' }),
  paymentId: uuid('payment_id').references(() => payments.id),
  grossAmount: numeric('gross_amount', { precision: 15, scale: 2 }).notNull(),
  platformFeeAmount: numeric('platform_fee_amount', { precision: 15, scale: 2 }).notNull(),
  netDeveloperAmount: numeric('net_developer_amount', { precision: 15, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(),
  status: escrowStatusEnum('status').notNull().default('HELD'),
  lockedAt: timestamp('locked_at', { withTimezone: true }).defaultNow().notNull(),
  releasedAt: timestamp('released_at', { withTimezone: true }),
  refundedAt: timestamp('refunded_at', { withTimezone: true }),
});
