/**
 * Module: knowledge-database
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/databaseRecords/{recordId}
 */

import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { DatabaseRecord } from "../../domain/entities/record.entity";
import type {
  IDatabaseRecordRepository,
  CreateRecordInput,
  UpdateRecordInput,
} from "../../domain/repositories/IDatabaseRecordRepository";

function recordsCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "databaseRecords");
}

function recordDoc(db: ReturnType<typeof getFirestore>, accountId: string, recordId: string) {
  return doc(db, "accounts", accountId, "databaseRecords", recordId);
}

function toRecord(id: string, data: Record<string, unknown>): DatabaseRecord {
  return {
    id,
    databaseId: typeof data.databaseId === "string" ? data.databaseId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    pageId: typeof data.pageId === "string" ? data.pageId : null,
    properties: typeof data.properties === "object" && data.properties !== null
      ? new Map(Object.entries(data.properties as Record<string, unknown>))
      : new Map(),
    order: typeof data.order === "number" ? data.order : 0,
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseRecordRepository implements IDatabaseRecordRepository {
  private db() { return getFirestore(firebaseClientApp); }

  async create(input: CreateRecordInput): Promise<DatabaseRecord> {
    const db = this.db();
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
      databaseId: input.databaseId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      pageId: input.pageId ?? null,
      properties: input.properties ?? {},
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
      _createdAt: serverTimestamp(),
    };
    await setDoc(recordDoc(db, input.accountId, id), data);
    return toRecord(id, { ...data, properties: input.properties });
  }

  async update(input: UpdateRecordInput): Promise<DatabaseRecord | null> {
    const db = this.db();
    const ref = recordDoc(db, input.accountId, input.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const now = new Date().toISOString();
    const updates: Record<string, unknown> = { updatedAtISO: now };
    if (input.properties !== undefined) {
      updates.properties = input.properties;
    }
    await updateDoc(ref, updates);
    const merged = { ...snap.data() as Record<string, unknown>, ...updates };
    return toRecord(snap.id, merged);
  }

  async delete(accountId: string, recordId: string): Promise<void> {
    const db = this.db();
    await deleteDoc(recordDoc(db, accountId, recordId));
  }

  async findById(accountId: string, recordId: string): Promise<DatabaseRecord | null> {
    const db = this.db();
    const snap = await getDoc(recordDoc(db, accountId, recordId));
    if (!snap.exists()) return null;
    return toRecord(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecord[]> {
    const db = this.db();
    const q = query(
      recordsCol(db, accountId),
      where("databaseId", "==", databaseId),
      orderBy("order", "asc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map(d => toRecord(d.id, d.data() as Record<string, unknown>));
  }
}
