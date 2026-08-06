import { db } from '../../db/index.js';
import { auditLogs } from '../../db/schema/index.js';

export interface CreateAuditLogParams {
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  justificationReason: string;
  metadataJson?: Record<string, any>;
}

export async function createAuditLog(params: CreateAuditLogParams, tx: any = db) {
  const [log] = await tx
    .insert(auditLogs)
    .values({
      actorUserId: params.actorUserId || null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      justificationReason: params.justificationReason || 'Tindakan administratif',
      metadataJson: params.metadataJson || {},
    })
    .returning();

  return log;
}
