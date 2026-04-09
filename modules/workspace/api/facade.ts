/**
 * workspace public behavior boundary.
 */

export {
	buildWikiContentTree,
	getWorkspaceById,
	getWorkspaceByIdForAccount,
	getWorkspacesForAccount,
	subscribeToWorkspacesForAccount,
	authorizeWorkspaceTeam,
	createWorkspace,
	createWorkspaceLocation,
	createWorkspaceWithCapabilities,
	deleteWorkspace,
	grantIndividualWorkspaceAccess,
	mountCapabilities,
	updateWorkspaceSettings,
} from "../interfaces/api/facades/workspace.facade";

export { getWorkspaceMembers } from "../interfaces/api/facades/workspace-member.facade";