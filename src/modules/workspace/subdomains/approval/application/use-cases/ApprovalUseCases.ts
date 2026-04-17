import { commandSuccess, commandFailureFrom, type CommandResult } from "../../../../../shared";
import type { ApprovalTaskRepository, ApprovalIssueRepository, ApprovalTaskStatus, ApprovalIssueStatus } from "../../domain/repositories/ApprovalRepository";

function canTransitionTask(from: ApprovalTaskStatus, to: ApprovalTaskStatus): boolean {
  const map: Record<ApprovalTaskStatus, readonly ApprovalTaskStatus[]> = {
    draft: ["in_progress"],
    in_progress: ["qa", "cancelled"],
    qa: ["acceptance", "in_progress"],
    acceptance: ["accepted", "qa"],
    accepted: ["archived"],
    archived: [],
    cancelled: [],
  };
  return map[from]?.includes(to) ?? false;
}

function canTransitionIssue(from: ApprovalIssueStatus, to: ApprovalIssueStatus): boolean {
  const map: Record<ApprovalIssueStatus, readonly ApprovalIssueStatus[]> = {
    open: ["fixing", "wont_fix"],
    fixing: ["retest"],
    retest: ["resolved", "fixing"],
    resolved: ["closed"],
    wont_fix: ["closed"],
    closed: [],
  };
  return map[from]?.includes(to) ?? false;
}

export class ApproveTaskAcceptanceUseCase {
  constructor(
    private readonly taskRepo: ApprovalTaskRepository,
    private readonly issueRepo: ApprovalIssueRepository,
  ) {}
  async execute(taskId: string): Promise<CommandResult> {
    try {
      const task = await this.taskRepo.findById(taskId);
      if (!task) return commandFailureFrom("APPROVAL_TASK_NOT_FOUND", "Task not found.");
      if (!canTransitionTask(task.status, "accepted")) return commandFailureFrom("APPROVAL_INVALID_TRANSITION", `Cannot approve from '${task.status}'.`);
      const openIssues = await this.issueRepo.countOpenByTaskId(taskId);
      if (openIssues > 0) return commandFailureFrom("APPROVAL_HAS_OPEN_ISSUES", "Task has open issues.");
      await this.taskRepo.updateStatus(taskId, "accepted", new Date().toISOString());
      return commandSuccess(taskId, Date.now());
    } catch (err) {
      return commandFailureFrom("APPROVAL_FAILED", err instanceof Error ? err.message : "Failed to approve task.");
    }
  }
}

export class SubmitIssueRetestUseCase {
  constructor(private readonly issueRepo: ApprovalIssueRepository) {}
  async execute(issueId: string): Promise<CommandResult> {
    try {
      const issue = await this.issueRepo.findById(issueId);
      if (!issue) return commandFailureFrom("APPROVAL_ISSUE_NOT_FOUND", "Issue not found.");
      if (!canTransitionIssue(issue.status, "retest")) return commandFailureFrom("APPROVAL_INVALID_TRANSITION", `Cannot submit retest from '${issue.status}'.`);
      await this.issueRepo.updateStatus(issueId, "retest", new Date().toISOString());
      return commandSuccess(issueId, Date.now());
    } catch (err) {
      return commandFailureFrom("APPROVAL_RETEST_FAILED", err instanceof Error ? err.message : "Failed.");
    }
  }
}

export class PassIssueRetestUseCase {
  constructor(private readonly issueRepo: ApprovalIssueRepository) {}
  async execute(issueId: string): Promise<CommandResult> {
    try {
      const issue = await this.issueRepo.findById(issueId);
      if (!issue) return commandFailureFrom("APPROVAL_ISSUE_NOT_FOUND", "Issue not found.");
      if (!canTransitionIssue(issue.status, "resolved")) return commandFailureFrom("APPROVAL_INVALID_TRANSITION", `Cannot pass retest from '${issue.status}'.`);
      await this.issueRepo.updateStatus(issueId, "resolved", new Date().toISOString());
      return commandSuccess(issueId, Date.now());
    } catch (err) {
      return commandFailureFrom("APPROVAL_RETEST_PASS_FAILED", err instanceof Error ? err.message : "Failed.");
    }
  }
}

export class FailIssueRetestUseCase {
  constructor(private readonly issueRepo: ApprovalIssueRepository) {}
  async execute(issueId: string): Promise<CommandResult> {
    try {
      const issue = await this.issueRepo.findById(issueId);
      if (!issue) return commandFailureFrom("APPROVAL_ISSUE_NOT_FOUND", "Issue not found.");
      if (!canTransitionIssue(issue.status, "fixing")) return commandFailureFrom("APPROVAL_INVALID_TRANSITION", `Cannot fail retest from '${issue.status}'.`);
      await this.issueRepo.updateStatus(issueId, "fixing", new Date().toISOString());
      return commandSuccess(issueId, Date.now());
    } catch (err) {
      return commandFailureFrom("APPROVAL_RETEST_FAIL_FAILED", err instanceof Error ? err.message : "Failed.");
    }
  }
}
