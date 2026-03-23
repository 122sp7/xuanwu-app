"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import type { TaskLifecycleStatus } from "../../domain/value-objects/task-state";
import type { CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import {
  CreateTaskUseCase,
  DeleteTaskUseCase,
  TransitionTaskStatusUseCase,
  UpdateTaskUseCase,
} from "../../application/use-cases/task.use-cases";
import { FirebaseTaskRepository } from "../../infrastructure/firebase/FirebaseTaskRepository";

function makeRepo() {
  return new FirebaseTaskRepository();
}

export async function createTask(input: CreateTaskInput): Promise<CommandResult> {
  try {
    return await new CreateTaskUseCase(makeRepo()).execute(input);
  } catch (err) {
    return commandFailureFrom("TASK_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<CommandResult> {
  try {
    return await new UpdateTaskUseCase(makeRepo()).execute(taskId, input);
  } catch (err) {
    return commandFailureFrom("TASK_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function deleteTask(taskId: string): Promise<CommandResult> {
  try {
    return await new DeleteTaskUseCase(makeRepo()).execute(taskId);
  } catch (err) {
    return commandFailureFrom("TASK_DELETE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function transitionTaskStatus(
  taskId: string,
  to: TaskLifecycleStatus,
): Promise<CommandResult> {
  try {
    return await new TransitionTaskStatusUseCase(makeRepo()).execute(taskId, to);
  } catch (err) {
    return commandFailureFrom("TASK_TRANSITION_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
