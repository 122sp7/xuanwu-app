export type ApprovalTaskStatus = "draft" | "in_progress" | "qa" | "acceptance" | "accepted" | "archived" | "cancelled";
export type ApprovalIssueStatus = "open" | "fixing" | "retest" | "resolved" | "wont_fix" | "closed";

export interface ApprovalTaskLike {
  readonly id: string;
  readonly status: ApprovalTaskStatus;
}

export interface ApprovalIssueLike {
  readonly id: string;
  readonly taskId: string;
  readonly status: ApprovalIssueStatus;
}

export interface ApprovalTaskRepository {
  findById(taskId: string): Promise<ApprovalTaskLike | null>;
  updateStatus(taskId: string, to: ApprovalTaskStatus, nowISO: string): Promise<ApprovalTaskLike | null>;
}

export interface ApprovalIssueRepository {
  findById(issueId: string): Promise<ApprovalIssueLike | null>;
  countOpenByTaskId(taskId: string): Promise<number>;
  updateStatus(issueId: string, to: ApprovalIssueStatus, nowISO: string): Promise<ApprovalIssueLike | null>;
}
