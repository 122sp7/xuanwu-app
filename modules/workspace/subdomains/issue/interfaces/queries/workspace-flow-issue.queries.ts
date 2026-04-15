import type { Issue } from "../../application/dto/workflow.dto";
import { makeIssueRepo } from "../../api/factories";

export async function getWorkspaceFlowIssues(taskId: string): Promise<Issue[]> {
  return makeIssueRepo().findByTaskId(taskId);
}

export async function getWorkspaceFlowIssue(issueId: string): Promise<Issue | null> {
  return makeIssueRepo().findById(issueId);
}
