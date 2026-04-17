import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { QualityTaskRepository } from "../../domain/repositories/QualityTaskRepository";
import { canTransitionTaskStatus } from "../../../task/domain/value-objects/TaskStatus";

export class SubmitTaskToQaUseCase {
  constructor(private readonly taskRepo: QualityTaskRepository) {}
  async execute(taskId: string): Promise<CommandResult> {
    try {
      const task = await this.taskRepo.findById(taskId);
      if (!task) return commandFailureFrom("QA_TASK_NOT_FOUND", "Task not found.");
      if (!canTransitionTaskStatus(task.status, "qa")) {
        return commandFailureFrom("QA_INVALID_TRANSITION", `Cannot submit from '${task.status}' to QA.`);
      }
      await this.taskRepo.updateStatus(taskId, "qa", new Date().toISOString());
      return commandSuccess(taskId, Date.now());
    } catch (err) {
      return commandFailureFrom("QA_SUBMIT_FAILED", err instanceof Error ? err.message : "Failed.");
    }
  }
}

export class PassTaskQaUseCase {
  constructor(private readonly taskRepo: QualityTaskRepository) {}
  async execute(taskId: string): Promise<CommandResult> {
    try {
      const task = await this.taskRepo.findById(taskId);
      if (!task) return commandFailureFrom("QA_TASK_NOT_FOUND", "Task not found.");
      if (!canTransitionTaskStatus(task.status, "acceptance")) {
        return commandFailureFrom("QA_INVALID_TRANSITION", `Cannot pass QA from '${task.status}'.`);
      }
      await this.taskRepo.updateStatus(taskId, "acceptance", new Date().toISOString());
      return commandSuccess(taskId, Date.now());
    } catch (err) {
      return commandFailureFrom("QA_PASS_FAILED", err instanceof Error ? err.message : "Failed.");
    }
  }
}
