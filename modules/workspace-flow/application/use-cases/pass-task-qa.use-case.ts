/**
 * @module workspace-flow/application/use-cases
 * @file pass-task-qa.use-case.ts
 * @description Use case: Pass a task's QA review (qa → acceptance). Requires no open issues.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit TaskQaPassedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import type { IssueRepository } from "../../domain/repositories/IssueRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { hasNoOpenIssues } from "../../domain/services/task-guards";

export class PassTaskQaUseCase {
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

    const guard = evaluateTaskTransition(task.status, "acceptance");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    const openIssues = await this.issueRepository.countOpenByTaskId(taskId);
    if (!hasNoOpenIssues(openIssues)) {
      return commandFailureFrom(
        "WF_TASK_HAS_OPEN_ISSUES",
        "Task cannot advance: there are open issues that must be resolved first.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "acceptance", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
