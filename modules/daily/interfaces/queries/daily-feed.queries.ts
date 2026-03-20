import type { DailyFeedItem } from "../../domain/entities/DailyFeed";
import {
  ListOrganizationDailyFeedUseCase,
  ListWorkspaceDailyFeedUseCase,
} from "../../application/use-cases/list-daily-feed.use-cases";
import { FirebaseDailyEntryRepository } from "../../infrastructure/firebase/FirebaseDailyEntryRepository";

function createDailyEntryRepository() {
  return new FirebaseDailyEntryRepository();
}

export async function getWorkspaceDailyFeed(workspaceId: string): Promise<readonly DailyFeedItem[]> {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) {
    return [];
  }

  const useCase = new ListWorkspaceDailyFeedUseCase(createDailyEntryRepository());
  return useCase.execute(normalizedWorkspaceId);
}

export async function getOrganizationDailyFeed(
  organizationId: string,
  workspaceIds: readonly string[],
): Promise<readonly DailyFeedItem[]> {
  const normalizedOrganizationId = organizationId.trim();
  if (!normalizedOrganizationId) {
    return [];
  }

  const normalizedWorkspaceIds = workspaceIds.map((workspaceId) => workspaceId.trim()).filter(Boolean);
  const useCase = new ListOrganizationDailyFeedUseCase(createDailyEntryRepository());
  return useCase.execute(normalizedOrganizationId, normalizedWorkspaceIds);
}
