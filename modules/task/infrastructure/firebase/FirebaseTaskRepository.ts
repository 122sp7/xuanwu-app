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
import type {
  CreateWorkspaceTaskInput,
  UpdateWorkspaceTaskInput,
  WorkspaceTaskEntity,
  WorkspaceTaskPriority,
  WorkspaceTaskStatus,
} from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";

const VALID_STATUSES = new Set<WorkspaceTaskStatus>(["pending", "in-progress", "completed"]);
const VALID_PRIORITIES = new Set<WorkspaceTaskPriority>(["low", "medium", "high"]);
const DEFAULT_TASK_STATUS: WorkspaceTaskStatus = "pending";
const DEFAULT_TASK_PRIORITY: WorkspaceTaskPriority = "medium";
const DEFAULT_TASK_DESCRIPTION = "";

function toTaskEntity(id: string, data: Record<string, unknown>): WorkspaceTaskEntity {
  const status = VALID_STATUSES.has(data.status as WorkspaceTaskStatus)
    ? (data.status as WorkspaceTaskStatus)
    : DEFAULT_TASK_STATUS;
  const priority = VALID_PRIORITIES.has(data.priority as WorkspaceTaskPriority)
    ? (data.priority as WorkspaceTaskPriority)
    : DEFAULT_TASK_PRIORITY;

  return {
    id,
    workspaceId: typeof data.workspaceId === "string" ? data.workspaceId : "",
    title: typeof data.title === "string" ? data.title : "",
    description:
      typeof data.description === "string" ? data.description : DEFAULT_TASK_DESCRIPTION,
    status,
    priority,
    assigneeId: typeof data.assigneeId === "string" ? data.assigneeId : undefined,
    dueDateISO: typeof data.dueDateISO === "string" ? data.dueDateISO : undefined,
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

  async create(input: CreateWorkspaceTaskInput): Promise<WorkspaceTaskEntity> {
    const nowIso = new Date().toISOString();
    const docRef = await addDoc(this.collectionRef, {
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? DEFAULT_TASK_DESCRIPTION,
      status: DEFAULT_TASK_STATUS,
      priority: input.priority ?? DEFAULT_TASK_PRIORITY,
      assigneeId: input.assigneeId ?? null,
      dueDateISO: input.dueDateISO ?? null,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? DEFAULT_TASK_DESCRIPTION,
      status: DEFAULT_TASK_STATUS,
      priority: input.priority ?? DEFAULT_TASK_PRIORITY,
      assigneeId: input.assigneeId,
      dueDateISO: input.dueDateISO,
      createdAtISO: nowIso,
      updatedAtISO: nowIso,
    };
  }

  async update(taskId: string, input: UpdateWorkspaceTaskInput): Promise<WorkspaceTaskEntity | null> {
    const taskRef = doc(this.db, "workspaceTasks", taskId);
    const existingTask = await getDoc(taskRef);
    if (!existingTask.exists()) {
      return null;
    }

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };

    if (typeof input.title === "string") {
      patch.title = input.title;
    }
    if (typeof input.description === "string") {
      patch.description = input.description;
    }
    if (typeof input.status === "string" && VALID_STATUSES.has(input.status)) {
      patch.status = input.status;
    }
    if (typeof input.priority === "string" && VALID_PRIORITIES.has(input.priority)) {
      patch.priority = input.priority;
    }
    if (typeof input.assigneeId === "string") {
      patch.assigneeId = input.assigneeId;
    }
    if (typeof input.dueDateISO === "string") {
      patch.dueDateISO = input.dueDateISO;
    }

    await updateDoc(taskRef, patch);
    const updatedTask = await getDoc(taskRef);
    if (!updatedTask.exists()) {
      return null;
    }

    return toTaskEntity(updatedTask.id, updatedTask.data() as Record<string, unknown>);
  }

  async delete(taskId: string): Promise<void> {
    await deleteDoc(doc(this.db, "workspaceTasks", taskId));
  }

  async findByWorkspaceId(workspaceId: string): Promise<WorkspaceTaskEntity[]> {
    const snaps = await getDocs(
      query(this.collectionRef, where("workspaceId", "==", workspaceId), orderBy("updatedAtISO", "desc")),
    );

    return snaps.docs.map((taskDoc) =>
      toTaskEntity(taskDoc.id, taskDoc.data() as Record<string, unknown>),
    );
  }
}
