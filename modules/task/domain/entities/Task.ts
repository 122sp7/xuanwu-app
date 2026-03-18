export type WorkspaceTaskStatus = "pending" | "in-progress" | "completed";
export type WorkspaceTaskPriority = "low" | "medium" | "high";

export interface WorkspaceTaskEntity {
  readonly id: string;
  readonly workspaceId: string;
  readonly title: string;
  readonly description: string;
  readonly status: WorkspaceTaskStatus;
  readonly priority: WorkspaceTaskPriority;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
  readonly createdAtISO: string;
  readonly updatedAtISO: string;
}

export interface CreateWorkspaceTaskInput {
  readonly workspaceId: string;
  readonly title: string;
  readonly description?: string;
  readonly priority?: WorkspaceTaskPriority;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}

export interface UpdateWorkspaceTaskInput {
  readonly title?: string;
  readonly description?: string;
  readonly status?: WorkspaceTaskStatus;
  readonly priority?: WorkspaceTaskPriority;
  readonly assigneeId?: string;
  readonly dueDateISO?: string;
}
