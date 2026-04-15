"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeTaskRepo } from "../../../task/api/factories";
import { makeIssueRepo } from "../../../issue/api/factories";
import { SubmitTaskToQaUseCase } from "../../application/use-cases/submit-task-to-qa.use-case";
import { PassTaskQaUseCase } from "../../application/use-cases/pass-task-qa.use-case";

export async function wfSubmitTaskToQa(taskId: string): Promise<CommandResult> {
  try {
    return await new SubmitTaskToQaUseCase(makeTaskRepo()).execute(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_SUBMIT_QA_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPassTaskQa(taskId: string): Promise<CommandResult> {
  try {
    return await new PassTaskQaUseCase(makeTaskRepo(), makeIssueRepo()).execute(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_PASS_QA_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

