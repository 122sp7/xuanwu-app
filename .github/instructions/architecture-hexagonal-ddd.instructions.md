---
description: '[DEPRECATED] Hexagonal DDD layer rules. See architecture-core.instructions.md.'
applyTo: 'modules/**/*.{ts,tsx,js,jsx,md}'
---

# Architecture Hexagonal DDD

> DEPRECATED: Consolidated into `.github/instructions/architecture-core.instructions.md`.

## Layer Direction

- `interfaces -> application -> domain <- infrastructure`
- Keep `domain/` framework-free.

## Use Case Decision Rules (Compact)

- Use a use case only when there is business behavior.
- If there is validation/orchestration/event flow, use a use case.
- Pure read without business logic goes to query, not use case.
- UI state and interaction logic stays in `interfaces/`.
- Use cases orchestrate flow only; business rules belong to `domain/`.
- `GetXxxUseCase` is usually a query smell.

## Development Order

- Use case contract must exist first（actor、goal、main success scenario、failure branches）。
- New feature implementation order is mandatory: `Use Case -> Domain -> Ports -> Application -> Infrastructure -> Interface`.
- `domain/` defines what the system is; `application/` defines what the system does; `infrastructure/` and `interfaces/` define how it is delivered.
- Do not build UI first and backfill domain later.
- Do not call repositories directly from `interfaces/`.
- Do not design storage schema first and force domain to match.
- Do not start implementation before use-case intent is explicit.

## Layer Constraints

- `domain/` must not import Firebase SDK, React, HTTP clients, or runtime-specific adapters.
- `application/` orchestrates use cases and coordinates domain abstractions.
- `infrastructure/` implements domain ports and repository interfaces.
- `interfaces/` handles UI, route handlers, API transport, and server action wiring.
- UI and transport code must call `application/` or local `api/` boundary only; do not call `domain/` or `infrastructure/` directly.

## Layer Ownership Rules

- `domain/`: business rules, invariants, aggregates, entities, value objects, domain events, repository/port interfaces.
- `application/`: use-case orchestration, transaction boundaries, command/query contracts, application services.
- `infrastructure/`: repository and external adapter implementations only; no business decisions.
- `interfaces/`: input/output translation only; keep controllers/routes thin.
- `mappers/`: DTO/domain/persistence translation only (`toDomain`, `toDTO`, `toPersistence`).
- `queries/`: read model path; side-effect free and no domain behavior trigger.

## Layer Ownership

- `domain/`: entities, value objects, domain services, repository interfaces.
- `application/`: use cases and DTO orchestration.
- `infrastructure/`: adapters and external implementations.
- `interfaces/`: UI, transport, and action wiring.
- Module `api/` public entry is the only cross-module boundary.

## Dependency Guardrails

- Keep module dependency flow acyclic unless an explicit event contract documents the exception.
- Do not reverse dependency direction for convenience during refactors.
- Legacy outside-in flows must be converged use-case-by-use-case (strangler style), not rewritten as a big-bang migration.

## Firebase Runtime Reinforcement

- Run use cases on server entry points (`server actions`, route handlers, or functions).
- Keep `domain/` pure TypeScript with no Firebase imports.
- Implement Firestore and external integrations in `infrastructure/` adapters.
- Allow realtime read-model queries to consume Firestore snapshots directly only for query-only paths.
- Keep realtime query flows side-effect free.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
