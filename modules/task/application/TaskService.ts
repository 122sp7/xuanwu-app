import type { CommandResult } from "@/shared/types";
import type { TaskEntity } from "../domain/TaskEntity";
import type { TaskRepository } from "../domain/repositories/TaskRepository";

export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async getTaskById(id: string): Promise<TaskEntity | null> {
    return this.taskRepository.findById(id);
  }

  async getAllTasks(): Promise<TaskEntity[]> {
    return this.taskRepository.findAll();
  }
}

// ─── Use Cases ────────────────────────────────────────────────────────────────

import { commandSuccess, commandFailureFrom } from "@/shared/types";

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: {
    title: string;
    description?: string;
  }): Promise<CommandResult> {
    try {
      const task: TaskEntity = {
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description,
        status: "todo",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await this.taskRepository.save(task);
      return commandSuccess(task.id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "TASK_CREATE_FAILED",
        err instanceof Error ? err.message : "Failed to create task",
      );
    }
  }
}

export class UpdateTaskStatusUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(
    id: string,
    status: TaskEntity["status"],
  ): Promise<CommandResult> {
    try {
      const task = await this.taskRepository.findById(id);
      if (!task) {
        return commandFailureFrom("TASK_NOT_FOUND", `Task ${id} not found`);
      }
      await this.taskRepository.save({ ...task, status, updatedAt: new Date() });
      return commandSuccess(id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "TASK_UPDATE_FAILED",
        err instanceof Error ? err.message : "Failed to update task",
      );
    }
  }
}

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string): Promise<CommandResult> {
    try {
      const task = await this.taskRepository.findById(id);
      if (!task) {
        return commandFailureFrom("TASK_NOT_FOUND", `Task ${id} not found`);
      }
      await this.taskRepository.delete(id);
      return commandSuccess(id, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "TASK_DELETE_FAILED",
        err instanceof Error ? err.message : "Failed to delete task",
      );
    }
  }
}
