import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type {
  CreateWorkspaceTaskInput,
  UpdateWorkspaceTaskInput,
  WorkspaceTaskEntity,
} from "../../domain/entities/Task";

export class CreateWorkspaceTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: CreateWorkspaceTaskInput): Promise<CommandResult> {
    const workspaceId = input.workspaceId.trim();
    const title = input.title.trim();

    if (!workspaceId) {
      return commandFailureFrom("TASK_WORKSPACE_REQUIRED", "Workspace is required.");
    }

    if (!title) {
      return commandFailureFrom("TASK_TITLE_REQUIRED", "Task title is required.");
    }

    const task = await this.taskRepository.create({
      ...input,
      workspaceId,
      title,
    });
    return commandSuccess(task.id, Date.now());
  }
}

export class UpdateWorkspaceTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string, input: UpdateWorkspaceTaskInput): Promise<CommandResult> {
    const normalizedTaskId = taskId.trim();
    if (!normalizedTaskId) {
      return commandFailureFrom("TASK_ID_REQUIRED", "Task id is required.");
    }

    const nextTitle = typeof input.title === "string" ? input.title.trim() : undefined;
    if (typeof nextTitle === "string" && !nextTitle) {
      return commandFailureFrom("TASK_TITLE_REQUIRED", "Task title is required.");
    }

    const updatedTask = await this.taskRepository.update(normalizedTaskId, {
      ...input,
      ...(typeof nextTitle === "string" ? { title: nextTitle } : {}),
    });

    if (!updatedTask) {
      return commandFailureFrom("TASK_NOT_FOUND", "Task not found.");
    }

    return commandSuccess(updatedTask.id, Date.now());
  }
}

export class DeleteWorkspaceTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string): Promise<CommandResult> {
    const normalizedTaskId = taskId.trim();
    if (!normalizedTaskId) {
      return commandFailureFrom("TASK_ID_REQUIRED", "Task id is required.");
    }

    await this.taskRepository.delete(normalizedTaskId);
    return commandSuccess(normalizedTaskId, Date.now());
  }
}

export class ListWorkspaceTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(workspaceId: string): Promise<WorkspaceTaskEntity[]> {
    const normalizedWorkspaceId = workspaceId.trim();
    if (!normalizedWorkspaceId) {
      return [];
    }

    return this.taskRepository.findByWorkspaceId(normalizedWorkspaceId);
  }
}
