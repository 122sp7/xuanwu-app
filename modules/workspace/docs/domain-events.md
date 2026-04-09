# Domain Events — workspace

This file defines the domain-event language published by the workspace bounded context.

## Event contracts (current code)

From `domain/events/workspace.events.ts`:

- `WorkspaceCreatedEvent` (`workspace.created`)
- `WorkspaceLifecycleTransitionedEvent` (`workspace.lifecycle_transitioned`)
- `WorkspaceVisibilityChangedEvent` (`workspace.visibility_changed`)

## Shared event base shape

Workspace events align with shared `DomainEvent` fields:

- `eventId`
- `type`
- `aggregateId`
- `occurredAt`

Workspace-specific fields include `workspaceId` and `accountId`.

## Publishing path

1. state change handled by use case/application service
2. persist state successfully
3. publish event through output port:
   - `WorkspaceDomainEventPublisher`
4. infrastructure adapter dispatches to concrete event system

## Factory functions (current)

- `createWorkspaceCreatedEvent`
- `createWorkspaceLifecycleTransitionedEvent`
- `createWorkspaceVisibilityChangedEvent`

## Scope guardrails

- Event payloads carry domain facts, not UI details.
- Event publishing is application/infrastructure collaboration.
- Event definitions remain part of domain language.
