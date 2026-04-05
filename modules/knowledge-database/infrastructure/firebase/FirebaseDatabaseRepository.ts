/**
 * Module: knowledge-database
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/knowledgeDatabases/{databaseId}
 */

import {
  arrayUnion, collection, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { Database, Field, FieldType } from "../../domain/entities/database.entity";
import type {
  IDatabaseRepository,
  CreateDatabaseInput,
  UpdateDatabaseInput,
  AddFieldInput,
} from "../../domain/repositories/IDatabaseRepository";

function dbsCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "knowledgeDatabases");
}

function dbDoc(db: ReturnType<typeof getFirestore>, accountId: string, databaseId: string) {
  return doc(db, "accounts", accountId, "knowledgeDatabases", databaseId);
}

function toField(f: Record<string, unknown>): Field {
  return {
    id: typeof f.id === "string" ? f.id : generateId(),
    name: typeof f.name === "string" ? f.name : "",
    type: (f.type as FieldType) ?? "text",
    config: typeof f.config === "object" && f.config !== null ? (f.config as Record<string, unknown>) : {},
    required: f.required === true,
    order: typeof f.order === "number" ? f.order : 0,
  };
}

function toDatabase(id: string, data: Record<string, unknown>): Database {
  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    name: typeof data.name === "string" ? data.name : "",
    description: typeof data.description === "string" ? data.description : null,
    fields: Array.isArray(data.fields)
      ? (data.fields as Record<string, unknown>[]).map(toField)
      : [],
    viewIds: Array.isArray(data.viewIds)
      ? (data.viewIds as unknown[]).filter((v): v is string => typeof v === "string")
      : [],
    icon: typeof data.icon === "string" ? data.icon : null,
    coverImageUrl: typeof data.coverImageUrl === "string" ? data.coverImageUrl : null,
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseDatabaseRepository implements IDatabaseRepository {
  private db() { return getFirestore(firebaseClientApp); }

  async create(input: CreateDatabaseInput): Promise<Database> {
    const db = this.db();
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      name: input.name,
      description: input.description ?? null,
      fields: [],
      viewIds: [],
      icon: null,
      coverImageUrl: null,
      archived: false,
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
      _createdAt: serverTimestamp(),
    };
    await setDoc(dbDoc(db, input.accountId, id), data);
    return toDatabase(id, data);
  }

  async update(input: UpdateDatabaseInput): Promise<Database | null> {
    const db = this.db();
    const ref = dbDoc(db, input.accountId, input.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const now = new Date().toISOString();
    const updates: Record<string, unknown> = { updatedAtISO: now };
    if (input.name !== undefined) updates.name = input.name;
    if (input.description !== undefined) updates.description = input.description;
    if (input.icon !== undefined) updates.icon = input.icon;
    if (input.coverImageUrl !== undefined) updates.coverImageUrl = input.coverImageUrl;
    await updateDoc(ref, updates);
    return toDatabase(snap.id, { ...snap.data(), ...updates });
  }

  async addField(input: AddFieldInput): Promise<Database | null> {
    const db = this.db();
    const ref = dbDoc(db, input.accountId, input.databaseId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as Record<string, unknown>;
    const currentFields = Array.isArray(data.fields) ? data.fields as Record<string, unknown>[] : [];
    const newField: Field = {
      id: generateId(),
      name: input.field.name,
      type: input.field.type,
      config: input.field.config,
      required: input.field.required,
      order: currentFields.length,
    };
    const now = new Date().toISOString();
    await updateDoc(ref, { fields: arrayUnion(newField), updatedAtISO: now });
    return toDatabase(snap.id, { ...data, fields: [...currentFields, newField], updatedAtISO: now });
  }

  async archive(accountId: string, databaseId: string): Promise<void> {
    const db = this.db();
    const ref = dbDoc(db, accountId, databaseId);
    await updateDoc(ref, { archived: true, updatedAtISO: new Date().toISOString() });
  }

  async findById(accountId: string, databaseId: string): Promise<Database | null> {
    const db = this.db();
    const snap = await getDoc(dbDoc(db, accountId, databaseId));
    if (!snap.exists()) return null;
    return toDatabase(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByWorkspace(accountId: string, workspaceId: string): Promise<Database[]> {
    const db = this.db();
    const q = query(dbsCol(db, accountId), where("workspaceId", "==", workspaceId), where("archived", "==", false), orderBy("createdAtISO", "asc"));
    const snaps = await getDocs(q);
    return snaps.docs.map(d => toDatabase(d.id, d.data() as Record<string, unknown>));
  }
}
