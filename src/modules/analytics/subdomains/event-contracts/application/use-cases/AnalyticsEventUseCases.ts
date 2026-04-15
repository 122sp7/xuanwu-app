import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import { AnalyticsEvent, type TrackEventInput } from "../../domain/entities/AnalyticsEvent";
import type { AnalyticsEventRepository } from "../../domain/repositories/AnalyticsEventRepository";

export class TrackAnalyticsEventUseCase {
  constructor(private readonly repo: AnalyticsEventRepository) {}

  async execute(input: TrackEventInput): Promise<CommandResult> {
    try {
      const event = AnalyticsEvent.create(input);
      await this.repo.save(event.getSnapshot());
      return commandSuccess(event.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "TRACK_ANALYTICS_EVENT_FAILED",
        err instanceof Error ? err.message : "Failed to track analytics event",
      );
    }
  }
}

export class QueryAnalyticsEventsUseCase {
  constructor(private readonly repo: AnalyticsEventRepository) {}

  async execute(params: {
    name?: string;
    source?: string;
    workspaceId?: string;
    actorId?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    offset?: number;
  }) {
    return this.repo.query(params);
  }
}
