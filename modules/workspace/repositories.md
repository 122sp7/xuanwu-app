# Repositories and Ports — workspace

This file maps repository contracts (ports) to infrastructure adapters.

## Output ports (current)

- `WorkspaceRepository`
- `WorkspaceCapabilityRepository`
- `WorkspaceAccessRepository`
- `WorkspaceLocationRepository`
- `WorkspaceQueryRepository`
- `WikiWorkspaceRepository`
- `WorkspaceDomainEventPublisher`

## Core split

- **Write-side persistence**: workspace aggregate/state updates
- **Read-side queries/projections**: member view and wiki tree inputs
- **Event publishing**: outbound domain-event dispatch

## Port ownership

All repository/event interfaces belong to `ports/output`.

Per Context7-aligned hexagonal guidance:

- domain/application depend on abstractions (ports)
- infrastructure provides concrete implementations
- do not collapse domain and persistence models into one concern

## Adapter implementations (current)

- `FirebaseWorkspaceRepository`
- `FirebaseWorkspaceQueryRepository`
- `FirebaseWikiWorkspaceRepository`
- `SharedWorkspaceDomainEventPublisher`

## Query projection note

`WorkspaceQueryRepository` and `WikiWorkspaceRepository` serve read models. Their outputs are projection-oriented and do not redefine aggregate ownership.
