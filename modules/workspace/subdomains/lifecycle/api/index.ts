/**
 * Lifecycle Subdomain — Public API Boundary
 *
 * Cross-subdomain and cross-module consumers import through this entry point.
 */

// --- Application service ---
export {
  WorkspaceLifecycleApplicationService,
} from "../application";
export type { LifecycleServiceDependencies } from "../application";

// --- Domain types (published language for lifecycle) ---
export type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceEntity,
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
  WorkspaceCreatedEvent,
  WorkspaceDomainEvent,
  WorkspaceLifecycleTransitionedEvent,
  WorkspaceVisibilityChangedEvent,
} from "../domain";

export {
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../domain";
