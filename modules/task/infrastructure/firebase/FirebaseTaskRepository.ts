import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import type { TaskEntity, CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { TASK_LIFECYCLE_STATUSES, type TaskLifecycleStatus } from "../../domain/value-objects/task-state";

const VALID_STATUSES = new Set<TaskLifecycleStatus>(TASK_LIFECYCLE_STATUSES);
const DEFAULT_STATUS: TaskLifecycleStatus = "draft";

function toTaskEntity(id: string, data: Record<string, unknown>): TaskEntity {
  const rawStatus = data.status as TaskLifecycleStatus;
  return {
    id,
    tenantId: typeof data.tenantId === "string" ? data.tenantId : "",
    teamId: typeof data.teamId === "string" ? data.teamId : "",
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    status: VALID_STATUSES.has(rawStatus) ? rawStatus : DEFAULT_STATUS,
    assigneeId: typeof data.assigneeId === "string" ? data.assigneeId : undefined,
    dueDateISO: typeof data.dueDateISO === "string" ? data.dueDateISO : undefined,
    acceptedAtISO: typeof data.acceptedAtISO === "string" ? data.acceptedAtISO : undefined,
    createdAtISO: typeof data.createdAtISO === "string" ? data.createdAtISO : "",
    updatedAtISO: typeof data.updatedAtISO === "string" ? data.updatedAtISO : "",
  };
}

export class FirebaseTaskRepository implements TaskRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  private get collectionRef() {
    return collection(this.db, "workspaceTasks");
  }

  async create(input: CreateTaskInput): Promise<TaskEntity> {
    const nowIso = new Date().toISOString();
    const docRef = await addDoc(this.collectionRef, {
      tenantId: input.tenantId,
      teamId: input.teamId,
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      assigneeId: input.assigneeId ?? null,
      dueDateISO: input.dueDateISO ?? null,
      acceptedAtISO: null,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      tenantId: input.tenantId,
      teamId: input.teamId,
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      assigneeId: input.assigneeId,
      dueDateISO: input.dueDateISO,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
    };
  }

  async update(taskId: string, input: UpdateTaskInput): Promise<TaskEntity | null> {
    const taskRef = doc(this.db, "workspaceTasks", taskId);
    const snap = await getDoc(taskRef);
    if (!snap.exists()) return null;

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };
    if (typeof input.title === "string") patch.title = input.title;
    if (typeof input.description === "string") patch.description = input.description;
    if (typeof input.assigneeId === "string") patch.assigneeId = input.assigneeId;
    if (typeof input.dueDateISO === "string") patch.dueDateISO = input.dueDateISO;

    await updateDoc(taskRef, patch);
    const updated = await getDoc(taskRef);
    if (!updated.exists()) return null;
    return toTaskEntity(updated.id, updated.data() as Record<string, unknown>);
  }

  async delete(taskId: string): Promise<void> {
    await deleteDoc(doc(this.db, "workspaceTasks", taskId));
  }

  async findById(taskId: string): Promise<TaskEntity | null> {
    const snap = await getDoc(doc(this.db, "workspaceTasks", taskId));
    if (!snap.exists()) return null;
    return toTaskEntity(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByWorkspaceId(workspaceId: string): Promise<TaskEntity[]> {
    const snaps = await getDocs(
      query(
        this.collectionRef,
        where("workspaceId", "==", workspaceId),
        orderBy("updatedAtISO", "desc"),
      ),
    );
    return snaps.docs.map((d) => toTaskEntity(d.id, d.data() as Record<string, unknown>));
  }

  async transitionStatus(
    taskId: string,
    to: TaskLifecycleStatus,
    nowISO: string,
  ): Promise<TaskEntity | null> {
    const taskRef = doc(this.db, "workspaceTasks", taskId);
    const snap = await getDoc(taskRef);
    if (!snap.exists()) return null;

    const patch: Record<string, unknown> = {
      status: to,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    };
    if (to === "accepted") patch.acceptedAtISO = nowISO;

    await updateDoc(taskRef, patch);
    const updated = await getDoc(taskRef);
    if (!updated.exists()) return null;
    return toTaskEntity(updated.id, updated.data() as Record<string, unknown>);
  }
}
