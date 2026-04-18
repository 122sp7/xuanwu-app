/**
 * IngestionJobStartedEvent — Domain Event
 * Emitted when a new ingestion job is created and submitted for processing.
 */
export class IngestionJobStartedEvent {
  readonly type = 'template.ingestion.job-started' as const;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly occurredAt: string;
  readonly payload: Readonly<{
    jobId: string;
    sourceUrl: string;
  }>;

  constructor(
    public readonly jobId: string,
    public readonly sourceUrl: string,
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
  ) {
    this.eventId = eventId;
    this.aggregateId = jobId;
    this.occurredAt = occurredAt;
    this.payload = {
      jobId,
      sourceUrl,
    };
  }
}

/**
 * IngestionJobCompletedEvent — Domain Event
 * Emitted when an ingestion job finishes successfully.
 */
export class IngestionJobCompletedEvent {
  readonly type = 'template.ingestion.job-completed' as const;
  readonly eventId: string;
  readonly aggregateId: string;
  readonly occurredAt: string;
  readonly payload: Readonly<{
    jobId: string;
    sourceUrl: string;
  }>;

  constructor(
    public readonly jobId: string,
    public readonly sourceUrl: string,
    occurredAt: string = new Date().toISOString(),
    eventId: string = crypto.randomUUID(),
  ) {
    this.eventId = eventId;
    this.aggregateId = jobId;
    this.occurredAt = occurredAt;
    this.payload = {
      jobId,
      sourceUrl,
    };
  }
}
