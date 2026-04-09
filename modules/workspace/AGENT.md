# AGENT.md — workspace bounded context

`workspace` is a **Generic Subdomain** bounded context that provides collaboration-scope language and stable boundaries for downstream modules.

## Mandatory workflow

```text
serena
activate_project
list_memories
read_memory
#use skill context7
```

## Strategic position

- **Domain**: Xuanwu knowledge platform.
- **Subdomain**: workspace collaboration container (generic, not differentiating core).
- **Bounded Context**: `modules/workspace/`.

## Current hexagonal shape (authoritative in this module)

```text
modules/workspace/
├── api/                # Public boundary for app/ and other modules
├── application/        # Use cases, app services, DTO orchestration
├── domain/             # Aggregates, entities, value objects, events, services
├── docs/               # Module-local design and reference notes
├── infrastructure/     # Driven adapters (Firebase/events)
├── interfaces/         # Driving adapters (api/cli/web)
├── ports/              # input/ and output/ contracts
└── subdomains/         # workspace-centered subdomain views
```

## Boundary and dependency rules

- Cross-module access must go through `@/modules/workspace/api`.
- Keep dependency direction: `interfaces -> application -> domain <- infrastructure`.
- Keep `domain/` framework-free.
- Keep ports as contracts; do not leak adapter internals through public APIs.

## Canonical language anchors

- Aggregate Root: `Workspace`
- Lifecycle: `preparatory | active | stopped`
- Visibility: `visible | hidden`
- Event discriminants:
  - `workspace.created`
  - `workspace.lifecycle_transitioned`
  - `workspace.visibility_changed`

## Read model vs write model

- Write-side truth: `Workspace` aggregate and domain objects in `domain/`.
- Query/read projections:
  - `WorkspaceMemberView`
  - `WikiAccountContentNode`
  - `WikiWorkspaceContentNode`
  - `WikiContentItemNode`

These projection types are not aggregate roots.

## Context7 grounding used for this module documentation

Based on `/sairyss/domain-driven-hexagon`:

- Hexagonal architecture emphasizes clear ports/adapters boundaries.
- Domain layer should not depend on API/database layers.
- Repository abstractions belong to ports; infrastructure implements them.
- Keep solutions pragmatic and avoid overengineering.

## Related module docs

- [docs/README.md](./docs/README.md) — Module overview, responsibilities, and usage patterns
- [docs/subdomain.md](./docs/subdomain.md) — Subdomain classification and strategic position
- [docs/bounded-context.md](./docs/bounded-context.md) — Context boundaries, collaborations, and published language
- [docs/context-map.md](./docs/context-map.md) — Upstream/downstream dependencies and integration contracts
- [docs/ubiquitous-language.md](./docs/ubiquitous-language.md) — Canonical terminology and naming rules for this context
- [docs/aggregates.md](./docs/aggregates.md) — Aggregate roots, entities, and value objects
- [docs/domain-services.md](./docs/domain-services.md) — Stateless domain services and invariant enforcement
- [docs/domain-events.md](./docs/domain-events.md) — Published domain events and event names
- [docs/repositories.md](./docs/repositories.md) — Repository interfaces and persistence contracts
- [docs/application-services.md](./docs/application-services.md) — Use cases and application-layer orchestration
