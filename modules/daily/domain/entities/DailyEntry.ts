export const DAILY_ENTRY_TYPES = [
  "update",
  "blocker",
  "ask",
  "milestone",
  "signal",
  "story",
  "highlight",
] as const;

export type DailyEntryType = (typeof DAILY_ENTRY_TYPES)[number];

export const DAILY_ENTRY_STATUSES = ["draft", "published", "archived", "promoted"] as const;

export type DailyEntryStatus = (typeof DAILY_ENTRY_STATUSES)[number];

export const DAILY_VISIBILITIES = [
  "workspace_only",
  "organization",
  "selected_workspaces",
  "public_demo",
] as const;

export type DailyVisibility = (typeof DAILY_VISIBILITIES)[number];

export interface PublishDailyEntryInput {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly authorId: string;
  readonly entryType: DailyEntryType;
  readonly visibility: DailyVisibility;
  readonly title: string;
  readonly summary: string;
  readonly body?: string | null;
  readonly tags?: readonly string[];
  readonly expiresAtISO?: string | null;
}

export interface DailyEntry {
  readonly entryId: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly authorId: string;
  readonly entryType: DailyEntryType;
  readonly status: DailyEntryStatus;
  readonly visibility: DailyVisibility;
  readonly title: string;
  readonly summary: string;
  readonly body: string | null;
  readonly tags: readonly string[];
  readonly publishedAtISO: string | null;
  readonly expiresAtISO: string | null;
  readonly sourceModule: string | null;
  readonly sourceEventId: string | null;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export function isDailyEntryType(value: string): value is DailyEntryType {
  return DAILY_ENTRY_TYPES.includes(value as DailyEntryType);
}

export function isDailyVisibility(value: string): value is DailyVisibility {
  return DAILY_VISIBILITIES.includes(value as DailyVisibility);
}
