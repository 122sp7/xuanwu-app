import type { IngestionStatus } from "../entities/IngestionJob";

export interface IngestionJobDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface IngestionJobRegisteredEvent extends IngestionJobDomainEvent {
  readonly type: "platform.background-job.ingestion_registered";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly organizationId: string;
    readonly workspaceId: string;
    readonly title: string;
    readonly mimeType: string;
  };
}

export interface IngestionJobAdvancedEvent extends IngestionJobDomainEvent {
  readonly type: "platform.background-job.ingestion_advanced";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly previousStatus: IngestionStatus;
    readonly nextStatus: IngestionStatus;
  };
}

export interface IngestionJobFailedEvent extends IngestionJobDomainEvent {
  readonly type: "platform.background-job.ingestion_failed";
  readonly payload: {
    readonly jobId: string;
    readonly documentId: string;
    readonly reason: string;
  };
}

export type IngestionJobDomainEventType =
  | IngestionJobRegisteredEvent
  | IngestionJobAdvancedEvent
  | IngestionJobFailedEvent;
