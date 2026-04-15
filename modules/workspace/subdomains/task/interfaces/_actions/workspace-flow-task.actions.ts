"use server";

import { commandFailureFrom, type CommandResult } from "@shared-types";
import { makeTaskRepo } from "../../api/factories";
import { CreateTaskUseCase } from "../../application/use-cases/create-task.use-case";
import { UpdateTaskUseCase } from "../../application/use-cases/update-task.use-case";
import { AssignTaskUseCase } from "../../application/use-cases/assign-task.use-case";
import { ArchiveTaskUseCase } from "../../application/use-cases/archive-task.use-case";
import type { CreateTaskDto } from "../../application/dto/create-task.dto";
import type { UpdateTaskDto } from "../../application/dto/update-task.dto";

export async function wfCreateTask(dto: CreateTaskDto): Promise<CommandResult> {
  try {
    return await new CreateTaskUseCase(makeTaskRepo()).execute(dto);
  } catch (err) {
    return commandFailureFrom("WF_TASK_CREATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfUpdateTask(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> {
  try {
    return await new UpdateTaskUseCase(makeTaskRepo()).execute(taskId, dto);
  } catch (err) {
    return commandFailureFrom("WF_TASK_UPDATE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfAssignTask(taskId: string, assigneeId: string): Promise<CommandResult> {
  try {
    return await new AssignTaskUseCase(makeTaskRepo()).execute(taskId, assigneeId);
  } catch (err) {
    return commandFailureFrom("WF_TASK_ASSIGN_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}

export async function wfArchiveTask(taskId: string, invoiceStatus?: string): Promise<CommandResult> {
  try {
    return await new ArchiveTaskUseCase(makeTaskRepo()).execute(taskId, invoiceStatus);
  } catch (err) {
    return commandFailureFrom("WF_TASK_ARCHIVE_FAILED", err instanceof Error ? err.message : "Unexpected error");
  }
}
