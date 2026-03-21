"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";

import type {
  CreateWorkspaceQualityCheckInput,
  UpdateWorkspaceQualityCheckInput,
} from "../../domain/entities/QualityCheck";
import {
  CreateWorkspaceQualityCheckUseCase,
  DeleteWorkspaceQualityCheckUseCase,
  UpdateWorkspaceQualityCheckUseCase,
} from "../../application/use-cases/quality-check.use-cases";
import { FirebaseQualityCheckRepository } from "../../infrastructure/firebase/FirebaseQualityCheckRepository";

function createQualityCheckUseCases() {
  const qualityCheckRepository = new FirebaseQualityCheckRepository();
  return {
    createWorkspaceQualityCheckUseCase: new CreateWorkspaceQualityCheckUseCase(qualityCheckRepository),
    updateWorkspaceQualityCheckUseCase: new UpdateWorkspaceQualityCheckUseCase(qualityCheckRepository),
    deleteWorkspaceQualityCheckUseCase: new DeleteWorkspaceQualityCheckUseCase(qualityCheckRepository),
  };
}

export async function createWorkspaceQualityCheck(
  input: CreateWorkspaceQualityCheckInput,
): Promise<CommandResult> {
  try {
    const { createWorkspaceQualityCheckUseCase } = createQualityCheckUseCases();
    return await createWorkspaceQualityCheckUseCase.execute(input);
  } catch (error) {
    return commandFailureFrom(
      "QA_CREATE_FAILED",
      error instanceof Error ? error.message : "Unexpected QA create error",
    );
  }
}

export async function updateWorkspaceQualityCheck(
  qualityCheckId: string,
  input: UpdateWorkspaceQualityCheckInput,
): Promise<CommandResult> {
  try {
    const { updateWorkspaceQualityCheckUseCase } = createQualityCheckUseCases();
    return await updateWorkspaceQualityCheckUseCase.execute(qualityCheckId, input);
  } catch (error) {
    return commandFailureFrom(
      "QA_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unexpected QA update error",
    );
  }
}

export async function deleteWorkspaceQualityCheck(qualityCheckId: string): Promise<CommandResult> {
  try {
    const { deleteWorkspaceQualityCheckUseCase } = createQualityCheckUseCases();
    return await deleteWorkspaceQualityCheckUseCase.execute(qualityCheckId);
  } catch (error) {
    return commandFailureFrom(
      "QA_DELETE_FAILED",
      error instanceof Error ? error.message : "Unexpected QA delete error",
    );
  }
}
