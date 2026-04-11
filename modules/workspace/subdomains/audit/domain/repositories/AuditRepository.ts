import type { AuditEntry } from "../aggregates/AuditEntry";
import type { AuditLogEntity } from "../entities/AuditLog";

export interface AuditRepository {
  save(entry: AuditEntry): Promise<void>;
  findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]>;
  findByWorkspaceIds(workspaceIds: string[], maxCount?: number): Promise<AuditLogEntity[]>;
}
