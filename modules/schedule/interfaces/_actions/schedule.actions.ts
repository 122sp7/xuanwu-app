"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { AcknowledgeWorkspaceScheduleItemInput } from "../../domain/entities/ScheduleAcknowledgement";
import { AcknowledgeWorkspaceScheduleItemUseCase } from "../../application/use-cases/acknowledge-workspace-schedule-item.use-case";
import { FirebaseScheduleAcknowledgementRepository } from "../../infrastructure/firebase/FirebaseScheduleAcknowledgementRepository";

const scheduleAcknowledgementRepository = new FirebaseScheduleAcknowledgementRepository();
const acknowledgeWorkspaceScheduleItemUseCase = new AcknowledgeWorkspaceScheduleItemUseCase(
  scheduleAcknowledgementRepository,
);

export async function acknowledgeWorkspaceScheduleItem(
  input: AcknowledgeWorkspaceScheduleItemInput,
): Promise<CommandResult> {
  try {
    return await acknowledgeWorkspaceScheduleItemUseCase.execute(input);
  } catch (error) {
    return commandFailureFrom(
      "SCHEDULE_ACKNOWLEDGE_FAILED",
      error instanceof Error ? error.message : "Unexpected schedule acknowledge error",
    );
  }
}
