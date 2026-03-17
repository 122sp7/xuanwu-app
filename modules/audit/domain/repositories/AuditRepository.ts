import type { AuditLogEntity } from "../entities/AuditLog";

export interface AuditRepository {
  findByWorkspaceId(workspaceId: string): Promise<AuditLogEntity[]>;
}
