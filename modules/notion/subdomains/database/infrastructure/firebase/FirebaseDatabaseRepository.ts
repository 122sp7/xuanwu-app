/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of IDatabaseRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseFirestore } from "@integration-firebase/firestore";

const db = getFirebaseFirestore();
import { generateId } from "@shared-utils";
import type { IDatabaseRepository, CreateDatabaseInput, UpdateDatabaseInput, AddFieldInput } from "../../domain/repositories/IDatabaseRepository";
import type { DatabaseSnapshot, Field } from "../../domain/aggregates/Database";

function databasesCol(accountId: string) {
  return collection(db, "accounts", accountId, "knowledgeDatabases");
}

function databaseDoc(accountId: string, id: string) {
  return doc(db, "accounts", accountId, "knowledgeDatabases", id);
}

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
  if (typeof ts === "string") return ts;
  return new Date().toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnapshot(id: string, data: Record<string, any>): DatabaseSnapshot {
  return {
    id,
    workspaceId: data.workspaceId ?? "",
    accountId: data.accountId ?? "",
    name: data.name ?? "",
    description: data.description ?? null,
    fields: Array.isArray(data.fields) ? data.fields : [],
    viewIds: Array.isArray(data.viewIds) ? data.viewIds : [],
    icon: data.icon ?? null,
    coverImageUrl: data.coverImageUrl ?? null,
    createdByUserId: data.createdByUserId ?? "",
    createdAtISO: toISO(data.createdAt),
    updatedAtISO: toISO(data.updatedAt),
  };
}

export class FirebaseDatabaseRepository implements IDatabaseRepository {
  async create(input: CreateDatabaseInput): Promise<DatabaseSnapshot> {
    const col = databasesCol(input.accountId);
    const now = serverTimestamp();
    const docRef = await addDoc(col, {
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      name: input.name,
      description: input.description ?? null,
      fields: [],
      viewIds: [],
      icon: null,
      coverImageUrl: null,
      createdByUserId: input.createdByUserId,
      createdAt: now,
      updatedAt: now,
    });
    const snap = await getDoc(docRef);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(docRef.id, snap.data() as Record<string, any>);
  }

  async update(input: UpdateDatabaseInput): Promise<DatabaseSnapshot> {
    const ref = databaseDoc(input.accountId, input.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changes: Record<string, any> = { updatedAt: serverTimestamp() };
    if (input.name !== undefined) changes.name = input.name;
    if (input.description !== undefined) changes.description = input.description;
    if (input.icon !== undefined) changes.icon = input.icon;
    if (input.coverImageUrl !== undefined) changes.coverImageUrl = input.coverImageUrl;
    await updateDoc(ref, changes);
    const snap = await getDoc(ref);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(input.id, snap.data() as Record<string, any>);
  }

  async addField(input: AddFieldInput): Promise<Field> {
    const ref = databaseDoc(input.accountId, input.databaseId);
    const snap = await getDoc(ref);
    const data = snap.data() ?? {};
    const fields: Field[] = Array.isArray(data.fields) ? [...data.fields] : [];
    const newField: Field = {
      id: generateId(),
      name: input.name,
      type: input.type,
      config: input.config ?? {},
      required: input.required ?? false,
      order: fields.length,
    };
    fields.push(newField);
    await updateDoc(ref, { fields, updatedAt: serverTimestamp() });
    return newField;
  }

  async archive(id: string, accountId: string): Promise<void> {
    const ref = databaseDoc(accountId, id);
    await updateDoc(ref, { archived: true, archivedAt: serverTimestamp(), updatedAt: serverTimestamp() });
  }

  async findById(id: string, accountId: string): Promise<DatabaseSnapshot | null> {
    const snap = await getDoc(databaseDoc(accountId, id));
    if (!snap.exists()) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(id, snap.data() as Record<string, any>);
  }

  async listByWorkspace(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]> {
    const q = query(databasesCol(accountId), where("workspaceId", "==", workspaceId), where("archived", "!=", true));
    const snaps = await getDocs(q);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, any>));
  }
}
