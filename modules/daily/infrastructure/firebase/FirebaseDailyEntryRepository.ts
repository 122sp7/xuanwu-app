import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type { DailyEntry, PublishDailyEntryInput } from "../../domain/entities/DailyEntry";
import type { DailyEntryRepository } from "../../domain/repositories/DailyEntryRepository";

const COLLECTION_NAME = "dailyEntries";
const DEFAULT_ENTRY_QUERY_LIMIT = 50;

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
 * so a single malformed document never poisons a list query.
 */
function toDailyEntryEntity(entryId: string, data: Record<string, unknown>): DailyEntry | null {
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
      console.warn(`[FirebaseDailyEntryRepository] Skipping malformed dailyEntry ${entryId}`);
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

export class FirebaseDailyEntryRepository implements DailyEntryRepository {
  constructor(private readonly entryQueryLimit = DEFAULT_ENTRY_QUERY_LIMIT) {}

  private get db() {
    return getFirestore(firebaseClientApp);
  }

  async publish(input: PublishDailyEntryInput): Promise<DailyEntry> {
    const entryId = doc(collection(this.db, COLLECTION_NAME)).id;
    const entryRef = doc(this.db, COLLECTION_NAME, entryId);
    const nowISO = new Date().toISOString();

    const documentData = {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      authorId: input.authorId,
      entryType: input.entryType,
      status: "published",
      visibility: input.visibility,
      title: input.title,
      summary: input.summary,
      body: input.body ?? null,
      tags: [...(input.tags ?? [])],
      publishedAtISO: nowISO,
      expiresAtISO: input.expiresAtISO ?? null,
      sourceModule: null,
      sourceEventId: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    } satisfies Record<string, unknown>;

    await setDoc(entryRef, documentData);

    // documentData is fully constructed above so toDailyEntryEntity will not return null here.
    return toDailyEntryEntity(entryId, documentData) as DailyEntry;
  }

  async findById(entryId: string): Promise<DailyEntry | null> {
    const snapshot = await getDoc(doc(this.db, COLLECTION_NAME, entryId));
    if (!snapshot.exists()) {
      return null;
    }

    return toDailyEntryEntity(snapshot.id, snapshot.data() as Record<string, unknown>);
  }

  async listByWorkspaceId(workspaceId: string): Promise<readonly DailyEntry[]> {
    const snapshots = await getDocs(
      query(
        collection(this.db, COLLECTION_NAME),
        where("workspaceId", "==", workspaceId),
        limit(this.entryQueryLimit),
      ),
    );

    return snapshots.docs
      .map((snapshot) =>
        toDailyEntryEntity(snapshot.id, snapshot.data() as Record<string, unknown>),
      )
      .filter((entry): entry is DailyEntry => entry !== null)
      .sort((a, b) => {
        const ta = Date.parse(a.publishedAtISO ?? a.createdAtISO);
        const tb = Date.parse(b.publishedAtISO ?? b.createdAtISO);
        return tb - ta;
      });
  }

  async listByOrganizationId(organizationId: string): Promise<readonly DailyEntry[]> {
    const snapshots = await getDocs(
      query(
        collection(this.db, COLLECTION_NAME),
        where("organizationId", "==", organizationId),
        limit(this.entryQueryLimit),
      ),
    );

    return snapshots.docs
      .map((snapshot) =>
        toDailyEntryEntity(snapshot.id, snapshot.data() as Record<string, unknown>),
      )
      .filter((entry): entry is DailyEntry => entry !== null)
      .sort((a, b) => {
        const ta = Date.parse(a.publishedAtISO ?? a.createdAtISO);
        const tb = Date.parse(b.publishedAtISO ?? b.createdAtISO);
        return tb - ta;
      });
  }
}
