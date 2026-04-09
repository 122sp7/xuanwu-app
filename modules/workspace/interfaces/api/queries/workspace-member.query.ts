import type { WorkspaceMemberView } from "../contracts";
import { workspaceQueryPort } from "../runtime";

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]> {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) {
    return [];
  }

  return workspaceQueryPort.getWorkspaceMembers(normalizedWorkspaceId);
}
