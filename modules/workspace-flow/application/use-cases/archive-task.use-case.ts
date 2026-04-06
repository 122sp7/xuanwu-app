/**
 * @module workspace-flow/application/use-cases
 * @file archive-task.use-case.ts
 * @description Use case: Archive a task (accepted → archived). Requires invoice closed or none.
 * @author workspace-flow
 * @since 2026-03-24
 * @todo Emit TaskArchivedEvent to event bus
 */

import { commandFailureFrom, commandSuccess, type CommandResult } from "@shared-types";
import type { TaskRepository } from "../../domain/repositories/TaskRepository";
import { evaluateTaskTransition } from "../../domain/services/task-transition-policy";
import { invoiceAllowsArchive } from "../../domain/services/task-guards";

export class ArchiveTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  /**
   * @param taskId       - ID of the task to archive
   * @param invoiceStatus - Status of the linked invoice, or undefined if none
   */
  async execute(taskId: string, invoiceStatus?: string): Promise<CommandResult> {
    if (!taskId.trim()) {
      return commandFailureFrom("WF_TASK_ID_REQUIRED", "Task id is required.");
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found.");
    }

    const guard = evaluateTaskTransition(task.status, "archived");
    if (!guard.allowed) {
      return commandFailureFrom("WF_TASK_INVALID_TRANSITION", guard.reason);
    }

    if (!invoiceAllowsArchive(invoiceStatus)) {
      return commandFailureFrom(
        "WF_TASK_INVOICE_NOT_CLOSED",
        "Task cannot be archived: the linked invoice must be closed first.",
      );
    }

    const nowISO = new Date().toISOString();
    const updated = await this.taskRepository.transitionStatus(taskId, "archived", nowISO);
    if (!updated) {
      return commandFailureFrom("WF_TASK_NOT_FOUND", "Task not found after transition.");
    }
    return commandSuccess(updated.id, Date.now());
  }
}
