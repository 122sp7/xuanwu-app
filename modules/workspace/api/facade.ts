/**
 * workspace api/facade.ts
 *
 * Canonical public behavior surface for the workspace bounded context.
 * Cross-module and app-layer consumers invoke commands and queries from here.
 *
 * Internal source: interfaces/api/facades/
 */

export {
  getWorkspacesForAccount,
  subscribeToWorkspacesForAccount,
  getWorkspaceById,
  getWorkspaceByIdForAccount,
  buildWikiContentTree,
  authorizeWorkspaceTeam,
  createWorkspace,
  createWorkspaceLocation,
  createWorkspaceWithCapabilities,
  deleteWorkspace,
  grantIndividualWorkspaceAccess,
  mountCapabilities,
  updateWorkspaceSettings,
} from "../interfaces/api/facades/workspace.facade";

export {
  getWorkspaceMembers,
} from "../interfaces/api/facades/workspace-member.facade";
