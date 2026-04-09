import type { WorkspaceMemberView } from "../dtos/workspace-member-view.dto";
import type { WorkspaceQueryRepository } from "../../ports/output/WorkspaceQueryRepository";

export class FetchWorkspaceMembersUseCase {
  constructor(private readonly workspaceQueryRepo: WorkspaceQueryRepository) {}

  execute(workspaceId: string): Promise<WorkspaceMemberView[]> {
    return this.workspaceQueryRepo.getWorkspaceMembers(workspaceId);
  }
}
