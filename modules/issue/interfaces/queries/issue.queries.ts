import type { WorkspaceIssueEntity } from "../../domain/entities/Issue";
import { ListWorkspaceIssuesUseCase } from "../../application/use-cases/issue.use-cases";
import { FirebaseIssueRepository } from "../../infrastructure/firebase/FirebaseIssueRepository";

export async function getWorkspaceIssues(workspaceId: string): Promise<WorkspaceIssueEntity[]> {
  const issueRepository = new FirebaseIssueRepository();
  const listWorkspaceIssuesUseCase = new ListWorkspaceIssuesUseCase(issueRepository);
  return listWorkspaceIssuesUseCase.execute(workspaceId);
}
