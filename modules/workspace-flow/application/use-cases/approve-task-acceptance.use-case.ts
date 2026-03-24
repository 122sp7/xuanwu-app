/**
 * @module workspace-flow/application/use-cases
 * @file approve-task-acceptance.use-case.ts
 * @description Use case: Approve a task at acceptance stage (acceptance → accepted). Requires no open issues.
 * @author workspace-flow
 * @created 2026-03-24
 * @todo Emit TaskAcceptanceApprovedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { hasNoOpenIssues } from "../../domain/services/task-guards";

export class ApproveTaskAcceptanceUseCase {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly issueRepository: IssueRepository,
  ) {}

  async execute(taskId: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "accepted");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    const openIssues = await this.issueRepository.countOpenByTaskId(taskId);
    if (!hasNoOpenIssues(openIssues)) {
      return commandFailureFrom(
        "WF_TASK_HAS_OPEN_ISSUES",
        "Task cannot be accepted: there are open issues that must be resolved first.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "accepted", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
