import { prisma } from '../../database/prisma';

export interface AuditEntry {
  actorId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

/**
 * Append-only by convention: no update/delete method is exposed here.
 * Never pass raw PII (report identity, tokens) into `metadata` — log
 * references (ids) instead.
 */
export async function recordAuditEvent(entry: AuditEntry): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorId: entry.actorId,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      metadata: entry.metadata as any,
      ipAddress: entry.ipAddress,
    },
  });
}
