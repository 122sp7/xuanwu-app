/**
 * Module: task
 * Layer: domain/entity
 * Purpose: Canonical TaskEntity aggregate — the single source of truth for a task.
 *
 * The old WorkspaceTaskEntity (pending/in-progress/completed) is removed.
 * Use TaskLifecycleStatus (from value-objects/task-state) throughout.
 *
 * Multi-tenant: every task is scoped to tenantId + teamId + workspaceId.
 * Regressions are handled via the Issue domain — Task status is forward-only.
 */

import type { TaskLifecycleStatus } from "../value-objects/task-state";

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface TaskEntity {
  readonly id: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskLifecycleStatus;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  /** Populated when status transitions to "accepted". */
  readonly acceptedAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateTaskInput {
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}

export interface UpdateTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
