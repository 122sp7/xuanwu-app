/**
 * workspace API facade.
 *
 * Public behavior entrypoints (commands/queries) exposed to callers.
 */

export {
  getWorkspaceById,
  getWorkspaceByIdForAccount,
  getWorkspacesForAccount,
  subscribeToWorkspacesForAccount,
} from "../interfaces/queries/workspace.queries";

export { getWorkspaceMembers } from "../interfaces/queries/workspace-member.queries";
export { buildWikiContentTree } from "../interfaces/queries/wiki-content-tree.queries";

export {
  authorizeWorkspaceTeam,
  createWorkspace,
  createWorkspaceLocation,
  createWorkspaceWithCapabilities,
  deleteWorkspace,
  grantIndividualWorkspaceAccess,
  mountCapabilities,
  updateWorkspaceSettings,
} from "../interfaces/_actions/workspace.actions";
