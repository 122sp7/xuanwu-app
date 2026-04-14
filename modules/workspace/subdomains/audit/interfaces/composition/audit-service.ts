import type { RecordAuditEntryInput } from "../../domain/aggregates/AuditEntry";
import type { AuditLogEntity } from "../../domain/entities/AuditLog";
import {
  ListOrganizationAuditLogsQuery,
  ListWorkspaceAuditLogsQuery,
} from "../../application/queries/list-audit-logs.queries";
import { RecordAuditEntryUseCase } from "../../application/use-cases/record-audit-entry.use-case";
import { FirebaseAuditRepository } from "../../infrastructure/firebase/FirebaseAuditRepository";

const auditRepository = new FirebaseAuditRepository();
const listWorkspaceAuditLogsQuery = new ListWorkspaceAuditLogsQuery(auditRepository);
const listOrganizationAuditLogsQuery = new ListOrganizationAuditLogsQuery(auditRepository);
const recordAuditEntryUseCase = new RecordAuditEntryUseCase(auditRepository);

export async function getWorkspaceAuditLogs(
  workspaceId: string,
): Promise<AuditLogEntity[]> {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) {
    return [];
  }

  return listWorkspaceAuditLogsQuery.execute(normalizedWorkspaceId);
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

  return listOrganizationAuditLogsQuery.execute(normalizedWorkspaceIds, maxCount);
}

export async function recordWorkspaceAuditEntry(
  input: RecordAuditEntryInput,
): Promise<void> {
  await recordAuditEntryUseCase.execute(input);
}
