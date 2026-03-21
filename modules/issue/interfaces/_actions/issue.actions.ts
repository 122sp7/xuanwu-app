"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";

import type {
  CreateWorkspaceIssueInput,
  UpdateWorkspaceIssueInput,
} from "../../domain/entities/Issue";
import {
  CreateWorkspaceIssueUseCase,
  DeleteWorkspaceIssueUseCase,
  UpdateWorkspaceIssueUseCase,
} from "../../application/use-cases/issue.use-cases";
import { FirebaseIssueRepository } from "../../infrastructure/firebase/FirebaseIssueRepository";

function createIssueUseCases() {
  const issueRepository = new FirebaseIssueRepository();
  return {
    createWorkspaceIssueUseCase: new CreateWorkspaceIssueUseCase(issueRepository),
    updateWorkspaceIssueUseCase: new UpdateWorkspaceIssueUseCase(issueRepository),
    deleteWorkspaceIssueUseCase: new DeleteWorkspaceIssueUseCase(issueRepository),
  };
}

export async function createWorkspaceIssue(input: CreateWorkspaceIssueInput): Promise<CommandResult> {
  try {
    const { createWorkspaceIssueUseCase } = createIssueUseCases();
    return await createWorkspaceIssueUseCase.execute(input);
  } catch (error) {
    return commandFailureFrom(
      "ISSUE_CREATE_FAILED",
      error instanceof Error ? error.message : "Unexpected issue create error",
    );
  }
}

export async function updateWorkspaceIssue(
  issueId: string,
  input: UpdateWorkspaceIssueInput,
): Promise<CommandResult> {
  try {
    const { updateWorkspaceIssueUseCase } = createIssueUseCases();
    return await updateWorkspaceIssueUseCase.execute(issueId, input);
  } catch (error) {
    return commandFailureFrom(
      "ISSUE_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unexpected issue update error",
    );
  }
}

export async function deleteWorkspaceIssue(issueId: string): Promise<CommandResult> {
  try {
    const { deleteWorkspaceIssueUseCase } = createIssueUseCases();
    return await deleteWorkspaceIssueUseCase.execute(issueId);
  } catch (error) {
    return commandFailureFrom(
      "ISSUE_DELETE_FAILED",
      error instanceof Error ? error.message : "Unexpected issue delete error",
    );
  }
}
