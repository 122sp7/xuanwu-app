---
description: 'Hexagonal Architecture with Domain-Driven Design rules for layer ownership and dependency direction.'
applyTo: 'modules/**/*.{ts,tsx,js,jsx,md}'
---

# Architecture Hexagonal DDD

## Layer Direction

- `interfaces -> application -> domain <- infrastructure`
- Keep `domain/` framework-free.

## Development Order

- Use case contract must exist first（actor、goal、main success scenario、failure branches）。
- New feature implementation order is mandatory: `Domain -> Application -> Ports -> Infrastructure -> Interface`.
- `domain/` defines what the system is; `application/` defines what the system does; `infrastructure/` and `interfaces/` define how it is delivered.

## Layer Constraints

- `domain/` must not import Firebase SDK, React, HTTP clients, or runtime-specific adapters.
- `application/` orchestrates use cases and coordinates domain abstractions.
- `infrastructure/` implements domain ports and repository interfaces.
- `interfaces/` handles UI, route handlers, API transport, and server action wiring.
- UI and transport code must call `application/` or local `api/` boundary only; do not call `domain/` or `infrastructure/` directly.

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

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd