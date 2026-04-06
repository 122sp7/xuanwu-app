/**
 * @module workspace-flow/application/use-cases
 * @file update-task.use-case.ts
 * @description Use case: Update mutable fields on an existing task.
 * @author workspace-flow
 * @since 2026-03-24
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { UpdateTaskDto } from "../dto/update-task.dto";

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string, dto: UpdateTaskDto): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const existing = await this.taskRepository.findById(taskId);
    if (!existing) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const updated = await this.taskRepository.update(taskId, dto);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after update.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
