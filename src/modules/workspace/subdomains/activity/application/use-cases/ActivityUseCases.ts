import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ActivityRepository } from "../../domain/repositories/ActivityRepository";
import { ActivityEvent } from "../../domain/entities/ActivityEvent";
import type { RecordActivityInput } from "../../domain/entities/ActivityEvent";

export class RecordActivityUseCase {
  constructor(private readonly activityRepo: ActivityRepository) {}

  async execute(input: RecordActivityInput): Promise<CommandResult> {
    try {
      const entry = ActivityEvent.record(uuid(), input);
      await this.activityRepo.save(entry.getSnapshot());
      return commandSuccess(entry.id, Date.now());
    } catch (err) {
      return commandFailureFrom("ACTIVITY_RECORD_FAILED", err instanceof Error ? err.message : "Failed to record activity.");
    }
  }
}
