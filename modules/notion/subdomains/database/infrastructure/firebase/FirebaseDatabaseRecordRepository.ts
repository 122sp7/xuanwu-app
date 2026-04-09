/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of IDatabaseRecordRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}/records/{recordId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@integration-firebase/firestore";

const db = getFirebaseFirestore();
import type { IDatabaseRecordRepository, CreateRecordInput, UpdateRecordInput } from "../../domain/repositories/IDatabaseRecordRepository";
import type { DatabaseRecordSnapshot } from "../../domain/aggregates/DatabaseRecord";

function recordsCol(accountId: string, databaseId: string) {
  return collection(db, "accounts", accountId, "knowledgeDatabases", databaseId, "records");
}

function recordDoc(accountId: string, databaseId: string, id: string) {
  return doc(db, "accounts", accountId, "knowledgeDatabases", databaseId, "records", id);
}

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === "string") return ts;
  return new Date().toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnapshot(id: string, data: Record<string, any>): DatabaseRecordSnapshot {
  return {
    id,
    databaseId: data.databaseId ?? "",
    workspaceId: data.workspaceId ?? "",
    accountId: data.accountId ?? "",
    pageId: data.pageId ?? null,
    properties: typeof data.properties === "object" && data.properties !== null ? data.properties : {},
    order: typeof data.order === "number" ? data.order : 0,
    createdByUserId: data.createdByUserId ?? "",
    createdAtISO: toISO(data.createdAt),
    updatedAtISO: toISO(data.updatedAt),
  };
}

export class FirebaseDatabaseRecordRepository implements IDatabaseRecordRepository {
  async create(input: CreateRecordInput): Promise<DatabaseRecordSnapshot> {
    const col = recordsCol(input.accountId, input.databaseId);
    const countSnap = await getDocs(col);
    const now = serverTimestamp();
    const docRef = await addDoc(col, {
      databaseId: input.databaseId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      pageId: input.pageId ?? null,
      properties: input.properties ?? {},
      order: countSnap.size,
      createdByUserId: input.createdByUserId,
      createdAt: now,
      updatedAt: now,
    });
    const snap = await getDoc(docRef);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(docRef.id, snap.data() as Record<string, any>);
  }

  async update(input: UpdateRecordInput): Promise<DatabaseRecordSnapshot> {
    // We need to find which database this record belongs to. Properties are keyed by field IDs.
    // The record stores databaseId on the document; we fetch it via a collection-group query approach.
    // For simplicity, the input should come from a context where databaseId is available.
    // Here we use a direct path by reading the doc first from a stored databaseId lookup.
    // Since the record doc lives in accounts/{accountId}/knowledgeDatabases/{databaseId}/records/{id},
    // and we only have id+accountId, we do collection group query.
    const { id, accountId, properties } = input;
    const { collectionGroup, query: fsQuery, where, getDocs: fsGetDocs } = await import("firebase/firestore");
    const q = fsQuery(
      collectionGroup(db, "records"),
      where("accountId", "==", accountId),
    );
    const results = await fsGetDocs(q);
    const target = results.docs.find((d) => d.id === id);
    if (!target) throw new Error(`Record ${id} not found`);
    await updateDoc(target.ref, { properties, updatedAt: serverTimestamp() });
    const refreshed = await getDoc(target.ref);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(id, refreshed.data() as Record<string, any>);
  }

  async delete(id: string, accountId: string): Promise<void> {
    const { collectionGroup, query: fsQuery, where, getDocs: fsGetDocs } = await import("firebase/firestore");
    const q = fsQuery(collectionGroup(db, "records"), where("accountId", "==", accountId));
    const results = await fsGetDocs(q);
    const target = results.docs.find((d) => d.id === id);
    if (target) await deleteDoc(target.ref);
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]> {
    const snaps = await getDocs(recordsCol(accountId, databaseId));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, any>));
  }
}
