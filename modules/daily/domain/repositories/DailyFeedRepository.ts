import type { DailyFeedItem } from "../entities/DailyFeed";

export interface DailyFeedRepository {
  listWorkspaceFeed(workspaceId: string): Promise<readonly DailyFeedItem[]>;
  listOrganizationFeed(
    organizationId: string,
    workspaceIds: readonly string[],
  ): Promise<readonly DailyFeedItem[]>;
}
