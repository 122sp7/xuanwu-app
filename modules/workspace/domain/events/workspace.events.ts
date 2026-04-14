import { v4 as uuid } from "@lib-uuid";
import type { DomainEvent } from "@shared-types";

import type {
  WorkspaceLifecycleState,
  WorkspaceVisibility,
} from "../aggregates/Workspace";

export const WORKSPACE_CREATED_EVENT_TYPE = "workspace.created" as const;
export const WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE = "workspace.lifecycle-transitioned" as const;
export const WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE = "workspace.visibility-changed" as const;

interface WorkspaceEventBase extends DomainEvent {
  readonly workspaceId: string;
  readonly accountId: string;
}

export interface WorkspaceCreatedEvent extends WorkspaceEventBase {
  readonly type: typeof WORKSPACE_CREATED_EVENT_TYPE;
  readonly accountType: "user" | "organization";
  readonly name: string;
}

export interface WorkspaceLifecycleTransitionedEvent extends WorkspaceEventBase {
  readonly type: typeof WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE;
  readonly fromState: WorkspaceLifecycleState;
  readonly toState: WorkspaceLifecycleState;
}

export interface WorkspaceVisibilityChangedEvent extends WorkspaceEventBase {
  readonly type: typeof WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE;
  readonly fromVisibility: WorkspaceVisibility;
  readonly toVisibility: WorkspaceVisibility;
}

export type WorkspaceDomainEvent =
  | WorkspaceCreatedEvent
  | WorkspaceLifecycleTransitionedEvent
  | WorkspaceVisibilityChangedEvent;

export function createWorkspaceCreatedEvent(input: {
  workspaceId: string;
  accountId: string;
  accountType: "user" | "organization";
  name: string;
}): WorkspaceCreatedEvent {
  return {
    eventId: uuid(),
    type: WORKSPACE_CREATED_EVENT_TYPE,
    aggregateId: input.workspaceId,
    occurredAt: new Date().toISOString(),
    workspaceId: input.workspaceId,
    accountId: input.accountId,
    accountType: input.accountType,
    name: input.name,
  };
}

export function createWorkspaceLifecycleTransitionedEvent(input: {
  workspaceId: string;
  accountId: string;
  fromState: WorkspaceLifecycleState;
  toState: WorkspaceLifecycleState;
}): WorkspaceLifecycleTransitionedEvent {
  return {
    eventId: uuid(),
    type: WORKSPACE_LIFECYCLE_TRANSITIONED_EVENT_TYPE,
    aggregateId: input.workspaceId,
    occurredAt: new Date().toISOString(),
    workspaceId: input.workspaceId,
    accountId: input.accountId,
    fromState: input.fromState,
    toState: input.toState,
  };
}

export function createWorkspaceVisibilityChangedEvent(input: {
  workspaceId: string;
  accountId: string;
  fromVisibility: WorkspaceVisibility;
  toVisibility: WorkspaceVisibility;
}): WorkspaceVisibilityChangedEvent {
  return {
    eventId: uuid(),
    type: WORKSPACE_VISIBILITY_CHANGED_EVENT_TYPE,
    aggregateId: input.workspaceId,
    occurredAt: new Date().toISOString(),
    workspaceId: input.workspaceId,
    accountId: input.accountId,
    fromVisibility: input.fromVisibility,
    toVisibility: input.toVisibility,
  };
}
