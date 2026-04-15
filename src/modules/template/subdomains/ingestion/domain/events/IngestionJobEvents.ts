/**
 * IngestionJobStartedEvent — Domain Event
 * Emitted when a new ingestion job is created and submitted for processing.
 */
export class IngestionJobStartedEvent {
  readonly type = 'template.ingestion.job_started' as const;
  readonly occurredAt = new Date();

  constructor(
    public readonly jobId: string,
    public readonly sourceUrl: string,
  ) {}
}

/**
 * IngestionJobCompletedEvent — Domain Event
 * Emitted when an ingestion job finishes successfully.
 */
export class IngestionJobCompletedEvent {
  readonly type = 'template.ingestion.job_completed' as const;
  readonly occurredAt = new Date();

  constructor(
    public readonly jobId: string,
    public readonly sourceUrl: string,
  ) {}
}
