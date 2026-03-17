import type { AuditLogEntity } from "../../domain/entities/AuditLog";
import type { AuditRepository } from "../../domain/repositories/AuditRepository";

export class ListWorkspaceAuditLogsUseCase {
  constructor(private readonly auditRepo: AuditRepository) {}

  execute(workspaceId: string): Promise<AuditLogEntity[]> {
    return this.auditRepo.findByWorkspaceId(workspaceId);
  }
}
