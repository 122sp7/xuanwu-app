import type { IssueEntity, CreateIssueInput, UpdateIssueInput } from "../entities/Issue";
import type { IssueLifecycleStatus } from "../value-objects/issue-state";

export interface IssueRepository {
  create(input: CreateIssueInput): Promise<IssueEntity>;
  update(issueId: string, input: UpdateIssueInput): Promise<IssueEntity | null>;
  delete(issueId: string): Promise<void>;
  findById(issueId: string): Promise<IssueEntity | null>;
  findByWorkspaceId(workspaceId: string): Promise<IssueEntity[]>;
  /** Persists a lifecycle status transition; stamps resolvedAtISO when to==="resolved". */
  transitionStatus(issueId: string, to: IssueLifecycleStatus, nowISO: string): Promise<IssueEntity | null>;
}
