/**
 * Module: notion/subdomains/database
 * Layer: infrastructure/firebase
 * Purpose: Firestore implementation of IViewRepository.
 *          Firestore path: accounts/{accountId}/knowledgeDatabases/{databaseId}/views/{viewId}
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
import { db } from "@integration-firebase/firestore";
import type { IViewRepository, CreateViewInput, UpdateViewInput } from "../../domain/repositories/IViewRepository";
import type { ViewSnapshot } from "../../domain/aggregates/View";

function viewsCol(accountId: string, databaseId: string) {
  return collection(db, "accounts", accountId, "knowledgeDatabases", databaseId, "views");
}

function viewDoc(accountId: string, databaseId: string, id: string) {
  return doc(db, "accounts", accountId, "knowledgeDatabases", databaseId, "views", id);
}

function toISO(ts: unknown): string {
  if (ts instanceof Timestamp) return ts.toDate().toISOString();
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
    const col = viewsCol(input.accountId, input.databaseId);
    const now = serverTimestamp();
    const docRef = await addDoc(col, {
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
      createdAt: now,
      updatedAt: now,
    });
    const snap = await getDoc(docRef);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(docRef.id, snap.data() as Record<string, any>);
  }

  async update(input: UpdateViewInput): Promise<ViewSnapshot> {
    // Fetch databaseId via collection group since we only have id+accountId
    const { collectionGroup, query: fsQuery, where, getDocs: fsGetDocs } = await import("firebase/firestore");
    const q = fsQuery(collectionGroup(db, "views"), where("accountId", "==", input.accountId));
    const results = await fsGetDocs(q);
    const target = results.docs.find((d) => d.id === input.id);
    if (!target) throw new Error(`View ${input.id} not found`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const changes: Record<string, any> = { updatedAt: serverTimestamp() };
    if (input.name !== undefined) changes.name = input.name;
    if (input.filters !== undefined) changes.filters = input.filters;
    if (input.sorts !== undefined) changes.sorts = input.sorts;
    if (input.visibleFieldIds !== undefined) changes.visibleFieldIds = input.visibleFieldIds;
    if (input.hiddenFieldIds !== undefined) changes.hiddenFieldIds = input.hiddenFieldIds;
    await updateDoc(target.ref, changes);
    const refreshed = await getDoc(target.ref);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return toSnapshot(input.id, refreshed.data() as Record<string, any>);
  }

  async delete(id: string, accountId: string): Promise<void> {
    const { collectionGroup, query: fsQuery, where, getDocs: fsGetDocs } = await import("firebase/firestore");
    const q = fsQuery(collectionGroup(db, "views"), where("accountId", "==", accountId));
    const results = await fsGetDocs(q);
    const target = results.docs.find((d) => d.id === id);
    if (target) await deleteDoc(target.ref);
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<ViewSnapshot[]> {
    const snaps = await getDocs(viewsCol(accountId, databaseId));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return snaps.docs.map((d) => toSnapshot(d.id, d.data() as Record<string, any>));
  }
}
