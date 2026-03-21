import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase";

import type { DailyEntry, PublishDailyEntryInput } from "../../domain/entities/DailyEntry";
import type { DailyEntryRepository } from "../../domain/repositories/DailyEntryRepository";

const COLLECTION_NAME = "dailyEntries";
const DEFAULT_ENTRY_QUERY_LIMIT = 50;

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

function toDailyEntryEntity(entryId: string, data: Record<string, unknown>): DailyEntry {
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

    return toDailyEntryEntity(entryId, documentData);
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
        orderBy("publishedAtISO", "desc"),
        limit(this.entryQueryLimit),
      ),
    );

    return snapshots.docs.map((snapshot) =>
      toDailyEntryEntity(snapshot.id, snapshot.data() as Record<string, unknown>),
    );
  }

  async listByOrganizationId(organizationId: string): Promise<readonly DailyEntry[]> {
    const snapshots = await getDocs(
      query(
        collection(this.db, COLLECTION_NAME),
        where("organizationId", "==", organizationId),
        orderBy("publishedAtISO", "desc"),
        limit(this.entryQueryLimit),
      ),
    );

    return snapshots.docs.map((snapshot) =>
      toDailyEntryEntity(snapshot.id, snapshot.data() as Record<string, unknown>),
    );
  }
}
