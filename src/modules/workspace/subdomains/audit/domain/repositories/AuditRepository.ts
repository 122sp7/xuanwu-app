import type { AuditEntrySnapshot } from "../entities/AuditEntry";

export interface AuditRepository {
  save(entry: AuditEntrySnapshot): Promise<void>;
  findByWorkspaceId(workspaceId: string): Promise<AuditEntrySnapshot[]>;
  findByWorkspaceIds(workspaceIds: string[], maxCount?: number): Promise<AuditEntrySnapshot[]>;
}
