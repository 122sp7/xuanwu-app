import { IngestionId } from '../value-objects/IngestionId';
import {
  IngestionJobCompletedEvent,
  IngestionJobFailedEvent,
  IngestionJobStartedEvent,
} from '../events/IngestionJobEvents';

/**
 * IngestionJob — Aggregate Root
 * Tracks the lifecycle of a single source-document ingestion run.
 */
export type IngestionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface IngestionJobProps {
  id: IngestionId;
  sourceUrl: string;
  status: IngestionStatus;
  createdAt: Date;
  completedAt?: Date;
}

export class IngestionJob {
  private readonly domainEvents: Array<
    IngestionJobStartedEvent | IngestionJobCompletedEvent | IngestionJobFailedEvent
  > = [];

  private constructor(private props: IngestionJobProps) {}

  static create(
    params: Pick<IngestionJobProps, 'id' | 'sourceUrl'>,
  ): IngestionJob {
    const job = new IngestionJob({
      ...params,
      status: 'pending',
      createdAt: new Date(),
    });
    job.domainEvents.push(
      new IngestionJobStartedEvent(
        params.id.toString(),
        params.sourceUrl,
      ),
    );
    return job;
  }

  get id(): IngestionId {
    return this.props.id;
  }

  get sourceUrl(): string {
    return this.props.sourceUrl;
  }

  get status(): IngestionStatus {
    return this.props.status;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get completedAt(): Date | undefined {
    return this.props.completedAt;
  }

  markProcessing(): void {
    if (this.props.status !== 'pending') {
      throw new Error(`Invalid ingestion transition: ${this.props.status} -> processing`);
    }
    this.props.status = 'processing';
  }

  markCompleted(): void {
    if (this.props.status !== 'processing') {
      throw new Error(`Invalid ingestion transition: ${this.props.status} -> completed`);
    }
    this.props.status = 'completed';
    const completedAt = new Date();
    this.props.completedAt = completedAt;
    this.domainEvents.push(
      new IngestionJobCompletedEvent(
        this.props.id.toString(),
        this.props.sourceUrl,
        completedAt.toISOString(),
      ),
    );
  }

  markFailed(): void {
    if (this.props.status !== 'processing') {
      throw new Error(`Invalid ingestion transition: ${this.props.status} -> failed`);
    }
    this.props.status = 'failed';
    const failedAt = new Date();
    this.props.completedAt = failedAt;
    this.domainEvents.push(
      new IngestionJobFailedEvent(
        this.props.id.toString(),
        this.props.sourceUrl,
        failedAt.toISOString(),
      ),
    );
  }

  pullDomainEvents(): Array<
    IngestionJobStartedEvent | IngestionJobCompletedEvent | IngestionJobFailedEvent
  > {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }
}
