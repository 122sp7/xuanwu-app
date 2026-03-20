import type { DailyEntry } from "../../domain/entities/DailyEntry";
import type { DailyFeedItem } from "../../domain/entities/DailyFeed";
import type { DailyEntryRepository } from "../../domain/repositories/DailyEntryRepository";

function isExpired(entry: DailyEntry, now = Date.now()) {
  if (!entry.expiresAtISO) {
    return false;
  }

  const expiresAt = Date.parse(entry.expiresAtISO);
  return !Number.isNaN(expiresAt) && expiresAt <= now;
}

function toFeedItem(audienceKey: string, entry: DailyEntry): DailyFeedItem {
  const publishedAtISO = entry.publishedAtISO ?? entry.createdAtISO;
  const rankScore = Date.parse(publishedAtISO);

  return {
    audienceKey,
    entryId: entry.entryId,
    organizationId: entry.organizationId,
    workspaceId: entry.workspaceId,
    authorId: entry.authorId,
    entryType: entry.entryType,
    visibility: entry.visibility,
    title: entry.title,
    summary: entry.summary,
    body: entry.body,
    tags: entry.tags,
    publishedAtISO,
    expiresAtISO: entry.expiresAtISO,
    rankScore: Number.isNaN(rankScore) ? 0 : rankScore,
    rankReason: ["freshness"],
  };
}

export class ListWorkspaceDailyFeedUseCase {
  constructor(private readonly dailyEntryRepository: DailyEntryRepository) {}

  async execute(workspaceId: string): Promise<readonly DailyFeedItem[]> {
    const entries = await this.dailyEntryRepository.listByWorkspaceId(workspaceId);

    return entries
      .filter((entry) => !isExpired(entry))
      .map((entry) => toFeedItem(`workspace:${workspaceId}`, entry));
  }
}

export class ListOrganizationDailyFeedUseCase {
  constructor(private readonly dailyEntryRepository: DailyEntryRepository) {}

  async execute(
    organizationId: string,
    workspaceIds: readonly string[],
  ): Promise<readonly DailyFeedItem[]> {
    const workspaceIdSet = new Set(workspaceIds);
    const entries = await this.dailyEntryRepository.listByOrganizationId(organizationId);

    // An empty workspace filter means "all workspaces already scoped to this organization".
    return entries
      .filter((entry) => workspaceIdSet.size === 0 || workspaceIdSet.has(entry.workspaceId))
      .filter((entry) => !isExpired(entry))
      .map((entry) => toFeedItem(`organization:${organizationId}`, entry));
  }
}
