# Architecture Index

**Primary source of truth:** `ARCHITECTURE.md`  
**Verified against repo:** 2026-03-19

## Global dependency direction

`UI -> Application -> Domain <- Infrastructure`

Additional cross-cutting rules from repo structure:
- `shared/` can be used across layers when kept pure
- `ui/` is for reusable UI primitives consumed by app/shell/features
- `interfaces/` and `app/` stay thin; business decisions belong in application/domain

## Actual per-module layout pattern in this workspace

Not every module is fully migrated, but the target and commonly observed pattern is:

```text
modules/<feature>/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── events/
│   ├── services/
│   ├── repositories/
│   └── errors.ts / utils/
├── application/
│   └── use-cases/
├── infrastructure/
│   └── firebase/
├── interfaces/
│   ├── _actions/
│   ├── hooks/
│   ├── queries/
│   └── components/
└── ports/   (present in some modules, not universal)
```

## Architectural rules

### Domain
- Pure TypeScript only
- Owns entities, value objects, domain services, events, errors, and repository interfaces
- No React, Next.js, Firebase SDK, or infrastructure imports

### Application
- Orchestrates domain objects and repository ports
- Framework-agnostic use-cases
- Write flows commonly return `CommandResult`

### Infrastructure
- Firebase and external adapter implementations live here
- Mapping logic and persistence concerns stay here
- Must not leak upward into domain design

### Interfaces
- Thin adapters only
- `_actions/` for server actions
- `hooks/` for client adapters
- `queries/` for read-model access
- `components/` for feature-facing UI composition when present

## Important current-state notes

- `ARCHITECTURE.md` describes the target MDDD + Hexagonal architecture; actual coverage varies by module.
- `schedule` is currently the most complete active MDDD slice.
- `workspace` has interface-level screen composition already present.
- `core/` contains reusable bounded contexts outside `modules/`: `event-core`, `knowledge-core`, `namespace-core`.
- `namespace-core` is scaffolded only; do not assume implementation exists.
- `knowledge/retrieval/taxonomy` are not top-level modules in `modules/`; knowledge functionality currently lives in `core/knowledge-core`.

## Validation guidance

Before broad refactors, verify the real file tree and symbol layout instead of relying on the target diagram alone.
