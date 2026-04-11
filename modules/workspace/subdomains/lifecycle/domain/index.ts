/**
 * Lifecycle Subdomain — Domain Layer
 *
 * Owns workspace container lifecycle: creation, settings update, deletion,
 * and lifecycle state transitions (preparatory → active → stopped).
 *
 * Depends on root workspace domain aggregate and value objects.
 * Does not duplicate the Workspace aggregate — references it through ports.
 */

// Re-export lifecycle-relevant root domain types for subdomain consumers
export type {
  CreateWorkspaceCommand,
  UpdateWorkspaceSettingsCommand,
  WorkspaceEntity,
} from "../../../domain/aggregates/Workspace";

export type {
  WorkspaceLifecycleState,
  WorkspaceLifecycleStateInput,
} from "../../../domain/value-objects/WorkspaceLifecycleState";

export type {
  WorkspaceCreatedEvent,
  WorkspaceDomainEvent,
  WorkspaceLifecycleTransitionedEvent,
  WorkspaceVisibilityChangedEvent,
} from "../../../domain/events/workspace.events";

export {
  createWorkspaceCreatedEvent,
  createWorkspaceLifecycleTransitionedEvent,
  createWorkspaceVisibilityChangedEvent,
} from "../../../domain/events/workspace.events";
