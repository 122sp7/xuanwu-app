/**
 * Module: task
 * Layer: api/barrel
 * Purpose: Public cross-module API boundary for the Task domain.
 *
 * Other modules MUST import from here — never from domain/, application/,
 * infrastructure/, or interfaces/ directly.
 */

// ─── Core entity types ────────────────────────────────────────────────────────

export type { TaskEntity } from "../domain/entities/Task";

// ─── Lifecycle state machine ──────────────────────────────────────────────────

export type { TaskLifecycleStatus } from "../domain/value-objects/task-state";

export {
  TASK_LIFECYCLE_STATUSES,
  canTransitionTask,
  nextTaskStatus,
  isTerminalTaskStatus,
} from "../domain/value-objects/task-state";

// ─── Domain events (cross-domain) ────────────────────────────────────────────

export type {
  TaskDomainEvent,
  TaskCreatedEvent,
  TaskUpdatedEvent,
  TaskAssignedEvent,
  TaskStatusChangedEvent,
  TaskAcceptedEvent,
  TaskArchivedEvent,
} from "../domain/events/task.events";

// ─── Query functions ──────────────────────────────────────────────────────────

export { getTasks } from "../interfaces/queries/task.queries";
