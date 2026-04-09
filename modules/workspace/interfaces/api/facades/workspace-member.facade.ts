import type { WorkspaceMemberView } from "../contracts";
import { getWorkspaceMembers as getWorkspaceMembersQuery } from "../queries/workspace-member.query";

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]> {
	return getWorkspaceMembersQuery(workspaceId);
}