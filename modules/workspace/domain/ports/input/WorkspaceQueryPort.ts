import type { WorkspaceEntity } from "../../aggregates/Workspace";
import type { WorkspaceMemberView } from "../../entities/WorkspaceMemberView";
import type {
  WikiAccountContentNode,
  WikiAccountSeed,
} from "../../entities/WikiContentTree";

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
