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

export interface TaskCandidatesExtractedEvent extends TaskFormationDomainEvent {
  readonly type: "workspace.task-formation.candidates-extracted";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly candidateCount: number };
}

export interface TaskCandidatesConfirmedEvent extends TaskFormationDomainEvent {
  readonly type: "workspace.task-formation.candidates-confirmed";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly confirmedCount: number };
}

export interface TaskFormationJobFailedEvent extends TaskFormationDomainEvent {
  readonly type: "workspace.task-formation.job-failed";
  readonly payload: { readonly jobId: string; readonly workspaceId: string; readonly errorCode: string };
}

export type TaskFormationDomainEventType =
  | TaskFormationJobCreatedEvent
  | TaskCandidatesExtractedEvent
  | TaskCandidatesConfirmedEvent
  | TaskFormationJobFailedEvent;
