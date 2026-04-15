export interface TaskFormationDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface TaskFormationJobCreatedEvent extends TaskFormationDomainEvent {
  readonly type: "workspace.task-formation.job-created";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly correlationId: string };
}

export type TaskFormationDomainEventType = TaskFormationJobCreatedEvent;
