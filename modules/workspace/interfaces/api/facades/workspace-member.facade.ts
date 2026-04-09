import type { WorkspaceMemberView } from "../contracts";
import * as workspaceMemberQuery from "../queries/workspace-member.query";

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]> {
  return workspaceMemberQuery.getWorkspaceMembers(workspaceId);
}
