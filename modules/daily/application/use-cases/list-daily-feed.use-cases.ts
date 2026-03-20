import type { DailyFeedItem } from "../../domain/entities/DailyFeed";
import type { DailyFeedRepository } from "../../domain/repositories/DailyFeedRepository";

export class ListWorkspaceDailyFeedUseCase {
  constructor(private readonly dailyFeedRepository: DailyFeedRepository) {}

  async execute(workspaceId: string): Promise<readonly DailyFeedItem[]> {
    return this.dailyFeedRepository.listWorkspaceFeed(workspaceId);
  }
}

export class ListOrganizationDailyFeedUseCase {
  constructor(private readonly dailyFeedRepository: DailyFeedRepository) {}

  async execute(
    organizationId: string,
    workspaceIds: readonly string[],
  ): Promise<readonly DailyFeedItem[]> {
    return this.dailyFeedRepository.listOrganizationFeed(organizationId, workspaceIds);
  }
}
