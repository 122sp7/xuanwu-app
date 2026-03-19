"use server";

import { commandFailureFrom, type CommandResult } from "@/shared/types";
import type { SubmitScheduleRequestInput } from "../../domain/entities/ScheduleRequest";
import { SubmitScheduleRequestUseCase } from "../../application/use-cases/submit-schedule-request.use-case";
import { FirebaseScheduleRequestRepository } from "../../infrastructure/firebase/FirebaseScheduleRequestRepository";

const scheduleRequestRepository = new FirebaseScheduleRequestRepository();
const submitScheduleRequestUseCase = new SubmitScheduleRequestUseCase(scheduleRequestRepository);

export async function submitScheduleRequest(
  input: SubmitScheduleRequestInput,
): Promise<CommandResult> {
  try {
    return await submitScheduleRequestUseCase.execute(input);
  } catch (error) {
    return commandFailureFrom(
      "SCHEDULE_REQUEST_SUBMIT_FAILED",
      error instanceof Error ? error.message : "Unexpected schedule request submission error",
    );
  }
}
