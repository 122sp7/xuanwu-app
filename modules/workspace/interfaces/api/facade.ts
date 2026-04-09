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
} from "./workspace.queries";

export { getWorkspaceMembers } from "./workspace-member.queries";
export { buildWikiContentTree } from "./wiki-content-tree.queries";

export {
  authorizeWorkspaceTeam,
  createWorkspace,
  createWorkspaceLocation,
  createWorkspaceWithCapabilities,
  deleteWorkspace,
  grantIndividualWorkspaceAccess,
  mountCapabilities,
  updateWorkspaceSettings,
} from "./workspace.actions";
