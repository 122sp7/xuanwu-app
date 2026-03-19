"use server";

import { commandFailureFrom } from "@/shared/types";
import {
  RunScheduleMdddFlowUseCase,
  type RunScheduleMdddFlowInput,
  type RunScheduleMdddFlowResult,
} from "../../application/use-cases/mddd/run-schedule-mddd-flow.use-case";

export async function runScheduleMdddFlow(
  input: RunScheduleMdddFlowInput,
): Promise<RunScheduleMdddFlowResult> {
  try {
    const useCase = new RunScheduleMdddFlowUseCase();
    return useCase.execute(input);
  } catch (error) {
    return {
      success: false,
      command: commandFailureFrom(
        "SCHEDULE_MDDD_FLOW_FAILED",
        error instanceof Error ? error.message : "Unexpected schedule MDDD flow error",
      ),
      reason: "unexpected_error",
    };
  }
}
