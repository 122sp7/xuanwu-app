"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { CreateWorkspaceTaskInput, UpdateWorkspaceTaskInput } from "@task-core";
import {
  CreateWorkspaceTaskUseCase,
  DeleteWorkspaceTaskUseCase,
  UpdateWorkspaceTaskUseCase,
} from "@task-service";
import { FirebaseTaskRepository } from "../../infrastructure/firebase/FirebaseTaskRepository";

const taskRepository = new FirebaseTaskRepository();
const createWorkspaceTaskUseCase = new CreateWorkspaceTaskUseCase(taskRepository);
const updateWorkspaceTaskUseCase = new UpdateWorkspaceTaskUseCase(taskRepository);
const deleteWorkspaceTaskUseCase = new DeleteWorkspaceTaskUseCase(taskRepository);

export async function createWorkspaceTask(input: CreateWorkspaceTaskInput): Promise<CommandResult> {
  try {
    return await createWorkspaceTaskUseCase.execute(input);
  } catch (error) {
    return commandFailureFrom(
      "TASK_CREATE_FAILED",
      error instanceof Error ? error.message : "Unexpected task create error",
    );
  }
}

export async function updateWorkspaceTask(
  taskId: string,
  input: UpdateWorkspaceTaskInput,
): Promise<CommandResult> {
  try {
    return await updateWorkspaceTaskUseCase.execute(taskId, input);
  } catch (error) {
    return commandFailureFrom(
      "TASK_UPDATE_FAILED",
      error instanceof Error ? error.message : "Unexpected task update error",
    );
  }
}

export async function deleteWorkspaceTask(taskId: string): Promise<CommandResult> {
  try {
    return await deleteWorkspaceTaskUseCase.execute(taskId);
  } catch (error) {
    return commandFailureFrom(
      "TASK_DELETE_FAILED",
      error instanceof Error ? error.message : "Unexpected task delete error",
    );
  }
}
