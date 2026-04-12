/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseTaskRepository.ts
 * @description Firebase Firestore implementation of TaskRepository for workspace-flow.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  firestoreInfrastructureApi,
} from "@/modules/platform/api";
import { v7 as generateId } from "@lib-uuid";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { TASK_STATUSES, type TaskStatus } from "../../domain/value-objects/TaskStatus";
import { toTask } from "../firebase/task.converter";
import { WF_TASKS_COLLECTION } from "../firebase/workspace-flow.collections";

const VALID_STATUSES = new Set<TaskStatus>(TASK_STATUSES);
const DEFAULT_STATUS: TaskStatus = "draft";

export class FirebaseTaskRepository implements TaskRepository {
  private taskPath(taskId: string): string {
    return `${WF_TASKS_COLLECTION}/${taskId}`;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const nowISO = new Date().toISOString();
    const docData: Record<string, unknown> = {
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      assigneeId: input.assigneeId ?? null,
      dueDateISO: input.dueDateISO ?? null,
      acceptedAtISO: null,
      archivedAtISO: null,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
    if (input.sourceReference) {
      docData.sourceReference = { ...input.sourceReference };
    }

    const taskId = generateId();
    await firestoreInfrastructureApi.set(this.taskPath(taskId), docData);

    return {
      id: taskId,
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      assigneeId: input.assigneeId,
      dueDateISO: input.dueDateISO,
      sourceReference: input.sourceReference,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async update(taskId: string, input: UpdateTaskInput): Promise<Task | null> {
    const path = this.taskPath(taskId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const patch: Record<string, unknown> = {
      updatedAtISO: new Date().toISOString(),
    };
    if (typeof input.title === "string") patch.title = input.title;
    if (typeof input.description === "string") patch.description = input.description;
    if (typeof input.assigneeId === "string") patch.assigneeId = input.assigneeId;
    if (typeof input.dueDateISO === "string") patch.dueDateISO = input.dueDateISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toTask(taskId, updated);
  }

  async delete(taskId: string): Promise<void> {
    await firestoreInfrastructureApi.delete(this.taskPath(taskId));
  }

  async findById(taskId: string): Promise<Task | null> {
    const data = await firestoreInfrastructureApi.get<Record<string, unknown>>(this.taskPath(taskId));
    if (!data) return null;
    return toTask(taskId, data);
  }

  async findByWorkspaceId(workspaceId: string): Promise<Task[]> {
    const docs = await firestoreInfrastructureApi.queryDocuments<Record<string, unknown>>(
      WF_TASKS_COLLECTION,
      [{ field: "workspaceId", op: "==", value: workspaceId }],
    );
    const tasks = docs.map((d) => toTask(d.id, d.data));
    return tasks.sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async transitionStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<Task | null> {
    const path = this.taskPath(taskId);
    const snap = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!snap) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
    };
    if (validTo === "accepted") patch.acceptedAtISO = nowISO;
    if (validTo === "archived") patch.archivedAtISO = nowISO;

    await firestoreInfrastructureApi.update(path, patch);
    const updated = await firestoreInfrastructureApi.get<Record<string, unknown>>(path);
    if (!updated) return null;
    return toTask(taskId, updated);
  }
}
 
