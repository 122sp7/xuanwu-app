import type { AuditLogEntity } from "../entities/AuditLog";

export interface AuditRepository {
  findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]>;
  findByWorkspaceIds(workspaceIds: string[], maxCount?: number): Promise<AuditLogEntity[]>;
}
