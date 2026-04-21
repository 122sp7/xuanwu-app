import type { AuditLogEntrySnapshot, AuditAction } from "../entities/AuditLogEntry";

export interface AuditLogQuery {
  readonly organizationId?: string;
  readonly workspaceId?: string;
  readonly actorId?: string;
  readonly action?: AuditAction;
  readonly resourceType?: string;
  readonly resourceId?: string;
  readonly fromISO?: string;
  readonly toISO?: string;
  readonly limit?: number;
  readonly offset?: number;
}

export interface AuditLogRepository {
  append(snapshot: AuditLogEntrySnapshot): Promise<void>;
  query(params: AuditLogQuery): Promise<AuditLogEntrySnapshot[]>;
}
