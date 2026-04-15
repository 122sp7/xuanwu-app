import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { UsageRecord, type RecordUsageInput } from "../../domain/entities/UsageRecord";
import type { UsageRecordRepository, UsageQuery } from "../../domain/repositories/UsageRecordRepository";

export class RecordUsageUseCase {
  constructor(private readonly repo: UsageRecordRepository) {}

  async execute(input: RecordUsageInput): Promise<CommandResult> {
    try {
      const record = UsageRecord.record(input);
      await this.repo.save(record.getSnapshot());
      return commandSuccess(record.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "RECORD_USAGE_FAILED",
        err instanceof Error ? err.message : "Failed to record usage",
      );
    }
  }
}

export class QueryUsageUseCase {
  constructor(private readonly repo: UsageRecordRepository) {}

  async execute(params: UsageQuery) {
    return this.repo.query(params);
  }
}

export class GetUsageSummaryUseCase {
  constructor(private readonly repo: UsageRecordRepository) {}

  async execute(input: {
    featureKey: string;
    contextId: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<number> {
    return this.repo.sumQuantity(input.featureKey, input.contextId, input.fromDate, input.toDate);
  }
}
