export type { WorkspaceSnapshot, CreateWorkspaceInput, WorkspaceLifecycleState, WorkspaceVisibility } from "./entities/Workspace";
export { Workspace, WORKSPACE_LIFECYCLE_STATES, canTransitionLifecycle } from "./entities/Workspace";
export type { WorkspaceDomainEventType, WorkspaceCreatedEvent, WorkspaceActivatedEvent, WorkspaceStoppedEvent } from "./events/WorkspaceDomainEvent";
export type { WorkspaceRepository } from "./repositories/WorkspaceRepository";
