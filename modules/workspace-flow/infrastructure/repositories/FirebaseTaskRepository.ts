/**
 * @module workspace-flow/infrastructure/repositories
 * @file FirebaseTaskRepository.ts
 * @description Firebase Firestore implementation of TaskRepository for workspace-flow.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add query pagination support and composite indexes
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firebaseClientApp } from "@integration-firebase/client";
import type { Task, CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { TASK_STATUSES, type TaskStatus } from "../../domain/value-objects/TaskStatus";
import { toTask } from "../firebase/task.converter";
import { WF_TASKS_COLLECTION } from "../firebase/workspace-flow.collections";

const VALID_STATUSES = new Set<TaskStatus>(TASK_STATUSES);
const DEFAULT_STATUS: TaskStatus = "draft";

export class FirebaseTaskRepository implements TaskRepository {
  private get db() {
    return getFirestore(firebaseClientApp);
  }

  private get collectionRef() {
    return collection(this.db, WF_TASKS_COLLECTION);
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const nowISO = new Date().toISOString();
    const docRef = await addDoc(this.collectionRef, {
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return {
      id: docRef.id,
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description ?? "",
      status: DEFAULT_STATUS,
      assigneeId: input.assigneeId,
      dueDateISO: input.dueDateISO,
      createdAtISO: nowISO,
      updatedAtISO: nowISO,
    };
  }

  async update(taskId: string, input: UpdateTaskInput): Promise<Task | null> {
    const taskRef = doc(this.db, WF_TASKS_COLLECTION, taskId);
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
    return toTask(updated.id, updated.data() as Record<string, unknown>);
  }

  async delete(taskId: string): Promise<void> {
    await deleteDoc(doc(this.db, WF_TASKS_COLLECTION, taskId));
  }

  async findById(taskId: string): Promise<Task | null> {
    const snap = await getDoc(doc(this.db, WF_TASKS_COLLECTION, taskId));
    if (!snap.exists()) return null;
    return toTask(snap.id, snap.data() as Record<string, unknown>);
  }

  async findByWorkspaceId(workspaceId: string): Promise<Task[]> {
    const snaps = await getDocs(
      query(
        this.collectionRef,
        where("workspaceId", "==", workspaceId),
      ),
    );
    const tasks = snaps.docs.map((d) => toTask(d.id, d.data() as Record<string, unknown>));
    return tasks.sort((a, b) => b.updatedAtISO.localeCompare(a.updatedAtISO));
  }

  async transitionStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<Task | null> {
    const taskRef = doc(this.db, WF_TASKS_COLLECTION, taskId);
    const snap = await getDoc(taskRef);
    if (!snap.exists()) return null;

    const validTo = VALID_STATUSES.has(to) ? to : DEFAULT_STATUS;
    const patch: Record<string, unknown> = {
      status: validTo,
      updatedAtISO: nowISO,
      updatedAt: serverTimestamp(),
    };
    if (validTo === "accepted") patch.acceptedAtISO = nowISO;
    if (validTo === "archived") patch.archivedAtISO = nowISO;

    await updateDoc(taskRef, patch);
    const updated = await getDoc(taskRef);
    if (!updated.exists()) return null;
    return toTask(updated.id, updated.data() as Record<string, unknown>);
  }
}
