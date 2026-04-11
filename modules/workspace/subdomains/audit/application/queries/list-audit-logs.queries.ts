import type { AuditLogEntity } from "../../domain/entities/AuditLog";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";

export class ListWorkspaceAuditLogsUseCase {
  constructor(private readonly auditRepo: AuditRepository) {}

  execute(workspaceId: string): Promise<AuditLogEntity[]> {
    return this.auditRepo.findByWorkspaceId(workspaceId);
  }
}

export class ListOrganizationAuditLogsUseCase {
  constructor(private readonly auditRepo: AuditRepository) {}

  execute(workspaceIds: string[], maxCount?: number): Promise<AuditLogEntity[]> {
    return this.auditRepo.findByWorkspaceIds(workspaceIds, maxCount);
  }
}
