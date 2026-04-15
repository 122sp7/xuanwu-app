export interface JobDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface JobCreatedEvent extends JobDomainEvent {
  readonly type: "workspace.orchestration.job-created";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly correlationId: string };
}

export interface JobCompletedEvent extends JobDomainEvent {
  readonly type: "workspace.orchestration.job-completed";
  readonly payload: { readonly jobId: string; readonly workspaceId: string };
}

export type JobDomainEventType = JobCreatedEvent | JobCompletedEvent;
