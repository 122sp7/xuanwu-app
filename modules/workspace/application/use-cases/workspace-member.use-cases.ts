import type { WorkspaceMemberView } from "../../domain/entities/WorkspaceMember";
import type { WorkspaceQueryRepository } from "../../domain/repositories/WorkspaceQueryRepository";

export class FetchWorkspaceMembersUseCase {
  constructor(private readonly workspaceQueryRepo: WorkspaceQueryRepository) {}

  execute(workspaceId: string): Promise<WorkspaceMemberView[]> {
    return this.workspaceQueryRepo.getWorkspaceMembers(workspaceId);
  }
}
