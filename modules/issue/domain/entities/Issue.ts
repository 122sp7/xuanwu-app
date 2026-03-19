export type WorkspaceIssueSeverity = "low" | "medium" | "high";
export type WorkspaceIssueStatus = "open" | "in-progress" | "resolved";

export interface WorkspaceIssueEntity {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly detail: string;
  readonly severity: WorkspaceIssueSeverity;
  readonly status: WorkspaceIssueStatus;
  readonly source: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateWorkspaceIssueInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly detail?: string;
  readonly severity?: WorkspaceIssueSeverity;
  readonly source?: string;
}

export interface UpdateWorkspaceIssueInput {
  readonly title?: string;
  readonly detail?: string;
  readonly severity?: WorkspaceIssueSeverity;
  readonly status?: WorkspaceIssueStatus;
  readonly source?: string;
}
