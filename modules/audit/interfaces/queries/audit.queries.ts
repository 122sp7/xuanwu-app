import type { AuditLogEntity } from "../../domain/entities/AuditLog";
import { ListWorkspaceAuditLogsUseCase } from "../../application/use-cases/audit.use-cases";
import { FirebaseAuditRepository } from "../../infrastructure/firebase/FirebaseAuditRepository";

const auditRepo = new FirebaseAuditRepository();
const listWorkspaceAuditLogsUseCase = new ListWorkspaceAuditLogsUseCase(auditRepo);

export async function getWorkspaceAuditLogs(
  workspaceId: string,
): Promise<AuditLogEntity[]> {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) {
    return [];
  }

  return listWorkspaceAuditLogsUseCase.execute(normalizedWorkspaceId);
}
