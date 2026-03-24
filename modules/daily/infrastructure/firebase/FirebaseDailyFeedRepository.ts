import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type { DailyEntry, DailyVisibility } from "../../domain/entities/DailyEntry";
import type { DailyFeedItem } from "../../domain/entities/DailyFeed";
import type { DailyFeedRepository } from "../../domain/repositories/DailyFeedRepository";

const COLLECTION_NAME = "dailyEntries";
const DEFAULT_FEED_QUERY_LIMIT = 50;
const ORGANIZATION_VISIBLE_ENTRY_VISIBILITIES: readonly DailyVisibility[] = [
  "organization",
  "public_demo",
];

function toOptionalString(data: Record<string, unknown>, field: string) {
  const value = data[field];
  return typeof value === "string" && value.trim() ? value : null;
}

function toRequiredString(data: Record<string, unknown>, field: string): string | null {
  const value = data[field];
  return typeof value === "string" && value.trim() ? value : null;
}

function toStringArray(data: Record<string, unknown>, field: string) {
  const value = data[field];
  if (!Array.isArray(value)) {
    return [] as const;
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

/**
 * Maps a Firestore document to a DailyEntry.
 * Returns null (and logs a warning in dev) if any required field is missing,
 * so a single malformed document never poisons the entire feed query.
 */
function toDailyEntry(entryId: string, data: Record<string, unknown>): DailyEntry | null {
  const organizationId = toRequiredString(data, "organizationId");
  const workspaceId = toRequiredString(data, "workspaceId");
  const authorId = toRequiredString(data, "authorId");
  const entryType = toRequiredString(data, "entryType");
  const status = toRequiredString(data, "status");
  const visibility = toRequiredString(data, "visibility");
  const title = toRequiredString(data, "title");
  const summary = toRequiredString(data, "summary");
  const createdAtISO = toRequiredString(data, "createdAtISO");
  const updatedAtISO = toRequiredString(data, "updatedAtISO");

  if (
    !organizationId ||
    !workspaceId ||
    !authorId ||
    !entryType ||
    !status ||
    !visibility ||
    !title ||
    !summary ||
    !createdAtISO ||
    !updatedAtISO
  ) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[FirebaseDailyFeedRepository] Skipping malformed dailyEntry ${entryId}`);
    }
    return null;
  }

  return {
    entryId,
    organizationId,
    workspaceId,
    authorId,
    entryType: entryType as DailyEntry["entryType"],
    status: status as DailyEntry["status"],
    visibility: visibility as DailyEntry["visibility"],
    title,
    summary,
    body: toOptionalString(data, "body"),
    tags: toStringArray(data, "tags"),
    publishedAtISO: toOptionalString(data, "publishedAtISO"),
    expiresAtISO: toOptionalString(data, "expiresAtISO"),
    sourceModule: toOptionalString(data, "sourceModule"),
    sourceEventId: toOptionalString(data, "sourceEventId"),
    createdAtISO,
    updatedAtISO,
  };
}

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

export class FirebaseDailyFeedRepository implements DailyFeedRepository {
  constructor(private readonly feedQueryLimit = DEFAULT_FEED_QUERY_LIMIT) {}

  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async listWorkspaceFeed(workspaceId: string): Promise<readonly DailyFeedItem[]> {
    // Single-field where without orderBy — no composite index required.
    // Sorting is done client-side on rankScore (publishedAt timestamp).
    const snapshots = await getDocs(
      query(
        collection(this.db, COLLECTION_NAME),
        where("workspaceId", "==", workspaceId),
        limit(this.feedQueryLimit),
      ),
    );

    return snapshots.docs
      .map((snapshot) => toDailyEntry(snapshot.id, snapshot.data() as Record<string, unknown>))
      .filter((entry): entry is DailyEntry => entry !== null)
      .filter((entry) => !isExpired(entry))
      .map((entry) => toFeedItem(`workspace:${workspaceId}`, entry))
      .sort((a, b) => b.rankScore - a.rankScore);
  }

  async listOrganizationFeed(
    organizationId: string,
    workspaceIds: readonly string[],
  ): Promise<readonly DailyFeedItem[]> {
    // Single-field where without orderBy — no composite index required.
    // Sorting is done client-side on rankScore (publishedAt timestamp).
    const workspaceIdSet = new Set(workspaceIds);
    const snapshots = await getDocs(
      query(
        collection(this.db, COLLECTION_NAME),
        where("organizationId", "==", organizationId),
        limit(this.feedQueryLimit),
      ),
    );

    // An empty workspace list means the caller already scoped to the whole organization.
    return snapshots.docs
      .map((snapshot) => toDailyEntry(snapshot.id, snapshot.data() as Record<string, unknown>))
      .filter((entry): entry is DailyEntry => entry !== null)
      .filter((entry) => workspaceIdSet.size === 0 || workspaceIdSet.has(entry.workspaceId))
      .filter((entry) => ORGANIZATION_VISIBLE_ENTRY_VISIBILITIES.includes(entry.visibility))
      .filter((entry) => !isExpired(entry))
      .map((entry) => toFeedItem(`organization:${organizationId}`, entry))
      .sort((a, b) => b.rankScore - a.rankScore);
  }
}
