import { v4 as uuid } from "@lib-uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { Task } from "../../domain/entities/Task";
import type { CreateTaskInput, UpdateTaskInput } from "../../domain/entities/Task";
import { canTransitionTaskStatus } from "../../domain/value-objects/TaskStatus";
import type { TaskStatus } from "../../domain/value-objects/TaskStatus";

export class CreateTaskUseCase {
  constructor(private readonly taskRepo: TaskRepository) {}

  async execute(input: CreateTaskInput): Promise<CommandResult> {
    try {
      if (!input.workspaceId || !input.title.trim()) {
        return commandFailureFrom("TASK_INVALID_INPUT", "workspaceId and title are required.");
      }
      const task = Task.create(uuid(), input);
      await this.taskRepo.save(task.getSnapshot());
      return commandSuccess(task.id, Date.now());
    } catch (err) {
      return commandFailureFrom("TASK_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create task.");
    }
  }
}

export class UpdateTaskUseCase {
  constructor(private readonly taskRepo: TaskRepository) {}

  async execute(taskId: string, input: UpdateTaskInput): Promise<CommandResult> {
    try {
      const snapshot = await this.taskRepo.findById(taskId);
      if (!snapshot) return commandFailureFrom("TASK_NOT_FOUND", "Task not found.");
      const task = Task.reconstitute(snapshot);
      task.update(input);
      await this.taskRepo.save(task.getSnapshot());
      return commandSuccess(taskId, Date.now());
    } catch (err) {
      return commandFailureFrom("TASK_UPDATE_FAILED", err instanceof Error ? err.message : "Failed to update task.");
    }
  }
}

export class TransitionTaskStatusUseCase {
  constructor(private readonly taskRepo: TaskRepository) {}

  async execute(taskId: string, to: TaskStatus): Promise<CommandResult> {
    try {
      const snapshot = await this.taskRepo.findById(taskId);
      if (!snapshot) return commandFailureFrom("TASK_NOT_FOUND", "Task not found.");
      if (!canTransitionTaskStatus(snapshot.status, to)) {
        return commandFailureFrom("TASK_INVALID_TRANSITION", `Cannot transition from '${snapshot.status}' to '${to}'.`);
      }
      const task = Task.reconstitute(snapshot);
      task.transition(to);
      await this.taskRepo.save(task.getSnapshot());
      return commandSuccess(taskId, Date.now());
    } catch (err) {
      return commandFailureFrom("TASK_TRANSITION_FAILED", err instanceof Error ? err.message : "Failed to transition task.");
    }
  }
}

export class DeleteTaskUseCase {
  constructor(private readonly taskRepo: TaskRepository) {}

  async execute(taskId: string): Promise<CommandResult> {
    try {
      const existing = await this.taskRepo.findById(taskId);
      if (!existing) return commandFailureFrom("TASK_NOT_FOUND", "Task not found.");
      await this.taskRepo.delete(taskId);
      return commandSuccess(taskId, Date.now());
    } catch (err) {
      return commandFailureFrom("TASK_DELETE_FAILED", err instanceof Error ? err.message : "Failed to delete task.");
    }
  }
}
