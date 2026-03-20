"use server";

import { commandFailureFrom, type CommandResult } from "@/shared/types";
import type { SubmitScheduleRequestInput } from "../../domain/entities/ScheduleRequest";
import { SubmitScheduleRequestUseCase } from "../../application/use-cases/submit-schedule-request.use-case";
import { FirebaseScheduleRequestRepository } from "../../infrastructure/firebase/FirebaseScheduleRequestRepository";
import { FirebaseMdddProjectionRepository } from "../../infrastructure/firebase/FirebaseMdddProjectionRepository";

const scheduleRequestRepository = new FirebaseScheduleRequestRepository();
const submitScheduleRequestUseCase = new SubmitScheduleRequestUseCase(scheduleRequestRepository);
const projectionRepository = new FirebaseMdddProjectionRepository();

export async function submitScheduleRequest(
  input: SubmitScheduleRequestInput,
): Promise<CommandResult> {
  try {
    const result = await submitScheduleRequestUseCase.execute(input);

    if (result.success) {
      // Write an initial RequestCreated projection so the workspace tab shows the
      // new request immediately, without waiting for the full MDDD flow to run.
      await projectionRepository.project([
        {
          type: "RequestCreated",
          requestId: result.aggregateId,
          workspaceId: input.workspaceId,
          organizationId: input.organizationId,
          occurredAtISO: new Date().toISOString(),
        },
      ]);
    }

    return result;
  } catch (error) {
    return commandFailureFrom(
      "SCHEDULE_REQUEST_SUBMIT_FAILED",
      error instanceof Error ? error.message : "Unexpected schedule request submission error",
    );
  }
}
