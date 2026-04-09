export type {
  Address,
  AddressInput,
  Capability,
  CapabilitySpec,
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceEntity,
  WorkspaceGrant,
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
  WorkspaceLocation,
  WorkspaceName,
  WorkspaceNameInput,
  WorkspacePersonnel,
  WorkspacePersonnelCustomRole,
  WorkspaceVisibility,
  WorkspaceVisibilityInput,
} from "../../../domain/aggregates/Workspace";

export {
  WORKSPACE_LIFECYCLE_STATES,
  WORKSPACE_VISIBILITIES,
  createAddress,
  createWorkspaceLifecycleState,
  createWorkspaceName,
  createWorkspaceVisibility,
  formatAddress,
  isTerminalWorkspaceLifecycleState,
  isWorkspaceVisible,
  workspaceNameEquals,
} from "../../../domain/value-objects";

export type {
  WorkspaceCreatedEvent,
  WorkspaceDomainEvent,
  WorkspaceLifecycleTransitionedEvent,
  WorkspaceVisibilityChangedEvent,
} from "../../../domain/events/workspace.events";

export {
  WORKSPACE_CREATED_EVENT_TYPE,
  WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE,
  WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE,
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../../../domain/events/workspace.events";