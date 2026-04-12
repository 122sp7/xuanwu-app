/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of IViewRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}/views/{viewId}
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { IViewRepository, CreateViewInput, UpdateViewInput } from "../../domain/repositories/IViewRepository";
import type { ViewSnapshot } from "../../domain/aggregates/View";

function viewsPath(accountId: string, databaseId: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/views`;
}

function viewPath(accountId: string, databaseId: string, id: string): string {
  return `accounts/${accountId}/knowledgeDatabases/${databaseId}/views/${id}`;
}

function toISO(ts: unknown): string {
  if (typeof ts === "object" && ts !== null && "toDate" in ts && typeof (ts as { toDate: () => Date }).toDate === "function") {
    return (ts as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof ts === "string") return ts;
  return new Date().toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toSnapshot(id: string, data: Record<string, any>): ViewSnapshot {
  return {
    id,
    databaseId: data.databaseId ?? "",
    workspaceId: data.workspaceId ?? "",
    accountId: data.accountId ?? "",
    name: data.name ?? "",
    type: data.type ?? "table",
    filters: Array.isArray(data.filters) ? data.filters : [],
    sorts: Array.isArray(data.sorts) ? data.sorts : [],
    groupBy: data.groupBy ?? null,
    visibleFieldIds: Array.isArray(data.visibleFieldIds) ? data.visibleFieldIds : [],
    hiddenFieldIds: Array.isArray(data.hiddenFieldIds) ? data.hiddenFieldIds : [],
    boardGroupFieldId: data.boardGroupFieldId ?? null,
    calendarDateFieldId: data.calendarDateFieldId ?? null,
    timelineStartFieldId: data.timelineStartFieldId ?? null,
    timelineEndFieldId: data.timelineEndFieldId ?? null,
    createdByUserId: data.createdByUserId ?? "",
    createdAtISO: toISO(data.createdAt),
    updatedAtISO: toISO(data.updatedAt),
  };
}

export class FirebaseViewRepository implements IViewRepository {
  async create(input: CreateViewInput): Promise<ViewSnapshot> {
    const id = generateId();
    const now = new Date().toISOString();
    const data = {
      databaseId: input.databaseId,
      workspaceId: input.workspaceId,
      accountId: input.accountId,
      name: input.name,
      type: input.type,
      filters: [],
      sorts: [],
      groupBy: null,
      visibleFieldIds: [],
      hiddenFieldIds: [],
      boardGroupFieldId: null,
      calendarDateFieldId: null,
      timelineStartFieldId: null,
      timelineEndFieldId: null,
      createdByUserId: input.createdByUserId,
      createdAtISO: now,
      updatedAtISO: now,
    };
    await firestoreInfrastructureApi.set(viewPath(input.accountId, input.databaseId, id), data);
    return toSnapshot(id, data);
  }

  async update(input: UpdateViewInput): Promise<ViewSnapshot> {
    const docs = await firestoreInfrastructureApi.queryCollectionGroup<Record<string, unknown>>(
      "views",
      [{ field: "accountId", op: "==", value: input.accountId }],
    );
    const target = docs.find((d) => d.id === input.id);
    if (!target) {
      throw new Error(`View ${input.id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changes: Record<string, any> = { updatedAtISO: new Date().toISOString() };
    if (input.name !== undefined) changes.name = input.name;
    if (input.filters !== undefined) changes.filters = input.filters;
    if (input.sorts !== undefined) changes.sorts = input.sorts;
    if (input.visibleFieldIds !== undefined) changes.visibleFieldIds = input.visibleFieldIds;
    if (input.hiddenFieldIds !== undefined) changes.hiddenFieldIds = input.hiddenFieldIds;
    await firestoreInfrastructureApi.update(target.path, changes);
    const refreshed = await firestoreInfrastructureApi.get<Record<string, unknown>>(target.path);
    if (!refreshed) {
      throw new Error(`View ${input.id} not found after update`);
    }
    return toSnapshot(input.id, refreshed);
  }

  async delete(id: string, accountId: string): Promise<void> {
    const docs = await firestoreInfrastructureApi.queryCollectionGroup<Record<string, unknown>>(
      "views",
      [{ field: "accountId", op: "==", value: accountId }],
    );
    const target = docs.find((d) => d.id === id);
    if (target) {
      await firestoreInfrastructureApi.delete(target.path);
    }
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<ViewSnapshot[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      viewsPath(accountId, databaseId),
    );
    return docs.map((d) => toSnapshot(d.id, d.data));
  }
}
