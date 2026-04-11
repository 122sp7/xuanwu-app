import type { AuditLogEntity } from "../../application/dto/audit.dto";
import {
  ListOrganizationAuditLogsUseCase,
  ListWorkspaceAuditLogsUseCase,
} from "../../application/queries/list-audit-logs.queries";
import { makeAuditRepo } from "../../api/factories";

const auditRepo = makeAuditRepo();
const listWorkspaceAuditLogsUseCase = new ListWorkspaceAuditLogsUseCase(auditRepo);
const listOrganizationAuditLogsUseCase = new ListOrganizationAuditLogsUseCase(auditRepo);

export async function getWorkspaceAuditLogs(
  workspaceId: string,
): Promise<AuditLogEntity[]> {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) {
    return [];
  }

  return listWorkspaceAuditLogsUseCase.execute(normalizedWorkspaceId);
}

export async function getOrganizationAuditLogs(
  workspaceIds: string[],
  maxCount = 200,
): Promise<AuditLogEntity[]> {
  const normalizedWorkspaceIds = workspaceIds
    .map((workspaceId) => workspaceId.trim())
    .filter(Boolean);

  if (normalizedWorkspaceIds.length === 0) {
    return [];
  }

  return listOrganizationAuditLogsUseCase.execute(normalizedWorkspaceIds, maxCount);
}
