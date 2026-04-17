import type { AnalyticsEventSnapshot } from "../../../event-contracts/domain/entities/AnalyticsEvent";

export type IngestionStatus = "pending" | "processed" | "failed";

export interface IngestionBatch {
  readonly id: string;
  readonly events: AnalyticsEventSnapshot[];
  readonly status: IngestionStatus;
  readonly processedAt?: string;
  readonly failedReason?: string;
  readonly createdAtISO: string;
}

export interface IngestionBatchRepository {
  save(batch: IngestionBatch): Promise<void>;
  findById(id: string): Promise<IngestionBatch | null>;
  findPending(limit?: number): Promise<IngestionBatch[]>;
}
