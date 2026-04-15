/**
 * IngestionJob — Aggregate Root (stub)
 *
 * Tracks the lifecycle of a single source-document ingestion run.
 * Expand this aggregate when the ingestion subdomain is activated.
 */
export type IngestionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface IngestionJobProps {
  id: string;
  sourceUrl: string;
  status: IngestionStatus;
  createdAt: Date;
  completedAt?: Date;
}

export class IngestionJob {
  private constructor(private props: IngestionJobProps) {}

  static create(
    params: Pick<IngestionJobProps, 'id' | 'sourceUrl'>,
  ): IngestionJob {
    return new IngestionJob({
      ...params,
      status: 'pending',
      createdAt: new Date(),
    });
  }

  get id(): string {
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

  markCompleted(): void {
    this.props.status = 'completed';
    this.props.completedAt = new Date();
  }

  markFailed(): void {
    this.props.status = 'failed';
    this.props.completedAt = new Date();
  }
}
