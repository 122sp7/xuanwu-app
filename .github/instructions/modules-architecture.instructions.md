---
description: 'Architecture rules for creating and refactoring modules/ bounded contexts under Xuanwu MDDD'
applyTo: 'modules/**/*.ts, modules/**/*.tsx, modules/**/*.js, modules/**/*.jsx, modules/**/*.md'
---

# Modules Architecture

Use this instruction when creating, expanding, or restructuring code under `modules/`.

## MDDD Layers

Every first-class business module must preserve these layers:

- `domain/`
- `application/`
- `infrastructure/`
- `interfaces/`
- `api/`

For new modules, create all five layers plus:

- `README.md`
- `index.ts`

If a layer is intentionally omitted in a special-case module, document the exception explicitly in the module README or architecture note.

## Layer Responsibilities

| Layer | Responsibilities | Constraints |
| --- | --- | --- |
| **`domain/`** | Entities, aggregates, value objects, domain events, repository interfaces, pure business rules | Framework-free; no Firebase SDKs, React, HTTP clients, or browser APIs |
| **`application/`** | Use cases, DTOs, orchestration | Depend on domain ports and repository interfaces, not infrastructure |
| **`infrastructure/`** | Repository implementations, Firebase adapters, HTTP adapters, persistence, external integrations | Implement contracts defined by domain layer |
| **`interfaces/`** | UI components, hooks, queries, contracts, Server Actions | Keep UI and transport concerns out of `domain/` |
| **`api/`** | Public cross-module surface | Export only contracts other modules are allowed to consume |

## Required Module Shape

```text
modules/{module-name}/
├── api/
├── domain/
│   ├── entities/
│   ├── repositories/
│   ├── value-objects/
│   └── events/
├── application/
│   ├── use-cases/
│   └── dto/
├── infrastructure/
├── interfaces/
├── README.md
└── index.ts
```

Additional folders are allowed when needed, but do not rename the canonical layers.

## Rules & Guardrails

- **Cross-module**: Do not reach into another module's internals; use `api/` or event flows
- **Layers**: Never skip `api/` for cross-module consumption. Do not put business rules in `interfaces/`. Do not import infrastructure into `domain/`
- **App boundary**: `app/` is route wiring, not business logic
- **File placement**:
  - Events → `domain/events/`
  - Repository interfaces → `domain/repositories/`
  - Entities/aggregates → `domain/entities/`
  - Immutable value types → `domain/value-objects/`
  - Repository implementations → `infrastructure/`

## Validation

- `npm run lint`
- `npm run build`
