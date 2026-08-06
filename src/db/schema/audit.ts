import { pgTable, uuid, varchar, text, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './identity.js';

// Audit Logs table (Append-only)
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorUserId: uuid('actor_user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(), // e.g. FORCE_REFUND, FORCE_RELEASE, REASSIGN_DEVELOPER, SUSPEND_DEVELOPER, REMOVE_ASSET, CHANGE_PLATFORM_FEE, RESOLVE_DISPUTE
  entityType: varchar('entity_type', { length: 50 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  justificationReason: text('justification_reason').notNull(),
  metadataJson: jsonb('metadata_json').default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
