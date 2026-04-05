/**
 * Module: knowledge-database
 * Layer: infrastructure/firebase
 * Firestore: accounts/{accountId}/databaseViews/{viewId}
 */

import {
  collection, deleteDoc, doc, getDoc, getDocs, getFirestore,
  orderBy, query, serverTimestamp, setDoc, updateDoc, where,
} from "firebase/firestore";
import { firebaseClientApp } from "@integration-firebase/client";
import { v7 as generateId } from "@lib-uuid";
import type { View, FilterRule, SortRule } from "../../domain/entities/view.entity";
import type {
  IViewRepository,
  CreateViewInput,
  UpdateViewInput,
} from "../../domain/repositories/IViewRepository";

function viewsCol(db: ReturnType<typeof getFirestore>, accountId: string) {
  return collection(db, "accounts", accountId, "databaseViews");
}

function viewDoc(db: ReturnType<typeof getFirestore>, accountId: string, viewId: string) {
  return doc(db, "accounts", accountId, "databaseViews", viewId);
}

function toView(id: string, data: Record<string, unknown>): View {
  return {
    id,
    databaseId: typeof data.databaseId === "string" ? data.databaseId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    name: typeof data.name === "string" ? data.name : "",
    type: (data.type as View["type"]) ?? "table",
    filters: Array.isArray(data.filters) ? (data.filters as FilterRule[]) : [],
    sorts: Array.isArray(data.sorts) ? (data.sorts as SortRule[]) : [],
    groupBy: typeof data.groupBy === "object" && data.groupBy !== null
      ? (data.groupBy as View["groupBy"])
      : null,
    visibleFieldIds: Array.isArray(data.visibleFieldIds)
      ? (data.visibleFieldIds as unknown[]).filter((v): v is string => typeof v === "string")
      : [],
    hiddenFieldIds: Array.isArray(data.hiddenFieldIds)
      ? (data.hiddenFieldIds as unknown[]).filter((v): v is string => typeof v === "string")
      : [],
    boardGroupFieldId: typeof data.boardGroupFieldId === "string" ? data.boardGroupFieldId : null,
    calendarDateFieldId: typeof data.calendarDateFieldId === "string" ? data.calendarDateFieldId : null,
    timelineStartFieldId: typeof data.timelineStartFieldId === "string" ? data.timelineStartFieldId : null,
    timelineEndFieldId: typeof data.timelineEndFieldId === "string" ? data.timelineEndFieldId : null,
    createdByUserId: typeof data.createdByUserId === "string" ? data.createdByUserId : "",
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseViewRepository implements IViewRepository {
  private db() { return getFirestore(firebaseClientApp); }

  async create(input: CreateViewInput): Promise<View> {
    const db = this.db();
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
      _createdAt: serverTimestamp(),
    };
    await setDoc(viewDoc(db, input.accountId, id), data);
    return toView(id, data);
  }

  async update(input: UpdateViewInput): Promise<View | null> {
    const db = this.db();
    const ref = viewDoc(db, input.accountId, input.id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const now = new Date().toISOString();
    const updates: Record<string, unknown> = { updatedAtISO: now };
    if (input.name !== undefined) updates.name = input.name;
    if (input.filters !== undefined) updates.filters = input.filters;
    if (input.sorts !== undefined) updates.sorts = input.sorts;
    if (input.groupBy !== undefined) updates.groupBy = input.groupBy;
    if (input.visibleFieldIds !== undefined) updates.visibleFieldIds = input.visibleFieldIds;
    if (input.hiddenFieldIds !== undefined) updates.hiddenFieldIds = input.hiddenFieldIds;
    await updateDoc(ref, updates);
    return toView(snap.id, { ...snap.data() as Record<string, unknown>, ...updates });
  }

  async delete(accountId: string, viewId: string): Promise<void> {
    const db = this.db();
    await deleteDoc(viewDoc(db, accountId, viewId));
  }

  async findById(accountId: string, viewId: string): Promise<View | null> {
    const db = this.db();
    const snap = await getDoc(viewDoc(db, accountId, viewId));
    if (!snap.exists()) return null;
    return toView(snap.id, snap.data() as Record<string, unknown>);
  }

  async listByDatabase(accountId: string, databaseId: string): Promise<View[]> {
    const db = this.db();
    const q = query(
      viewsCol(db, accountId),
      where("databaseId", "==", databaseId),
      orderBy("createdAtISO", "asc"),
    );
    const snaps = await getDocs(q);
    return snaps.docs.map(d => toView(d.id, d.data() as Record<string, unknown>));
  }
}
