/**
 * WorkspaceQueryRepository — Port for workspace read projections.
 */

import type { WorkspaceMemberView } from "../../domain/entities/WorkspaceMemberView";
import type { WorkspaceEntity } from "../../domain/aggregates/Workspace";

export type Unsubscribe = () => void;

export interface WorkspaceQueryRepository {
  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ): Unsubscribe;
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]>;
}
