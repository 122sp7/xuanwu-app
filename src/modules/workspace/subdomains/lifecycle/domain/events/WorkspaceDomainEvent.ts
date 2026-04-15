export interface WorkspaceDomainEvent {
  readonly eventId: string;
  readonly occurredAt: string;
  readonly type: string;
  readonly payload: object;
}

export interface WorkspaceCreatedEvent extends WorkspaceDomainEvent {
  readonly type: "workspace.lifecycle.created";
  readonly payload: { readonly workspaceId: string; readonly accountId: string; readonly name: string };
}

export interface WorkspaceActivatedEvent extends WorkspaceDomainEvent {
  readonly type: "workspace.lifecycle.activated";
  readonly payload: { readonly workspaceId: string };
}

export interface WorkspaceStoppedEvent extends WorkspaceDomainEvent {
  readonly type: "workspace.lifecycle.stopped";
  readonly payload: { readonly workspaceId: string };
}

export type WorkspaceDomainEventType =
  | WorkspaceCreatedEvent
  | WorkspaceActivatedEvent
  | WorkspaceStoppedEvent;
