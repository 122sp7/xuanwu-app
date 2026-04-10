---
name: hexagonal-ddd
description: >-
  Hexagonal Architecture with Domain-Driven Design skillbook. Use when designing or reviewing bounded-context ownership,
  domain/application separation, ports/adapters, aggregates, and API-only cross-module collaboration in Xuanwu.
user-invocable: true
disable-model-invocation: false
---

# Hexagonal Architecture with Domain-Driven Design

Use this skill when the task involves module boundaries, application flow, tactical domain design, or refactoring code back behind stable ports and public APIs.

## Research Basis

Context7-verified:

1. `/sairyss/domain-driven-hexagon`
   - Dependencies point inward; application core does not depend on frameworks or external resources directly.
   - Ports are contracts owned by the core; adapters implement them outside the core.
   - Ports may live in application by default, but domain-owned ports are appropriate when a domain rule itself depends on an external capability.
   - Adapters should not be called directly; they are reached through ports.
   - Feature-oriented structure is preferable to broad technical buckets when files change together.

Web-verified:

1. Martin Fowler, Domain-Driven Design
   - DDD centers software around a rich domain model, ubiquitous language in code, aggregates, and strategic bounded contexts.
2. Hexagonal architecture overview
   - The core is isolated from UI, database, test scripts, and external systems through ports and adapters.
   - A port can have multiple adapters, and the shape is about replaceable boundaries, not a literal six-part layout.

## Working Synthesis

Hexagonal DDD in this repo means:

1. Start from owning bounded context and ubiquitous language, not from folders.
2. Keep business rules in domain objects and domain services, not in routes, UI, or persistence code.
3. Use application for orchestration, transactions, command/query flow, and DTO translation.
4. Place infrastructure and interfaces outside the core, depending inward.
5. Expose cross-module collaboration only through the target module `api/` boundary or published events.
6. Add abstractions only when they protect a real boundary.

## Xuanwu Mapping

| Concern | Xuanwu location |
|---|---|
| Public cross-module boundary | `modules/<context>/api/` |
| Driving adapters | `app/`, `modules/<context>/interfaces/` |
| Application orchestration | `modules/<context>/application/` |
| Domain rules and invariants | `modules/<context>/domain/` |
| Driven adapters | `modules/<context>/infrastructure/` |
| Context-wide concern | `<bounded-context>/application|domain|infrastructure|interfaces` |

## Placement Rules

1. Choose the owning bounded context before choosing the file path.
2. Default to existing subdomains; create a new one only when ownership or language genuinely diverges.
3. Keep `interfaces -> application -> domain <- infrastructure` as the dependency rule.
4. Treat `index.ts` as exports only; do not treat it as the public module boundary.
5. Use `api/` for cross-module calls; do not import peer `domain/`, `application/`, `interfaces/`, or `infrastructure/` directly.
6. Bounded-context root layers are valid for context-wide policies or orchestration; do not force everything into a generic `core/` wrapper.

## Port Decision Heuristics

Create a port when at least one of these is true:

1. The core must stay independent from a framework, SDK, database, queue, or remote service.
2. The dependency crosses process, runtime, or bounded-context boundaries.
3. Multiple adapters are plausible now, or swapping later is a realistic requirement.
4. A domain rule depends on an external capability and that dependency must remain expressible in domain terms.

Avoid a port when the abstraction only exists to look architectural.

## Red Flags

- Domain imports React, Firebase, HTTP clients, ORM models, or runtime transport types.
- Application rewrites business invariants that belong in domain.
- A route handler or Server Action becomes the real use-case implementation.
- Another module imports peer internals instead of `@/modules/<target>/api`.
- A repository implementation is referenced directly from the core.
- A new layer or folder is introduced without a new boundary to protect.

## Review Loop

1. Identify the actor, use case, and owning bounded context.
2. Name concepts with the repo glossary before naming types.
3. Place rules in domain, orchestration in application, adapters outside.
4. Verify every outward dependency is inverted or isolated behind the public boundary.
5. Remove decorative abstractions that do not protect a real seam.
6. Update docs and contracts together when ownership or language changes.

## Output Contract

When this skill is used, provide:

1. the owning bounded context and subdomain,
2. boundary or layer violations,
3. the minimal structural correction,
4. changed files and rationale,
5. residual risks or migration notes.
