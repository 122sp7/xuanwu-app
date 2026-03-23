/**
 * Module: task
 * Layer: domain/event
 * Purpose: Discriminated-union event types emitted by the Task aggregate.
 *
 * All events carry tenantId + teamId for multi-tenant routing and audit.
 * Consumers publish via @/modules/event IEventBusRepository.
 *
 * Event flow sketch:
 *   TaskCreated → TaskAssigned → TaskStatusChanged(→qa) → TaskStatusChanged(→acceptance)
 *     → TaskAccepted → TaskArchived
 *
 * Issue-related regression is handled by IssueDomainEvent in modules/issue.
 */

import type { TaskLifecycleStatus } from "../value-objects/task-state";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface TaskCreatedEvent {
  readonly type: "task.created";
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly occurredAtISO: string;
}

export interface TaskUpdatedEvent {
  readonly type: "task.updated";
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface TaskAssignedEvent {
  readonly type: "task.assigned";
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly assigneeId: string;
  readonly occurredAtISO: string;
}

export interface TaskStatusChangedEvent {
  readonly type: "task.status_changed";
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly from: TaskLifecycleStatus;
  readonly to: TaskLifecycleStatus;
  readonly occurredAtISO: string;
}

export interface TaskAcceptedEvent {
  readonly type: "task.accepted";
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  /** ISO-8601 timestamp recorded as official acceptance time. */
  readonly acceptedAtISO: string;
  readonly occurredAtISO: string;
}

export interface TaskArchivedEvent {
  readonly type: "task.archived";
  readonly taskId: string;
  readonly tenantId: string;
  readonly teamId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type TaskDomainEvent =
  | TaskCreatedEvent
  | TaskUpdatedEvent
  | TaskAssignedEvent
  | TaskStatusChangedEvent
  | TaskAcceptedEvent
  | TaskArchivedEvent;
