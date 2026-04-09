import type { WorkspaceEntity } from "../../domain/aggregates/Workspace";
import type { WorkspaceMemberView } from "../../application/dtos/workspace-member-view.dto";
import type {
  WikiAccountContentNode,
  WikiAccountSeed,
} from "../../application/dtos/wiki-content-tree.dto";

export type WorkspaceQuerySubscription = () => void;

export interface WorkspaceQueryPort {
  getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]>;
  subscribeToWorkspacesForAccount(
    accountId: string,
    onUpdate: (workspaces: WorkspaceEntity[]) => void,
  ): WorkspaceQuerySubscription;
  getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null>;
  getWorkspaceByIdForAccount(
    accountId: string,
    workspaceId: string,
  ): Promise<WorkspaceEntity | null>;
  getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMemberView[]>;
  buildWikiContentTree(seeds: WikiAccountSeed[]): Promise<WikiAccountContentNode[]>;
}