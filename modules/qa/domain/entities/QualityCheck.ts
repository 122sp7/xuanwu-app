export type WorkspaceQualityCheckStatus = "pass" | "warn" | "fail";

export interface WorkspaceQualityCheckEntity {
  readonly id: string;
  readonly workspaceId: string;
  readonly label: string;
  readonly detail: string;
  readonly status: WorkspaceQualityCheckStatus;
  readonly source: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateWorkspaceQualityCheckInput {
  readonly workspaceId: string;
  readonly label: string;
  readonly detail?: string;
  readonly status?: WorkspaceQualityCheckStatus;
  readonly source?: string;
}

export interface UpdateWorkspaceQualityCheckInput {
  readonly label?: string;
  readonly detail?: string;
  readonly status?: WorkspaceQualityCheckStatus;
  readonly source?: string;
}
