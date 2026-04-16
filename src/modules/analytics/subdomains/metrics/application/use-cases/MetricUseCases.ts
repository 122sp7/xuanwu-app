import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import { Metric, type RecordMetricInput } from "../../domain/entities/Metric";
import type { MetricRepository, MetricQuery } from "../../domain/repositories/MetricRepository";

export class RecordMetricUseCase {
  constructor(private readonly repo: MetricRepository) {}

  async execute(input: RecordMetricInput): Promise<CommandResult> {
    try {
      const metric = Metric.record(input);
      await this.repo.save(metric.getSnapshot());
      return commandSuccess(metric.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "RECORD_METRIC_FAILED",
        err instanceof Error ? err.message : "Failed to record metric",
      );
    }
  }
}

export class QueryMetricsUseCase {
  constructor(private readonly repo: MetricRepository) {}

  async execute(params: MetricQuery) {
    return this.repo.query(params);
  }
}

export class SumMetricUseCase {
  constructor(private readonly repo: MetricRepository) {}

  async execute(name: string, params?: MetricQuery): Promise<number> {
    return this.repo.sumByName(name, params);
  }
}
