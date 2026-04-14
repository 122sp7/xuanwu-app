/**
 * Module: notion/subdomains/knowledge-database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of DatabaseRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import { generateId } from "@shared-utils";
import type { DatabaseRepository, CreateDatabaseInput, UpdateDatabaseInput, AddFieldInput } from "../../../subdomains/knowledge-database/domain/repositories/DatabaseRepository";
import type { DatabaseSnapshot, Field } from "../../../subdomains/knowledge-database/domain/aggregates/Database";

function databasesPath(accountId: string): string {
  return `accounts/${accountId}/knowledgeDatabases`;
}

function databasePath(accountId: string, id: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${id}`;
}

function toISO(ts: unknown): string {
  if (typeof ts === "object" && ts !== null && "toDate" in ts && typeof (ts as { toDate: () => Date }).toDate === "function") {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
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

export class FirebaseDatabaseRepository implements DatabaseRepository {
  async create(input: CreateDatabaseInput): Promise<DatabaseSnapshot> {
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
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    await firestoreInfrastructureApi.set(databasePath(input.accountId, id), data);
    return toSnapshot(id, data);
  }

  async update(input: UpdateDatabaseInput): Promise<DatabaseSnapshot> {
    const path = databasePath(input.accountId, input.id);
    const existing = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!existing) {
      throw new Error(`Database ${input.id} not found`);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changes: Record<string, any> = { updatedAtISO: new Date().toISOString() };
    if (input.name !== undefined) changes.name = input.name;
    if (input.description !== undefined) changes.description = input.description;
    if (input.icon !== undefined) changes.icon = input.icon;
    if (input.coverImageUrl !== undefined) changes.coverImageUrl = input.coverImageUrl;
    await firestoreInfrastructureApi.update(path, changes);
    return toSnapshot(input.id, { ...existing, ...changes });
  }

  async addField(input: AddFieldInput): Promise<Field> {
    const path = databasePath(input.accountId, input.databaseId);
    const data = (await firestoreInfrastructureApi.get<Record<string, unknown>>(path)) ?? {};
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
    await firestoreInfrastructureApi.update(path, { fields, updatedAtISO: new Date().toISOString() });
    return newField;
  }

  async archive(id: string, accountId: string): Promise<void> {
    const now = new Date().toISOString();
    await firestoreInfrastructureApi.update(databasePath(accountId, id), {
      archived: true,
      archivedAtISO: now,
      updatedAtISO: now,
    });
  }

  async findById(id: string, accountId: string): Promise<DatabaseSnapshot | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(databasePath(accountId, id));
    if (!data) return null;
    return toSnapshot(id, data);
  }

  async listByWorkspace(accountId: string, workspaceId: string): Promise<DatabaseSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      databasesPath(accountId),
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    return docs
      .filter((d) => d.data.archived !== true)
      .map((d) => toSnapshot(d.id, d.data));
  }
}
