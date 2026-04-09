# workspace

`workspace` is the bounded context that defines collaboration scope through `workspaceId`, lifecycle, and visibility language.

> Domain Type: **Generic Subdomain**

## Why this context exists

This context gives the rest of the system a stable collaboration container:

- scope identity (`workspaceId`)
- lifecycle semantics (`preparatory | active | stopped`)
- visibility semantics (`visible | hidden`)
- public contracts via `modules/workspace/api`

## Current structure (matches code)

```text
modules/workspace/
├── api/
├── application/
│   ├── dtos/
│   ├── services/
│   └── use-cases/
├── domain/
│   ├── aggregates/
│   ├── entities/
│   ├── events/
│   ├── factories/
│   ├── services/
│   └── value-objects/
├── docs/
├── infrastructure/
│   ├── events/
│   └── firebase/
├── interfaces/
│   ├── api/
│   ├── cli/
│   └── web/
├── ports/
│   ├── input/
│   └── output/
└── subdomains/
```

## Hexagonal mapping

| Hexagonal part | workspace implementation |
|---|---|
| Domain core | `domain/` |
| Application ring | `application/` |
| Driving adapters | `interfaces/api`, `interfaces/cli`, `interfaces/web` |
| Driving ports | `ports/input` |
| Driven ports | `ports/output` |
| Driven adapters | `infrastructure/firebase`, `infrastructure/events` |
| Public boundary | `api/` |

## Tactical summary

- Aggregate Root: `Workspace`
- Domain Events:
  - `WorkspaceCreatedEvent`
  - `WorkspaceLifecycleTransitionedEvent`
  - `WorkspaceVisibilityChangedEvent`
- Output port for event publishing:
  - `WorkspaceDomainEventPublisher`
- Read projections:
  - `WorkspaceMemberView`
  - `WikiAccountContentNode`
  - `WikiWorkspaceContentNode`
  - `WikiContentItemNode`

## Scope guardrails

- This context does not own organization truth (members/teams governance).
- This context does not own knowledge-content semantics.
- UI tab composition is interface composition, not context-map ownership.

## Documentation index

- [subdomain.md](./docs/subdomain.md) — Subdomain classification and strategic position
- [bounded-context.md](./docs/bounded-context.md) — Boundary definition, scope, and upstream/downstream relationships
- [ubiquitous-language.md](./docs/ubiquitous-language.md) — Canonical terminology for this context
- [aggregates.md](./docs/aggregates.md) — Aggregate roots, entities, and value objects
- [domain-events.md](./docs/domain-events.md) — Domain events and their payloads
- [domain-services.md](./docs/domain-services.md) — Stateless domain services and business rules
- [repositories.md](./docs/repositories.md) — Repository interfaces and contracts
- [application-services.md](./docs/application-services.md) — Use cases and application orchestration
- [context-map.md](./docs/context-map.md) — Relationships with other bounded contexts
