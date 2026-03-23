import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { TaskEntity, CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import { canTransitionTask, type TaskLifecycleStatus } from "../../domain/value-objects/task-state";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: CreateTaskInput): Promise<CommandResult> {
    const tenantId = input.tenantId.trim();
    const teamId = input.teamId.trim();
    const workspaceId = input.workspaceId.trim();
    const title = input.title.trim();

    if (!tenantId) return commandFailureFrom("TASK_TENANT_REQUIRED", "Tenant is required.");
    if (!teamId) return commandFailureFrom("TASK_TEAM_REQUIRED", "Team is required.");
    if (!workspaceId) return commandFailureFrom("TASK_WORKSPACE_REQUIRED", "Workspace is required.");
    if (!title) return commandFailureFrom("TASK_TITLE_REQUIRED", "Task title is required.");

    const task = await this.taskRepository.create({ ...input, tenantId, teamId, workspaceId, title });
    return commandSuccess(task.id, Date.now());
  }
}

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string, input: UpdateTaskInput): Promise<CommandResult> {
    const normalizedId = taskId.trim();
    if (!normalizedId) return commandFailureFrom("TASK_ID_REQUIRED", "Task id is required.");

    const nextTitle = typeof input.title === "string" ? input.title.trim() : undefined;
    if (typeof nextTitle === "string" && !nextTitle) {
      return commandFailureFrom("TASK_TITLE_REQUIRED", "Task title is required.");
    }

    const updated = await this.taskRepository.update(normalizedId, {
      ...input,
      ...(typeof nextTitle === "string" ? { title: nextTitle } : {}),
    });
    if (!updated) return commandFailureFrom("TASK_NOT_FOUND", "Task not found.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string): Promise<CommandResult> {
    const normalizedId = taskId.trim();
    if (!normalizedId) return commandFailureFrom("TASK_ID_REQUIRED", "Task id is required.");
    await this.taskRepository.delete(normalizedId);
    return commandSuccess(normalizedId, Date.now());
  }
}

export class TransitionTaskStatusUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string, to: TaskLifecycleStatus): Promise<CommandResult> {
    const normalizedId = taskId.trim();
    if (!normalizedId) return commandFailureFrom("TASK_ID_REQUIRED", "Task id is required.");

    const task = await this.taskRepository.findById(normalizedId);
    if (!task) return commandFailureFrom("TASK_NOT_FOUND", "Task not found.");

    if (!canTransitionTask(task.status, to)) {
      return commandFailureFrom(
        "TASK_INVALID_TRANSITION",
        `Cannot transition from "${task.status}" to "${to}".`,
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(normalizedId, to, nowISO);
    if (!updated) return commandFailureFrom("TASK_NOT_FOUND", "Task not found after transition.");
    return commandSuccess(updated.id, Date.now());
  }
}

export class ListTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(workspaceId: string): Promise<TaskEntity[]> {
    const normalizedId = workspaceId.trim();
    if (!normalizedId) return [];
    return this.taskRepository.findByWorkspaceId(normalizedId);
  }
}
