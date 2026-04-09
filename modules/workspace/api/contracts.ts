/**
 * workspace public contracts boundary.
 */

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
} from "../interfaces/api/contracts/workspace.contract";

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
} from "../interfaces/api/contracts/workspace.contract";

export type {
	WorkspaceCreatedEvent,
	WorkspaceDomainEvent,
	WorkspaceLifecycleTransitionedEvent,
	WorkspaceVisibilityChangedEvent,
} from "../interfaces/api/contracts/workspace.contract";

export {
	WORKSPACE_CREATED_EVENT_TYPE,
	WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE,
	WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE,
	createWorkspaceCreatedEvent,
	createWorkspaceLifecycleTransitionedEvent,
	createWorkspaceVisibilityChangedEvent,
} from "../interfaces/api/contracts/workspace.contract";

export type {
	WorkspaceMemberAccessChannel,
	WorkspaceMemberAccessSource,
	WorkspaceMemberPresence,
	WorkspaceMemberView,
} from "../interfaces/api/contracts/workspace-member.contract";

export type {
	WikiAccountContentNode,
	WikiAccountSeed,
	WikiAccountType,
	WikiContentItemNode,
	WikiWorkspaceContentNode,
	WikiWorkspaceRef,
} from "../interfaces/api/contracts/wiki-content.contract";