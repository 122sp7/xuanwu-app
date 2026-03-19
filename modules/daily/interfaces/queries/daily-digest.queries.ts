import type {
  OrganizationDailyDigestEntity,
  WorkspaceDailyDigestEntity,
} from "../../domain/entities/DailyDigest";
import {
  GetOrganizationDailyDigestUseCase,
  GetWorkspaceDailyDigestUseCase,
} from "../../application/use-cases/daily-digest.use-cases";
import { DefaultDailyDigestRepository } from "../../infrastructure/default/DefaultDailyDigestRepository";

const repository = new DefaultDailyDigestRepository();
const getWorkspaceDigestUseCase = new GetWorkspaceDailyDigestUseCase(repository);
const getOrganizationDigestUseCase = new GetOrganizationDailyDigestUseCase(repository);

export async function getWorkspaceDailyDigest(
  workspaceId: string,
  accountId: string,
): Promise<WorkspaceDailyDigestEntity> {
  const normalizedWorkspaceId = workspaceId.trim();
  const normalizedAccountId = accountId.trim();

  if (!normalizedWorkspaceId || !normalizedAccountId) {
    return {
      workspaceId: normalizedWorkspaceId,
      accountId: normalizedAccountId,
      summary: { total: 0, unread: 0 },
      items: [],
    };
  }

  return getWorkspaceDigestUseCase.execute(normalizedWorkspaceId, normalizedAccountId);
}

export async function getOrganizationDailyDigest(
  organizationId: string,
  workspaceIds: string[],
): Promise<OrganizationDailyDigestEntity> {
  const normalizedOrganizationId = organizationId.trim();

  if (!normalizedOrganizationId) {
    return {
      organizationId: normalizedOrganizationId,
      summary: { total: 0, unread: 0 },
      items: [],
    };
  }

  const normalizedWorkspaceIds = workspaceIds
    .map((workspaceId) => workspaceId.trim())
    .filter(Boolean);

  return getOrganizationDigestUseCase.execute(normalizedOrganizationId, normalizedWorkspaceIds);
}
