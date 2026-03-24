/**
 * @module workspace-flow/domain/entities
 * @file Task.ts
 * @description Task aggregate entity representing a work unit and its lifecycle.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Add domain validation methods as business rules expand
 */

import type { TaskStatus } from "../value-objects/TaskStatus";

// ── Aggregate ─────────────────────────────────────────────────────────────────

export interface Task {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TaskStatus;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly acceptedAtISO?: string;
  readonly archivedAtISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

// ── Inputs ────────────────────────────────────────────────────────────────────

export interface CreateTaskInput {
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
