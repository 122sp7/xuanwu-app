"use server";

/**
 * Task Server Actions — thin adapter between Next.js Server Actions and Application Use Cases.
 * Responsibilities: call use cases, handle auth/session, NO business logic.
 */

import { commandFailureFrom, type CommandResult } from "@/shared/types";
import {
  CreateTaskUseCase,
  UpdateTaskStatusUseCase,
  DeleteTaskUseCase,
} from "../../application/TaskService";
import { TaskRepoImpl } from "../../infrastructure/TaskRepoImpl";
import type { TaskEntity } from "../../domain/TaskEntity";

// Compose dependencies (poor-man's DI — replace with a proper container)
const taskRepo = new TaskRepoImpl();
const createTaskUseCase = new CreateTaskUseCase(taskRepo);
const updateTaskStatusUseCase = new UpdateTaskStatusUseCase(taskRepo);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepo);

export async function createTask(input: {
  title: string;
  description?: string;
}): Promise<CommandResult> {
  try {
    return await createTaskUseCase.execute(input);
  } catch (err) {
    return commandFailureFrom(
      "TASK_ACTION_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function updateTaskStatus(
  id: string,
  status: TaskEntity["status"],
): Promise<CommandResult> {
  try {
    return await updateTaskStatusUseCase.execute(id, status);
  } catch (err) {
    return commandFailureFrom(
      "TASK_ACTION_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}

export async function deleteTask(id: string): Promise<CommandResult> {
  try {
    return await deleteTaskUseCase.execute(id);
  } catch (err) {
    return commandFailureFrom(
      "TASK_ACTION_FAILED",
      err instanceof Error ? err.message : "Unexpected error",
    );
  }
}
