/**
 * WorkspaceQueryRepository — Port for workspace read projections.
 */

import type { WorkspaceMemberView } from "../../application/dtos/workspace-member-view.dto";
import type { WorkspaceEntity } from "../../domain/aggregates/Workspace";

export type Unsubscribe = () => void;

export interface WorkspaceQueryRepository {
  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ): Unsubscribe;
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]>;
}
