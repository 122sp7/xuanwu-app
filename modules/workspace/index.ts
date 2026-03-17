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
export type { WorkspaceRepository } from "./domain/repositories/WorkspaceRepository";
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
export { FirebaseWorkspaceRepository } from "./infrastructure/firebase/FirebaseWorkspaceRepository";
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
