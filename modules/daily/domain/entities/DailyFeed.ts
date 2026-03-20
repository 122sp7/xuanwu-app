import type { DailyEntryType, DailyVisibility } from "./DailyEntry";

export interface DailyFeedItem {
  readonly audienceKey: string;
  readonly entryId: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly authorId: string;
  readonly entryType: DailyEntryType;
  readonly visibility: DailyVisibility;
  readonly title: string;
  readonly summary: string;
  readonly body: string | null;
  readonly tags: readonly string[];
  readonly publishedAtISO: string;
  readonly expiresAtISO: string | null;
  readonly rankScore: number;
  readonly rankReason: readonly string[];
}
