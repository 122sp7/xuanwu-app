import type { IssueSnapshot } from "../entities/Issue";
import type { IssueStatus } from "../value-objects/IssueStatus";

export interface IssueRepository {
  findById(issueId: string): Promise<IssueSnapshot | null>;
  findByTaskId(taskId: string): Promise<IssueSnapshot[]>;
  countOpenByTaskId(taskId: string): Promise<number>;
  save(issue: IssueSnapshot): Promise<void>;
  updateStatus(issueId: string, to: IssueStatus, nowISO: string): Promise<IssueSnapshot | null>;
  delete(issueId: string): Promise<void>;
}
