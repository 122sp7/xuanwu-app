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

- [README.md](./README.md)
- [subdomain.md](./subdomain.md)
- [bounded-context.md](./bounded-context.md)
- [context-map.md](./context-map.md)
- [ubiquitous-language.md](./ubiquitous-language.md)
- [aggregates.md](./aggregates.md)
- [application-services.md](./application-services.md)
- [domain-services.md](./domain-services.md)
- [repositories.md](./repositories.md)
- [domain-events.md](./domain-events.md)
