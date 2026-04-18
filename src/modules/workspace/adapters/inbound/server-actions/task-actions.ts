"use server";

import { z } from "zod";
import { commandFailureFrom, type CommandResult } from "../../../../shared";
import { createClientTaskUseCases } from "../../outbound/firebase-composition";
import type { TaskSnapshot } from "../../../subdomains/task/domain/entities/Task";

const CreateTaskSchema = z.object({
  workspaceId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  assigneeId: z.string().optional(),
  dueDateISO: z.string().datetime({ offset: true }).optional(),
});

const UpdateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  assigneeId: z.string().nullable().optional(),
  dueDateISO: z.string().nullable().optional(),
});

const TransitionTaskSchema = z.object({
  to: z.enum(["draft", "in_progress", "qa", "acceptance", "accepted", "archived", "cancelled"]),
});

export async function createTaskAction(rawInput: unknown): Promise<CommandResult> {
  try {
    const input = CreateTaskSchema.parse(rawInput);
    const { createTask } = createClientTaskUseCases();
    return createTask.execute(input);
  } catch (err) {
    return commandFailureFrom("TASK_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function updateTaskAction(taskId: string, rawInput: unknown): Promise<CommandResult> {
  try {
    const input = UpdateTaskSchema.parse(rawInput);
    const { updateTask } = createClientTaskUseCases();
    return updateTask.execute(taskId, input);
  } catch (err) {
    return commandFailureFrom("TASK_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function transitionTaskStatusAction(taskId: string, rawInput: unknown): Promise<CommandResult> {
  try {
    const { to } = TransitionTaskSchema.parse(rawInput);
    const { transitionTaskStatus } = createClientTaskUseCases();
    return transitionTaskStatus.execute(taskId, to);
  } catch (err) {
    return commandFailureFrom("TASK_INVALID_INPUT", err instanceof Error ? err.message : "Invalid input.");
  }
}

export async function deleteTaskAction(taskId: string): Promise<CommandResult> {
  try {
    const { deleteTask } = createClientTaskUseCases();
    return deleteTask.execute(taskId);
  } catch (err) {
    return commandFailureFrom("TASK_DELETE_FAILED", err instanceof Error ? err.message : "Failed to delete task.");
  }
}

export async function listTasksByWorkspaceAction(workspaceId: string): Promise<TaskSnapshot[]> {
  try {
    const { listTasksByWorkspace } = createClientTaskUseCases();
    return listTasksByWorkspace(workspaceId);
  } catch {
    return [];
  }
}
