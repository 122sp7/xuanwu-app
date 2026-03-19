"use server";

import { commandFailureFrom, type CommandResult } from "@/shared/types";
import {
  RunScheduleMdddFlowUseCase,
  type RunScheduleMdddFlowInput,
  type RunScheduleMdddFlowOutput,
} from "../../application/use-cases/mddd/run-schedule-mddd-flow.use-case";

const runScheduleMdddFlowUseCase = new RunScheduleMdddFlowUseCase();

export interface RunScheduleMdddFlowResult {
  readonly command: CommandResult;
  readonly data?: RunScheduleMdddFlowOutput;
  readonly reason?: string;
}

export async function runScheduleMdddFlow(
  input: RunScheduleMdddFlowInput,
): Promise<RunScheduleMdddFlowResult> {
  try {
    return runScheduleMdddFlowUseCase.execute(input);
  } catch (error) {
    return {
      command: commandFailureFrom(
        "SCHEDULE_MDDD_FLOW_FAILED",
        error instanceof Error ? error.message : "Unexpected schedule MDDD flow error",
      ),
      reason: "unexpected_error",
    };
  }
}
