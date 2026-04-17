import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { TaskRepository } from "../../../task/domain/repositories/TaskRepository";
import { canTransitionTaskStatus } from "../../../task/domain/value-objects/TaskStatus";
import type { TaskStatus } from "../../../task/domain/value-objects/TaskStatus";
import type { IssueRepository } from "../../../issue/domain/repositories/IssueRepository";
import type { IssueStage } from "../../../issue/domain/value-objects/IssueStage";

const STAGE_TO_STATUS: Record<IssueStage, TaskStatus> = {
  task: "in_progress",
  qa: "qa",
  acceptance: "acceptance",
};

export interface ResumeTaskFlowInput {
  readonly taskId: string;
  readonly stage: IssueStage;
}

/**
 * ResumeTaskFlowUseCase
 *
 * After an issue is resolved, this use case checks that no open issues remain
 * for the given stage, then re-enters the task into the stage that was blocked.
 *
 * Guard: if open issues still exist for the stage, resume is rejected.
 */
export class ResumeTaskFlowUseCase {
  constructor(
    private readonly taskRepo: TaskRepository,
    private readonly issueRepo: IssueRepository,
  ) {}

  async execute(input: ResumeTaskFlowInput): Promise<CommandResult> {
    try {
      const { taskId, stage } = input;

      const openCount = await this.issueRepo.countOpenByTaskIdAndStage(taskId, stage);
      if (openCount > 0) {
        return commandFailureFrom(
          "RESUME_HAS_OPEN_ISSUES",
          `Cannot resume task at stage '${stage}': ${openCount} open issue(s) remain.`,
        );
      }

      const snapshot = await this.taskRepo.findById(taskId);
      if (!snapshot) return commandFailureFrom("RESUME_TASK_NOT_FOUND", "Task not found.");

      const targetStatus = STAGE_TO_STATUS[stage];
      if (!canTransitionTaskStatus(snapshot.status, targetStatus)) {
        return commandFailureFrom(
          "RESUME_INVALID_TRANSITION",
          `Cannot resume task from '${snapshot.status}' to '${targetStatus}'.`,
        );
      }

      await this.taskRepo.updateStatus(taskId, targetStatus, new Date().toISOString());
      return commandSuccess(taskId, Date.now());
    } catch (err) {
      return commandFailureFrom(
        "RESUME_FAILED",
        err instanceof Error ? err.message : "Failed to resume task flow.",
      );
    }
  }
}
