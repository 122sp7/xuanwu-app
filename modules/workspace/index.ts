/**
 * workspace module public API
 */
export type {
  WorkspaceEntity,
  WorkspaceLifecycleState,
  WorkspaceVisibility,
  WorkspacePersonnel,
  CapabilitySpec,
  Capability,
  Address,
  WorkspaceLocation,
  WorkspaceGrant,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
} from "./domain/entities/Workspace";
export type {
  WorkspaceMemberView,
  WorkspaceMemberPresence,
  WorkspaceMemberAccessChannel,
  WorkspaceMemberAccessSource,
} from "./domain/entities/WorkspaceMember";
export type { WorkspaceRepository } from "./domain/repositories/WorkspaceRepository";
export type { WorkspaceQueryRepository } from "./domain/repositories/WorkspaceQueryRepository";
export {
  CreateWorkspaceUseCase,
  CreateWorkspaceWithCapabilitiesUseCase,
  UpdateWorkspaceSettingsUseCase,
  DeleteWorkspaceUseCase,
  MountCapabilitiesUseCase,
  GrantTeamAccessUseCase,
  GrantIndividualAccessUseCase,
  CreateWorkspaceLocationUseCase,
} from "./application/use-cases/workspace.use-cases";
export { FetchWorkspaceMembersUseCase } from "./application/use-cases/workspace-member.use-cases";
export { FirebaseWorkspaceRepository } from "./infrastructure/firebase/FirebaseWorkspaceRepository";
export { FirebaseWorkspaceQueryRepository } from "./infrastructure/firebase/FirebaseWorkspaceQueryRepository";
export {
  createWorkspace,
  createWorkspaceWithCapabilities,
  updateWorkspaceSettings,
  deleteWorkspace,
  mountCapabilities,
  authorizeWorkspaceTeam,
  grantIndividualWorkspaceAccess,
  createWorkspaceLocation,
} from "./interfaces/_actions/workspace.actions";
export { WorkspaceHubScreen } from "./interfaces/components/WorkspaceHubScreen";
export { WorkspaceDetailScreen } from "./interfaces/components/WorkspaceDetailScreen";
export { WorkspaceMembersTab } from "./interfaces/components/WorkspaceMembersTab";
export { useWorkspaceHub } from "./interfaces/hooks/useWorkspaceHub";
export {
  getWorkspaceById,
  getWorkspacesForAccount,
} from "./interfaces/queries/workspace.queries";
export { getWorkspaceMembers } from "./interfaces/queries/workspace-member.queries";
