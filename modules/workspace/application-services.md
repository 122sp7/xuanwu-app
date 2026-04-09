# Application Services — workspace

This file defines the application-layer contract of the workspace bounded context.

## Application layer location

`modules/workspace/application/`

- `use-cases/`: single use-case orchestration
- `services/`: application service composition
- `dtos/`: boundary data shapes for commands/queries

## Current application services

- `WorkspaceCommandApplicationService`
- `WorkspaceQueryApplicationService`

## Responsibilities

- accept requests from driving side (through input ports/facades)
- coordinate use cases
- invoke output ports
- publish domain events after successful state changes

## Current command-side use cases

- create workspace
- create workspace with capabilities
- update workspace settings
- delete workspace
- mount capabilities
- authorize team access
- grant individual access
- create workspace location

## Current query-side use cases

- list/get workspace
- subscribe workspace list for account
- fetch workspace members (`WorkspaceMemberView`)
- build wiki content tree projections

## Layering boundaries

- Application layer can depend on:
  - `domain/*`
  - `ports/output/*`
- Application layer must not depend on infrastructure implementations directly.

## Ports/adapters relation

- driving adapters: `interfaces/api`, `interfaces/cli`, `interfaces/web`
- driven adapters: `infrastructure/firebase`, `infrastructure/events`
- public integration entry: `api/`

## Domain service distinction

- **Domain Service**: pure domain rules.
- **Application Service**: flow orchestration and use-case coordination.

Do not move domain invariants into application services.
