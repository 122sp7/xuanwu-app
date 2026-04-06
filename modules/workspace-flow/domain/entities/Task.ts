/**
 * @module workspace-flow/domain/entities
 * @file Task.ts
 * @description Task aggregate entity representing a work unit and its lifecycle.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add domain validation methods as business rules expand
 */

import type { TaskStatus } from "../value-objects/TaskStatus";
import type { SourceReference } from "../value-objects/SourceReference";

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
  /**
   * Present when this Task was materialized from a KnowledgePage via the
   * `content.page_approved` event.  Provides full provenance traceability.
   */
  readonly sourceReference?: SourceReference;
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
  readonly sourceReference?: SourceReference;
}

export interface UpdateTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
