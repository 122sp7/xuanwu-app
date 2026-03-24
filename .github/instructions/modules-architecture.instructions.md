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

### `domain/`

- Own entities, aggregates, value objects, domain events, repository interfaces, and pure business rules
- Stay framework-free
- Do not import Firebase SDKs, React, HTTP clients, or browser APIs

### `application/`

- Own use cases and DTOs
- Orchestrate domain operations
- Depend on domain ports and repository interfaces, not concrete infrastructure

### `infrastructure/`

- Own repository implementations, Firebase adapters, HTTP adapters, persistence adapters, and other external integrations
- Implement contracts defined by the domain layer

### `interfaces/`

- Own UI components, hooks, queries, contracts, and Server Actions
- Keep UI and transport concerns out of `domain/`

### `api/`

- Own the public cross-module surface
- Export only the contracts that other modules are allowed to consume

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

## Hard Rules

- Do not cross-import another module's internals.
- Do not skip `api/` when the module must be consumed by another module.
- Do not put business rules in `interfaces/`.
- Do not import infrastructure into `domain/`.
- Do not treat `app/` as a substitute for module business logic.

## Events / Repository / Entity / Value Object Rules

- Put domain events in `domain/events/`
- Put repository interfaces in `domain/repositories/`
- Put entities and aggregates in `domain/entities/`
- Put immutable value types in `domain/value-objects/`
- Implement repositories in `infrastructure/`
- Route cross-module integration through `api/` or event flows

## Validation

- `npm run lint`
- `npm run build`
