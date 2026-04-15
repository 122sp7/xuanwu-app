import type { BackgroundJobStatus } from "../entities/BackgroundJob";

export interface BackgroundJobDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface BackgroundJobRegisteredEvent extends BackgroundJobDomainEvent {
  readonly type: "platform.background-job.job_registered";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly title: string;
    readonly mimeType: string;
  };
}

export interface BackgroundJobAdvancedEvent extends BackgroundJobDomainEvent {
  readonly type: "platform.background-job.job_advanced";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly previousStatus: BackgroundJobStatus;
    readonly nextStatus: BackgroundJobStatus;
  };
}

export interface BackgroundJobFailedEvent extends BackgroundJobDomainEvent {
  readonly type: "platform.background-job.job_failed";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly reason: string;
  };
}

export type BackgroundJobDomainEventType =
  | BackgroundJobRegisteredEvent
  | BackgroundJobAdvancedEvent
  | BackgroundJobFailedEvent;
