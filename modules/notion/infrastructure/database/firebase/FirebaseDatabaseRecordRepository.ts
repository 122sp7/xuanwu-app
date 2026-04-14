/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of DatabaseRecordRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}/records/{recordId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api/infrastructure";
import { v7 as generateId } from "@lib-uuid";
import type { DatabaseRecordRepository, CreateRecordInput, UpdateRecordInput } from "../../../subdomains/database/domain/repositories/DatabaseRecordRepository";
import type { DatabaseRecordSnapshot } from "../../../subdomains/database/domain/aggregates/DatabaseRecord";

function recordsPath(accountId: string, databaseId: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/records`;
}

function recordPath(accountId: string, databaseId: string, recordId: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/records/${recordId}`;
}

function toISO(ts: unknown): string {
  if (typeof ts === "object" && ts !== null && "toDate" in ts && typeof (ts as { toDate: () => Date }).toDate === "function") {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
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

export class FirebaseDatabaseRecordRepository implements DatabaseRecordRepository {
  async create(input: CreateRecordInput): Promise<DatabaseRecordSnapshot> {
    const id = generateId();
    const countDocs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      recordsPath(input.accountId, input.databaseId),
    );
    const now = new Date().toISOString();
    const data = {
      databaseId: input.databaseId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      pageId: input.pageId ?? null,
      properties: input.properties ?? {},
      order: countDocs.length,
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    await firestoreInfrastructureApi.set(recordPath(input.accountId, input.databaseId, id), data);
    return toSnapshot(id, data);
  }

  async update(input: UpdateRecordInput): Promise<DatabaseRecordSnapshot> {
    // We need to find which database this record belongs to. Properties are keyed by field IDs.
    // The record stores databaseId on the document; we fetch it via a collection-group query approach.
    // For simplicity, the input should come from a context where databaseId is available.
    // Here we use a direct path by reading the doc first from a stored databaseId lookup.
    // Since the record doc lives in accounts/{accountId}/knowledgeDatabases/{databaseId}/records/{id},
    // and we only have id+accountId, we do collection group query.
    const { id, accountId, properties } = input;
    const docs = await firestoreInfrastructureApi.queryCollectionGroup<Record<string, unknown>>(
      "records",
      [{ field: "accountId", op: "==", value: accountId }],
    );
    const target = docs.find((d) => d.id === id);
    if (!target) throw new Error(`Record ${id} not found`);
    await firestoreInfrastructureApi.update(target.path, { properties, updatedAtISO: new Date().toISOString() });
    const refreshed = await firestoreInfrastructureApi.get<Record<string, unknown>>(target.path);
    if (!refreshed) {
      throw new Error(`Record ${id} not found after update`);
    }
    return toSnapshot(id, refreshed);
  }

  async delete(id: string, accountId: string): Promise<void> {
    const docs = await firestoreInfrastructureApi.queryCollectionGroup<Record<string, unknown>>(
      "records",
      [{ field: "accountId", op: "==", value: accountId }],
    );
    const target = docs.find((d) => d.id === id);
    if (target) {
      await firestoreInfrastructureApi.delete(target.path);
    }
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<DatabaseRecordSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      recordsPath(accountId, databaseId),
    );
    return docs.map((d) => toSnapshot(d.id, d.data));
  }
}
