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

- [AGENT.md](./AGENT.md)
- [subdomain.md](./subdomain.md)
- [bounded-context.md](./bounded-context.md)
- [context-map.md](./context-map.md)
- [ubiquitous-language.md](./ubiquitous-language.md)
- [aggregates.md](./aggregates.md)
- [application-services.md](./application-services.md)
- [domain-services.md](./domain-services.md)
- [repositories.md](./repositories.md)
- [domain-events.md](./domain-events.md)
