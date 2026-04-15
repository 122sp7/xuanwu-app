import type { TaskStatus } from "../value-objects/TaskStatus";

export interface TaskDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface TaskCreatedEvent extends TaskDomainEvent {
  readonly type: "workspace.task.created";
  readonly payload: {
    readonly taskId: string;
    readonly workspaceId: string;
    readonly title: string;
  };
}

export interface TaskStatusChangedEvent extends TaskDomainEvent {
  readonly type: "workspace.task.status-changed";
  readonly payload: {
    readonly taskId: string;
    readonly workspaceId: string;
    readonly from: TaskStatus;
    readonly to: TaskStatus;
  };
}

export interface TaskArchivedEvent extends TaskDomainEvent {
  readonly type: "workspace.task.archived";
  readonly payload: {
    readonly taskId: string;
    readonly workspaceId: string;
    readonly archivedAtISO: string;
  };
}

export type TaskDomainEventType =
  | TaskCreatedEvent
  | TaskStatusChangedEvent
  | TaskArchivedEvent;
