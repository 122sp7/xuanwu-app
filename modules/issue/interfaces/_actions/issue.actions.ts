"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { CreateIssueInput, UpdateIssueInput } from "../../domain/entities/Issue";
import type { IssueLifecycleStatus } from "../../domain/value-objects/issue-state";
import {
  CreateIssueUseCase,
  DeleteIssueUseCase,
  TransitionIssueStatusUseCase,
  UpdateIssueUseCase,
} from "../../application/use-cases/issue.use-cases";
import { FirebaseIssueRepository } from "../../infrastructure/firebase/FirebaseIssueRepository";

function makeRepo() {
  return new FirebaseIssueRepository();
}

export async function createIssue(input: CreateIssueInput): Promise<CommandResult> {
  try {
    return await new CreateIssueUseCase(makeRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("ISSUE_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateIssue(issueId: string, input: UpdateIssueInput): Promise<CommandResult> {
  try {
    return await new UpdateIssueUseCase(makeRepo()).execute(issueId, input);
  } catch (err) {
    return commandFailureFrom("ISSUE_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteIssue(issueId: string): Promise<CommandResult> {
  try {
    return await new DeleteIssueUseCase(makeRepo()).execute(issueId);
  } catch (err) {
    return commandFailureFrom("ISSUE_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function transitionIssueStatus(
  issueId: string,
  to: IssueLifecycleStatus,
): Promise<CommandResult> {
  try {
    return await new TransitionIssueStatusUseCase(makeRepo()).execute(issueId, to);
  } catch (err) {
    return commandFailureFrom("ISSUE_TRANSITION_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
