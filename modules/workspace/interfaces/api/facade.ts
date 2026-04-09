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
} from "../queries/workspace.queries";

export { getWorkspaceMembers } from "../queries/workspace-member.queries";
export { buildWikiContentTree } from "../queries/wiki-content-tree.queries";

export {
  authorizeWorkspaceTeam,
  createWorkspace,
  createWorkspaceLocation,
  createWorkspaceWithCapabilities,
  deleteWorkspace,
  grantIndividualWorkspaceAccess,
  mountCapabilities,
  updateWorkspaceSettings,
} from "../_actions/workspace.actions";
