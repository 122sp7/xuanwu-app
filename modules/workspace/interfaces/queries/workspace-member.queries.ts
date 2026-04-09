import type { WorkspaceMemberView } from "../api/contracts";
import { FetchWorkspaceMembersUseCase } from "../../application/use-cases/workspace-member.use-cases";
import { FirebaseWorkspaceQueryRepository } from "../../infrastructure/firebase/FirebaseWorkspaceQueryRepository";

const workspaceQueryRepo = new FirebaseWorkspaceQueryRepository();
const fetchWorkspaceMembersUseCase = new FetchWorkspaceMembersUseCase(workspaceQueryRepo);

export async function getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]> {
  const normalizedWorkspaceId = workspaceId.trim();
  if (!normalizedWorkspaceId) {
    return [];
  }

  return fetchWorkspaceMembersUseCase.execute(normalizedWorkspaceId);
}
