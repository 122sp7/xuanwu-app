import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@/infrastructure/firebase/client";

import type { DailyEntry, DailyVisibility } from "../../domain/entities/DailyEntry";
import type { DailyFeedItem } from "../../domain/entities/DailyFeed";
import type { DailyFeedRepository } from "../../domain/repositories/DailyFeedRepository";

const COLLECTION_NAME = "dailyEntries";
const DEFAULT_FEED_QUERY_LIMIT = 50;
const ORGANIZATION_VISIBLE_ENTRY_VISIBILITIES: readonly DailyVisibility[] = [
  "organization",
  "public_demo",
];

function requireString(data: Record<string, unknown>, field: string, entryId?: string) {
  const value = data[field];
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(
      `Daily entry${entryId ? ` ${entryId}` : ""} field ${field} is missing, empty, or not a string.`,
    );
  }

  return value;
}

function toOptionalString(data: Record<string, unknown>, field: string) {
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

function toDailyEntry(entryId: string, data: Record<string, unknown>): DailyEntry {
  return {
    entryId,
    organizationId: requireString(data, "organizationId", entryId),
    workspaceId: requireString(data, "workspaceId", entryId),
    authorId: requireString(data, "authorId", entryId),
    entryType: requireString(data, "entryType", entryId) as DailyEntry["entryType"],
    status: requireString(data, "status", entryId) as DailyEntry["status"],
    visibility: requireString(data, "visibility", entryId) as DailyEntry["visibility"],
    title: requireString(data, "title", entryId),
    summary: requireString(data, "summary", entryId),
    body: toOptionalString(data, "body"),
    tags: toStringArray(data, "tags"),
    publishedAtISO: toOptionalString(data, "publishedAtISO"),
    expiresAtISO: toOptionalString(data, "expiresAtISO"),
    sourceModule: toOptionalString(data, "sourceModule"),
    sourceEventId: toOptionalString(data, "sourceEventId"),
    createdAtISO: requireString(data, "createdAtISO", entryId),
    updatedAtISO: requireString(data, "updatedAtISO", entryId),
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
    const snapshots = await getDocs(
      query(
        collection(this.db, COLLECTION_NAME),
        where("workspaceId", "==", workspaceId),
        orderBy("publishedAtISO", "desc"),
        limit(this.feedQueryLimit),
      ),
    );

    return snapshots.docs
      .map((snapshot) => toDailyEntry(snapshot.id, snapshot.data() as Record<string, unknown>))
      .filter((entry) => !isExpired(entry))
      .map((entry) => toFeedItem(`workspace:${workspaceId}`, entry));
  }

  async listOrganizationFeed(
    organizationId: string,
    workspaceIds: readonly string[],
  ): Promise<readonly DailyFeedItem[]> {
    const workspaceIdSet = new Set(workspaceIds);
    const snapshots = await getDocs(
      query(
        collection(this.db, COLLECTION_NAME),
        where("organizationId", "==", organizationId),
        orderBy("publishedAtISO", "desc"),
        limit(this.feedQueryLimit),
      ),
    );

    return snapshots.docs
      .map((snapshot) => toDailyEntry(snapshot.id, snapshot.data() as Record<string, unknown>))
      .filter((entry) => workspaceIdSet.size === 0 || workspaceIdSet.has(entry.workspaceId))
      .filter((entry) => ORGANIZATION_VISIBLE_ENTRY_VISIBILITIES.includes(entry.visibility))
      .filter((entry) => !isExpired(entry))
      .map((entry) => toFeedItem(`organization:${organizationId}`, entry));
  }
}
