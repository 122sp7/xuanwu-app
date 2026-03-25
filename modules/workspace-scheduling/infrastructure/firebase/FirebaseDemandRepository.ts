import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";

import type { WorkDemand } from "../../domain/types";
import type { IDemandRepository } from "../../domain/repository";

const DEMANDS_COLLECTION = "workspacePlannerDemands";

function toWorkDemand(id: string, data: Record<string, unknown>): WorkDemand {
  const status = data.status;
  const priority = data.priority;

  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    accountId: typeof data.accountId === "string" ? data.accountId : "",
    requesterId: typeof data.requesterId === "string" ? data.requesterId : "",
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    status:
      status === "draft" || status === "open" || status === "in_progress" || status === "completed"
        ? status
        : "draft",
    priority: priority === "low" || priority === "medium" || priority === "high" ? priority : "medium",
    scheduledAt: typeof data.scheduledAt === "string" ? data.scheduledAt : "",
    assignedUserId: typeof data.assignedUserId === "string" ? data.assignedUserId : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseDemandRepository implements IDemandRepository {
  private readonly db = getFirestore(firebaseClientApp);

  private get collectionRef() {
    return collection(this.db, DEMANDS_COLLECTION);
  }

  async listByWorkspace(workspaceId: string): Promise<WorkDemand[]> {
    const snaps = await getDocs(
      query(this.collectionRef, where("workspaceId", "==", workspaceId)),
    );
    return snaps.docs
      .map((item) => toWorkDemand(item.id, item.data() as Record<string, unknown>))
      .sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async listByAccount(accountId: string): Promise<WorkDemand[]> {
    const snaps = await getDocs(
      query(this.collectionRef, where("accountId", "==", accountId)),
    );
    return snaps.docs
      .map((item) => toWorkDemand(item.id, item.data() as Record<string, unknown>))
      .sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async save(demand: WorkDemand): Promise<void> {
    const demandRef = doc(this.db, DEMANDS_COLLECTION, demand.id);
    const existing = await getDoc(demandRef);
    if (existing.exists()) {
      await this.update(demand);
      return;
    }

    await setDoc(demandRef, {
      workspaceId: demand.workspaceId,
      accountId: demand.accountId,
      requesterId: demand.requesterId,
      title: demand.title,
      description: demand.description,
      status: demand.status,
      priority: demand.priority,
      scheduledAt: demand.scheduledAt,
      assignedUserId: demand.assignedUserId ?? null,
      createdAtISO: demand.createdAtISO,
      updatedAtISO: demand.updatedAtISO,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  async update(demand: WorkDemand): Promise<void> {
    await setDoc(doc(this.db, DEMANDS_COLLECTION, demand.id), {
      workspaceId: demand.workspaceId,
      accountId: demand.accountId,
      requesterId: demand.requesterId,
      title: demand.title,
      description: demand.description,
      status: demand.status,
      priority: demand.priority,
      scheduledAt: demand.scheduledAt,
      assignedUserId: demand.assignedUserId ?? null,
      updatedAtISO: demand.updatedAtISO,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }

  async findById(id: string): Promise<WorkDemand | null> {
    const snap = await getDoc(doc(this.db, DEMANDS_COLLECTION, id));
    if (!snap.exists()) return null;
    return toWorkDemand(snap.id, snap.data() as Record<string, unknown>);
  }
}
