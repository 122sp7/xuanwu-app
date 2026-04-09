---
name: hexagonal-ddd
description: >
  Hexagonal Architecture with Domain-Driven Design skillbook. Use when designing or reviewing module boundaries,
  ports/adapters, aggregate/use-case layering, and API-only cross-module collaboration in Xuanwu.
user-invocable: true
disable-model-invocation: false
---

# Hexagonal Architecture with Domain-Driven Design

This skill applies Hexagonal Architecture (Ports & Adapters) with DDD tactical patterns for Xuanwu modules.
Use it for architecture design, refactor guidance, and conflict audits.

## Context7-verified references

Validated with Context7:

1. `/sairyss/domain-driven-hexagon` (mode: `code`)
   - Repository ports as abstractions in core.
   - Strict dependency rule: domain must not depend on API/database layers.
   - Value Object modeling pattern and CQRS handler examples.
2. `/dasiths/portsandadapterspatterndemo` (mode: `info`)
   - Ports and adapters pattern separation and decoupling goals.
3. `/alicanakkus/modular-architecture-hexagonal-demo-project` (mode: `info`)
   - Modular layering and adapter-oriented boundaries.

## Core principles

1. Core domain logic stays independent of frameworks and infrastructure.
2. Ports are contracts owned by the core/application; adapters implement them outside.
3. Cross-module calls must use the target module `api/` boundary only.
4. `interfaces -> application -> domain <- infrastructure` remains the dependency direction.
5. `index.ts` is aggregate export only; do not treat it as the cross-module boundary.

## Xuanwu mapping

| Hexagonal concept | Xuanwu location |
|---|---|
| Driving adapters | `modules/<context>/interfaces/*`, `app/` composition |
| Driving boundary (public) | `modules/<context>/api/` |
| Application orchestration | `modules/<context>/application/` |
| Domain core | `modules/<context>/domain/` |
| Driven ports | `modules/<context>/domain/repositories/` and related core contracts |
| Driven adapters | `modules/<context>/infrastructure/` |

## Enforcement checklist

- No domain imports of Firebase/HTTP/React/runtime adapters.
- No cross-module imports into peer `domain/`, `application/`, `infrastructure/`, `interfaces/`.
- Cross-module import path uses `@/modules/<target>/api`.
- Repository interfaces stay in core; concrete persistence is in infrastructure.
- Server Action / route handlers remain thin adapters delegating to use cases.

## Anti-patterns

- Treating `index.ts` as a module public API boundary.
- Leaking infrastructure details into domain or use-case decisions.
- Calling peer module internals directly.
- Putting business rules into UI/route/adapters.
- Using DDD/Hexagonal as dogma without fitness-to-context (overengineering).

## Recommended workflow

1. Identify module boundary and actor/use-case scope.
2. Define or verify inbound/outbound ports.
3. Confirm adapter placement (`interfaces`/`infrastructure`) and dependency direction.
4. Verify cross-module interactions go through `api/`.
5. Update docs and contracts together when boundaries change.

## Output contract

When this skill is used, provide:

1. conflict findings (if any),
2. exact boundary/layer corrections,
3. changed files and rationale,
4. residual risks or migration notes.
