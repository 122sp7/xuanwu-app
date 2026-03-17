/**
 * WorkspaceQueryRepository — Port for workspace read projections.
 */

import type { WorkspaceMemberView } from "../entities/WorkspaceMember";

export interface WorkspaceQueryRepository {
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]>;
}
