/**
 * @module workspace-flow/domain/repositories
 * @file TaskRepository.ts
 * @description Repository port interface for Task persistence.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Implement in infrastructure/repositories/FirebaseTaskRepository
 */

import type { Task, CreateTaskInput, UpdateTaskInput } from "../entities/Task";
import type { TaskStatus } from "../value-objects/TaskStatus";

export interface TaskRepository {
  /** Persist a new task and return the created aggregate. */
  create(input: CreateTaskInput): Promise<Task>;
  /** Update mutable fields on an existing task. Returns null if not found. */
  update(taskId: string, input: UpdateTaskInput): Promise<Task | null>;
  /** Hard-delete a task by id. */
  delete(taskId: string): Promise<void>;
  /** Retrieve a task by its id. Returns null if not found. */
  findById(taskId: string): Promise<Task | null>;
  /** List all tasks belonging to a workspace, ordered by updatedAtISO desc. */
  findByWorkspaceId(workspaceId: string): Promise<Task[]>;
  /** Persist a lifecycle status transition and stamp acceptedAtISO / archivedAtISO as appropriate. */
  transitionStatus(taskId: string, to: TaskStatus, nowISO: string): Promise<Task | null>;
}
 
