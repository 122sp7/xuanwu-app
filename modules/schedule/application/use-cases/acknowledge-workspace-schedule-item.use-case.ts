import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import {
  SCHEDULE_ACKNOWLEDGEMENT_ID_DELIMITER,
  type AcknowledgeWorkspaceScheduleItemInput,
} from "../../domain/entities/ScheduleAcknowledgement";
import type { ScheduleAcknowledgementRepository } from "../../domain/repositories/ScheduleAcknowledgementRepository";

export class AcknowledgeWorkspaceScheduleItemUseCase {
  constructor(
    private readonly scheduleAcknowledgementRepository: ScheduleAcknowledgementRepository,
  ) {}

  async execute(input: AcknowledgeWorkspaceScheduleItemInput): Promise<CommandResult> {
    const workspaceId = input.workspaceId.trim();
    const scheduleItemId = input.scheduleItemId.trim();
    const actorAccountId = input.actorAccountId.trim();

    if (!workspaceId) {
      return commandFailureFrom("SCHEDULE_WORKSPACE_REQUIRED", "Workspace is required.");
    }

    if (!scheduleItemId) {
      return commandFailureFrom("SCHEDULE_ITEM_REQUIRED", "Schedule item is required.");
    }

    if (!actorAccountId) {
      return commandFailureFrom("SCHEDULE_ACTOR_REQUIRED", "Actor account is required.");
    }

    if (
      workspaceId.includes(SCHEDULE_ACKNOWLEDGEMENT_ID_DELIMITER) ||
      scheduleItemId.includes(SCHEDULE_ACKNOWLEDGEMENT_ID_DELIMITER)
    ) {
      return commandFailureFrom(
        "SCHEDULE_ITEM_ID_INVALID",
        "Schedule acknowledgement identifiers contain an unsupported delimiter.",
      );
    }

    const acknowledgement = await this.scheduleAcknowledgementRepository.acknowledge({
      workspaceId,
      scheduleItemId,
      actorAccountId,
    });

    const acknowledgementVersion = Date.parse(acknowledgement.acknowledgedAtISO);
    if (Number.isNaN(acknowledgementVersion)) {
      return commandFailureFrom(
        "SCHEDULE_ACKNOWLEDGED_AT_INVALID",
        `Schedule acknowledgement ${acknowledgement.id} has invalid timestamp: ${acknowledgement.acknowledgedAtISO}`,
      );
    }

    return commandSuccess(acknowledgement.id, acknowledgementVersion);
  }
}
