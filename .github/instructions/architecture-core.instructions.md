---
description: 'Consolidated Hexagonal DDD architecture rules: layer ownership, API-only boundaries, module shape, and bounded-context dependency direction.'
applyTo: 'modules/**/*.{ts,tsx,js,jsx,md}'
---

# Architecture Core

## Core Boundary Rules

- Determine owning bounded context and subdomain from `docs/**/*` before choosing file placement.
- Cross-module collaboration must go through `modules/<target>/api` or explicit events.
- Do not import another module's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Replace any boundary bypass in the same change with API contracts or events.

## Layer Direction

- Dependency direction is fixed: `interfaces -> application -> domain <- infrastructure`.
- Keep `domain/` framework-free and runtime-agnostic.
- `infrastructure/` and `interfaces/` are outer layers; do not place them inside generic `core/`.

## Layer Ownership

- `domain/`: business rules, invariants, aggregates, entities, value objects, domain events, repository/port interfaces.
- `application/`: use-case orchestration, transaction boundaries, command/query contracts, application services.
- `infrastructure/`: repository and adapter implementations only.
- `interfaces/`: input/output translation, route/action/UI wiring.
- `api/`: only cross-module entry surface.

## Use Case Decision Rules

- Use a use case only for business behavior.
- Pure reads without business logic go to query handlers.
- Keep UI state and interaction logic in `interfaces/`.
- Use cases orchestrate flow; complex business rules stay in `domain/`.
- `GetXxxUseCase` is usually a query smell.

## Development Order

- Use-case contract first: actor, goal, main success scenario, failure branches.
- Required order: `Use Case -> Domain -> Ports -> Application -> Infrastructure -> Interface`.
- Do not build UI first and backfill domain later.
- Do not call repositories directly from `interfaces/`.
- Do not force domain design from storage schema first.

## Module Shape and Naming

- Required shape: `api/`, `domain/`, `application/`, `infrastructure/`, `interfaces/`, `README.md`, `index.ts`.
- Public boundary is `api/`; `index.ts` is aggregate export only.
- Use case file: `verb-noun.use-case.ts`.
- Repository interface: `PascalCaseRepository`.
- Repository implementation: `TechnologyPascalCaseRepository`.
- Domain event discriminant: `module-name.action`.

## Refactor and Lifecycle Rules

1. Confirm ownership first.
2. Map API consumers.
3. Create or update the target use-case contract before adapter/UI edits.
4. Preserve boundaries during split/merge/delete.
5. Update docs and imports in the same change.
6. Migrate public API and event contracts before removing old paths.

## Validation

- Use `eslint.config.mjs` restricted-import and boundary rules as enforcement source.
- Re-check changed imports under `@/modules/` for API-only access.
- Keep dependency flow acyclic unless an explicit event contract documents an exception.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
