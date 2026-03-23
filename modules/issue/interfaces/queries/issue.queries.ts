import type { IssueEntity } from "../../domain/entities/Issue";
import { ListIssuesUseCase } from "../../application/use-cases/issue.use-cases";
import { FirebaseIssueRepository } from "../../infrastructure/firebase/FirebaseIssueRepository";

export async function getIssues(workspaceId: string): Promise<IssueEntity[]> {
  return new ListIssuesUseCase(new FirebaseIssueRepository()).execute(workspaceId);
}
