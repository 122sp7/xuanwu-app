/**
 * @module workspace-flow/application/use-cases
 * @file submit-task-to-qa.use-case.ts
 * @description Use case: Submit a task for QA review (in_progress → qa).
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Add pre-submission checks (e.g. assignee present)
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../../task/domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../../task/domain/services/task-transition-policy";

export class SubmitTaskToQaUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(taskId: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "qa");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "qa", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
 
