import type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WorkspaceEntity,
} from "../contracts";
import * as workspaceQueries from "../queries/workspace.query";
import * as wikiContentTreeQuery from "../queries/wiki-content-tree.query";

export async function getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]> {
  return workspaceQueries.getWorkspacesForAccount(accountId);
}

export function subscribeToWorkspacesForAccount(
  accountId: string,
  onUpdate: (workspaces: WorkspaceEntity[]) => void,
) {
  return workspaceQueries.subscribeToWorkspacesForAccount(accountId, onUpdate);
}

export async function getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null> {
  return workspaceQueries.getWorkspaceById(workspaceId);
}

export async function getWorkspaceByIdForAccount(
  accountId: string,
  workspaceId: string,
): Promise<WorkspaceEntity | null> {
  return workspaceQueries.getWorkspaceByIdForAccount(accountId, workspaceId);
}

export function buildWikiContentTree(
  seeds: WikiAccountSeed[],
): Promise<WikiAccountContentNode[]> {
  return wikiContentTreeQuery.buildWikiContentTree(seeds);
}

export {
  authorizeWorkspaceTeam,
  createWorkspace,
  createWorkspaceLocation,
  createWorkspaceWithCapabilities,
  deleteWorkspace,
  grantIndividualWorkspaceAccess,
  mountCapabilities,
  updateWorkspaceSettings,
} from "../actions/workspace.command";
