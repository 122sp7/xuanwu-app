/**
 * WorkspaceQueryRepository — Port for workspace read projections.
 */

import type { WorkspaceMemberView } from "../entities/WorkspaceMember";
import type { WorkspaceEntity } from "../entities/Workspace";

export type Unsubscribe = () => void;

export interface WorkspaceQueryRepository {
  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ): Unsubscribe;
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]>;
}
