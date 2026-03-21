/**
 * @package task-core
 * Task domain — pure types, entity contracts, and repository ports.
 *
 * This package IS the source of truth for task domain contracts.
 * No re-exports from modules/. All types defined here directly.
 *
 * Dependency rule: Zero external dependencies.
 * This package depends only on TypeScript built-ins — no @shared-types,
 * no Firebase, no framework code. Use-case orchestration and CommandResult
 * live in @task-service, which depends on both @task-core and @shared-types.
 *
 * Usage:
 *   import type { WorkspaceTaskEntity, TaskRepository } from "@task-core";
 */

// ── Value types ───────────────────────────────────────────────────────────

export type WorkspaceTaskStatus = "pending" | "in-progress" | "completed";
export type WorkspaceTaskPriority = "low" | "medium" | "high";

// ── Entity ────────────────────────────────────────────────────────────────

export interface WorkspaceTaskEntity {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: WorkspaceTaskStatus;
  readonly priority: WorkspaceTaskPriority;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Input contracts ───────────────────────────────────────────────────────

export interface CreateWorkspaceTaskInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly priority?: WorkspaceTaskPriority;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}

export interface UpdateWorkspaceTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly status?: WorkspaceTaskStatus;
  readonly priority?: WorkspaceTaskPriority;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}

// ── Repository port ───────────────────────────────────────────────────────

export interface TaskRepository {
  create(input: CreateWorkspaceTaskInput): Promise<WorkspaceTaskEntity>;
  update(taskId: string, input: UpdateWorkspaceTaskInput): Promise<WorkspaceTaskEntity | null>;
  delete(taskId: string): Promise<void>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceTaskEntity[]>;
}
