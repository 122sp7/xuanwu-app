/**
 * @module workspace-flow/application/use-cases
 * @file assign-task.use-case.ts
 * @description Use case: Assign a task to a user and transition status to in_progress.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add permission check for assignee
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";

export class AssignTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string, assigneeId: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }
    if (!assigneeId.trim()) {
      return commandFailureFrom("WF_TASK_ASSIGNEE_REQUIRED", "Assignee id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "in_progress");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    // Persist the assignee before transitioning status
    await this.taskRepository.update(taskId, { assigneeId: assigneeId.trim() });

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "in_progress", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
