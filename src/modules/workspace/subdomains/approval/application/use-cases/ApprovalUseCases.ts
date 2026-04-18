import { v4 as uuid } from "uuid";
import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ApprovalDecisionRepository } from "../../domain/repositories/ApprovalDecisionRepository";
import type { TaskRepository } from "../../../task/domain/repositories/TaskRepository";
import type { IssueRepository } from "../../../issue/domain/repositories/IssueRepository";
import { ApprovalDecision } from "../../domain/entities/ApprovalDecision";
import type { CreateApprovalDecisionInput } from "../../domain/entities/ApprovalDecision";
import { canTransitionTaskStatus } from "../../../task/domain/value-objects/TaskStatus";

export class CreateApprovalDecisionUseCase {
  constructor(
    private readonly decisionRepo: ApprovalDecisionRepository,
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute(input: CreateApprovalDecisionInput): Promise<CommandResult> {
    try {
      const task = await this.taskRepo.findById(input.taskId);
      if (!task) return commandFailureFrom("APPROVAL_TASK_NOT_FOUND", "Task not found.");
      if (task.status !== "acceptance") {
        return commandFailureFrom("APPROVAL_INVALID_STATE", `Task must be in 'acceptance' state, got '${task.status}'.`);
      }
      const decision = ApprovalDecision.create(uuid(), input);
      await this.decisionRepo.save(decision.getSnapshot());
      return commandSuccess(decision.id, Date.now());
    } catch (err) {
      return commandFailureFrom("APPROVAL_CREATE_FAILED", err instanceof Error ? err.message : "Failed to create approval decision.");
    }
  }
}

export class ApproveTaskUseCase {
  constructor(
    private readonly decisionRepo: ApprovalDecisionRepository,
    private readonly taskRepo: TaskRepository,
    private readonly issueRepo: IssueRepository,
  ) {}

  async execute(decisionId: string, comments?: string): Promise<CommandResult> {
    try {
      const snapshot = await this.decisionRepo.findById(decisionId);
      if (!snapshot) return commandFailureFrom("APPROVAL_NOT_FOUND", "Approval decision not found.");
      const task = await this.taskRepo.findById(snapshot.taskId);
      if (!task) return commandFailureFrom("APPROVAL_TASK_NOT_FOUND", "Task not found.");
      if (!canTransitionTaskStatus(task.status, "accepted")) {
        return commandFailureFrom("APPROVAL_INVALID_TRANSITION", `Cannot approve from task status '${task.status}'.`);
      }
      const openIssues = await this.issueRepo.countOpenByTaskIdAndStage(snapshot.taskId, "acceptance");
      if (openIssues > 0) {
        return commandFailureFrom("APPROVAL_HAS_OPEN_ISSUES", "Task has open acceptance-stage issues.");
      }
      const decision = ApprovalDecision.reconstitute(snapshot);
      decision.approve(comments);
      await this.decisionRepo.save(decision.getSnapshot());
      await this.taskRepo.updateStatus(snapshot.taskId, "accepted", new Date().toISOString());
      return commandSuccess(decisionId, Date.now());
    } catch (err) {
      return commandFailureFrom("APPROVAL_FAILED", err instanceof Error ? err.message : "Failed to approve task.");
    }
  }
}

export class RejectApprovalUseCase {
  constructor(
    private readonly decisionRepo: ApprovalDecisionRepository,
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute(decisionId: string, comments?: string): Promise<CommandResult> {
    try {
      const snapshot = await this.decisionRepo.findById(decisionId);
      if (!snapshot) return commandFailureFrom("APPROVAL_NOT_FOUND", "Approval decision not found.");
      const decision = ApprovalDecision.reconstitute(snapshot);
      decision.reject(comments);
      await this.decisionRepo.save(decision.getSnapshot());
      await this.taskRepo.updateStatus(snapshot.taskId, "qa", new Date().toISOString());
      return commandSuccess(decisionId, Date.now());
    } catch (err) {
      return commandFailureFrom("APPROVAL_REJECT_FAILED", err instanceof Error ? err.message : "Failed to reject approval.");
    }
  }
}

export class ListApprovalDecisionsUseCase {
  constructor(private readonly decisionRepo: ApprovalDecisionRepository) {}

  async execute(workspaceId: string): Promise<import("../../domain/entities/ApprovalDecision").ApprovalDecisionSnapshot[]> {
    return this.decisionRepo.findByWorkspaceId(workspaceId);
  }
}
