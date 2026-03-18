import type {
  CreateWorkspaceIssueInput,
  UpdateWorkspaceIssueInput,
  WorkspaceIssueEntity,
} from "../entities/Issue";

export interface IssueRepository {
  create(input: CreateWorkspaceIssueInput): Promise<WorkspaceIssueEntity>;
  update(issueId: string, input: UpdateWorkspaceIssueInput): Promise<WorkspaceIssueEntity | null>;
  delete(issueId: string): Promise<void>;
  findByWorkspaceId(workspaceId: string): Promise<WorkspaceIssueEntity[]>;
}
