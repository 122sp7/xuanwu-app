import type {
  WikiAccountContentNode,
  WikiAccountSeed,
  WorkspaceEntity,
} from "../contracts";
import {
  getWorkspaceById as getWorkspaceByIdQuery,
  getWorkspaceByIdForAccount as getWorkspaceByIdForAccountQuery,
  getWorkspacesForAccount as getWorkspacesForAccountQuery,
  subscribeToWorkspacesForAccount as subscribeToWorkspacesForAccountQuery,
} from "../queries/workspace.query";
import { buildWikiContentTree as buildWikiContentTreeQuery } from "../queries/wiki-content-tree.query";

export async function getWorkspacesForAccount(accountId: string): Promise<WorkspaceEntity[]> {
  return getWorkspacesForAccountQuery(accountId);
}

export function subscribeToWorkspacesForAccount(
  accountId: string,
  onUpdate: (workspaces: WorkspaceEntity[]) => void,
) {
  return subscribeToWorkspacesForAccountQuery(accountId, onUpdate);
}

export async function getWorkspaceById(workspaceId: string): Promise<WorkspaceEntity | null> {
  return getWorkspaceByIdQuery(workspaceId);
}

export async function getWorkspaceByIdForAccount(
  accountId: string,
  workspaceId: string,
): Promise<WorkspaceEntity | null> {
  return getWorkspaceByIdForAccountQuery(accountId, workspaceId);
}

export function buildWikiContentTree(
  seeds: WikiAccountSeed[],
): Promise<WikiAccountContentNode[]> {
  return buildWikiContentTreeQuery(seeds);
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
