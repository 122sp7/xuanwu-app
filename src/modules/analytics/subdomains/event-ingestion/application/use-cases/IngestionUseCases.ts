import { v4 as uuid } from "@lib-uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { AnalyticsEventSnapshot } from "../../../event-contracts/domain/entities/AnalyticsEvent";
import type { IngestionBatch, IngestionBatchRepository } from "../../domain/entities/IngestionBatch";

export class IngestEventBatchUseCase {
  constructor(private readonly repo: IngestionBatchRepository) {}

  async execute(events: AnalyticsEventSnapshot[]): Promise<CommandResult> {
    try {
      const batch: IngestionBatch = {
        id: uuid(),
        events,
        status: "pending",
        createdAtISO: new Date().toISOString(),
      };
      await this.repo.save(batch);
      return commandSuccess(batch.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "INGEST_BATCH_FAILED",
        err instanceof Error ? err.message : "Failed to ingest event batch",
      );
    }
  }
}
