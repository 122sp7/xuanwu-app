"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeIssueRepo } from "../../../issue/api/factories";
import { makeTaskRepo } from "../../../task/api/factories";
import { SubmitIssueRetestUseCase } from "../../application/use-cases/submit-issue-retest.use-case";
import { PassIssueRetestUseCase } from "../../application/use-cases/pass-issue-retest.use-case";
import { FailIssueRetestUseCase } from "../../application/use-cases/fail-issue-retest.use-case";
import { ApproveTaskAcceptanceUseCase } from "../../application/use-cases/approve-task-acceptance.use-case";

export async function wfSubmitIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await new SubmitIssueRetestUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_SUBMIT_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfPassIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await new PassIssueRetestUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_PASS_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfFailIssueRetest(issueId: string): Promise<CommandResult> {
  try {
    return await new FailIssueRetestUseCase(makeIssueRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("WF_ISSUE_RETEST_FAIL_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfApproveTaskAcceptance(taskId: string): Promise<CommandResult> {
  try {
    return await new ApproveTaskAcceptanceUseCase(makeTaskRepo(), makeIssueRepo()).execute(taskId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_APPROVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
