/**
 * @module workspace-flow/application/use-cases
 * @file create-task.use-case.ts
 * @description Use case: Create a new task in the workspace-flow context.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add input validation with Zod schema
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { CreateTaskDto } from "../dto/create-task.dto";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(dto: CreateTaskDto): Promise<CommandResult> {
    const workspaceId = dto.workspaceId.trim();
    const title = dto.title.trim();

    if (!workspaceId) {
      return commandFailureFrom("WF_TASK_WORKSPACE_REQUIRED", "Workspace is required.");
    }
    if (!title) {
      return commandFailureFrom("WF_TASK_TITLE_REQUIRED", "Task title is required.");
    }

    const task = await this.taskRepository.create({ ...dto, workspaceId, title });
    return commandSuccess(task.id, Date.now());
  }
}
