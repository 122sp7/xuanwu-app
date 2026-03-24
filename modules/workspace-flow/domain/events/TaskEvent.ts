/**
 * @module workspace-flow/domain/events
 * @file TaskEvent.ts
 * @description Discriminated-union event types emitted by the Task aggregate.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Wire to event bus via @/modules/event IEventBusRepository
 */

import type { TaskStatus } from "../value-objects/TaskStatus";

// ── Individual event shapes ───────────────────────────────────────────────────

export interface TaskCreatedEvent {
  readonly type: "workspace-flow.task.created";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly occurredAtISO: string;
}

export interface TaskAssignedEvent {
  readonly type: "workspace-flow.task.assigned";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly assigneeId: string;
  readonly occurredAtISO: string;
}

export interface TaskSubmittedToQaEvent {
  readonly type: "workspace-flow.task.submitted_to_qa";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface TaskQaPassedEvent {
  readonly type: "workspace-flow.task.qa_passed";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly occurredAtISO: string;
}

export interface TaskAcceptanceApprovedEvent {
  readonly type: "workspace-flow.task.acceptance_approved";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly acceptedAtISO: string;
  readonly occurredAtISO: string;
}

export interface TaskArchivedEvent {
  readonly type: "workspace-flow.task.archived";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly archivedAtISO: string;
  readonly occurredAtISO: string;
}

export interface TaskStatusChangedEvent {
  readonly type: "workspace-flow.task.status_changed";
  readonly taskId: string;
  readonly workspaceId: string;
  readonly from: TaskStatus;
  readonly to: TaskStatus;
  readonly occurredAtISO: string;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type TaskEvent =
  | TaskCreatedEvent
  | TaskAssignedEvent
  | TaskSubmittedToQaEvent
  | TaskQaPassedEvent
  | TaskAcceptanceApprovedEvent
  | TaskArchivedEvent
  | TaskStatusChangedEvent;
