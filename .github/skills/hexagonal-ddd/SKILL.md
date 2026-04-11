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

## DDD Use Case Decision Rules (Compact)

### Core Rules

1. Use a use case only when there is business behavior.
2. If there is flow logic (validation, orchestration, events), use a use case.
3. If multiple aggregates or services must collaborate, use a use case.
4. If transaction or consistency control is required, use a use case.

### Exclusion Rules

5. Pure reads without business logic should be queries, not use cases.
6. UI state and frontend interaction logic stay in interfaces.
7. A single data operation with no rule can go directly to repository or domain service.

### Design Rules

8. One use case equals one business intent, named with a verb-first action.
9. Use cases should not do data-shape conversion; delegate mapping to mappers.
10. Use cases must not depend directly on UI or framework concerns.
11. Use cases orchestrate flow only; complex business rules belong to domain.

### Structure Rules

12. Commands belong in `use-cases/`.
13. Reads belong in `queries/`.
14. DTO and mapping logic belong in `mappers/`.
15. Cross-flow helper logic belongs in `services/`.

### Anti-Pattern Checks

16. `GetXxxUseCase` is usually a smell and should likely be a query.
17. A use case above about 200 lines should be split or pushed down into domain.
18. A use case that only wraps a single call is usually over-design.

### One-Line Summary

Use case is the entry point for business behavior, not the entry point for every function.

## Layer Decision Rules (Compact)

### Domain Layer

#### Core Rules

1. Business rules always belong in domain, not in use cases.
2. Invariants must be enforced by the aggregate boundary.
3. State changes must happen through behavior methods, not direct setters.
4. Domain must not depend on DB, API, framework, or transport concerns.

#### Design Rules

5. An aggregate is a consistency boundary, not a data container.
6. Entities have identity; value objects do not.
7. Value objects should be immutable.
8. Domain services should handle cross-aggregate business rules only.

#### Exclusion Rules

9. Do not place CRUD workflow in domain services.
10. Do not place orchestration in domain; that belongs to application.

#### Anti-Pattern Checks

11. Getter/setter-only entities are an anemic model smell.
12. If business logic sits in use cases, domain is being hollowed out.

### Repository Layer

#### Core Rules

1. Repository models aggregate collections.
2. Repository works on aggregate roots, not internal entities directly.

#### Design Rules

3. Repository interfaces belong in domain; implementations belong in infrastructure.
4. Use semantic method names such as `findByEmail` over generic names.

#### Exclusion Rules

5. Repositories must not contain business logic.
6. Repositories should not own mapping concerns.

#### Anti-Pattern Checks

7. Treating repository as an unrestricted DAO breaks aggregate boundaries.
8. Returning ORM entities leaks technical details into the core.

### Query (Read Model)

#### Core Rules

1. Separate read and write concerns (CQRS).
2. Queries may bypass domain when controlled and explicit.

#### Design Rules

3. Return DTO or view model directly from query handlers.
4. Query models may be optimized for UI read performance.

#### Exclusion Rules

5. Queries must be side-effect free.
6. Queries must not trigger domain behavior.

#### Anti-Pattern Checks

7. Business logic in query handlers is responsibility drift.

### Application Service (Beyond Use Cases)

#### Core Rules

1. Extract services only for flow fragments shared across use cases.
2. Application service is orchestration support, not business core.

#### Design Rules

3. Keep application services stateless.
4. Reuse across multiple use cases when duplication pressure is real.

#### Anti-Pattern Checks

5. Domain logic moved into application services is a layer violation.

### Infrastructure Layer

#### Core Rules

1. Implement external dependencies (DB, API, Firebase, queues, etc.).
2. Implement contracts; do not define business rules here.

#### Design Rules

3. Use adapters aligned to declared ports.
4. Keep implementations replaceable for tests and environment swaps.

#### Exclusion Rules

5. Infrastructure should not hold business decisions.

#### Anti-Pattern Checks

6. Business logic in infrastructure is architectural contamination.

### Interface Layer (UI/API)

#### Core Rules

1. Interface handles input/output translation, not business decisions.
2. Convert incoming requests to commands or queries.

#### Design Rules

3. Controllers and route handlers should remain thin.
4. Validation split: format at interface, business invariants at domain.

#### Exclusion Rules

5. Interface should not directly operate repositories.
6. Interface should not embed use case logic.

#### Anti-Pattern Checks

7. Fat controllers indicate boundary failure.

### Mapper

#### Core Rules

1. Keep DTO, domain model, and persistence model separated.

#### Design Rules

2. Use explicit mapper verbs: `toDomain`, `toDTO`, `toPersistence`.

#### Anti-Pattern Checks

3. Hand-written mapping in every use case causes duplication and leakage.

### Events (Domain and Integration)

#### Core Rules

1. State changes should emit domain events.
2. Cross-system propagation should use integration events.

#### Design Rules

3. Use past-tense event names (for example `UserRegistered`).
4. Events describe facts, not commands.

#### Anti-Pattern Checks

5. Using events as commands is misuse.

### Transaction and Consistency

#### Core Rules

1. One use case should define one transaction boundary.
2. Cross-aggregate flows should favor eventual consistency.

#### Anti-Pattern Checks

3. Demanding strict consistency across many aggregates is usually a design smell.

### Ports (Hexagonal Core)

#### Core Rules

1. Domain or application defines ports as interfaces.
2. Infrastructure implements adapters for those ports.

#### Design Rules

3. Keep dependency direction inverted toward the core.

#### Anti-Pattern Checks

4. If domain imports Firebase SDK directly, the boundary is broken.

### Upgraded One-Line Summary

Use case decides what to do, domain decides how rules work, repository decides how aggregates are retrieved and stored, infrastructure decides how external technology is executed, and interface decides how requests enter and responses leave.

## Development Order Contract (Domain-First)

### Standard Flow (Default)

1. Define the use case intent first.
2. Model domain rules and domain objects.
3. Define ports for required dependencies.
4. Complete application orchestration.
5. Implement infrastructure adapters.
6. Wire interfaces (UI/API) last.

### Step Decision Rules

#### 1) Use Case (Entry First)

1. Name use cases with verb-first intent (`CreateXxx`, `SubmitXxx`, `InviteXxx`).
2. Start with flow skeleton before implementation details.
3. Make command input and result output explicit.

Rule focus: decide what to do before deciding how to do it.

#### 2) Domain (Core Modeling)

4. Push business rules into domain.
5. Define aggregates, entities, and value objects.
6. Define invariants that cannot be violated.

Rule focus: this step determines most correctness.

#### 3) Ports (Dependency Isolation)

7. Define repository and external-service interfaces in domain or application.
8. Keep Firebase, ORM, or SDK types out of these definitions.

Rule focus: abstract first, implement second.

#### 4) Application (Use Case Completion)

9. Orchestrate flow: load aggregate, invoke domain behavior, save, publish events.
10. Keep business rules out of application flow.

Rule focus: application composes the path, domain owns the rules.

#### 5) Infrastructure (External Plug-In)

11. Implement repositories and external adapters (Firestore, API, storage, email, AI, etc.).
12. Implement each declared port explicitly.

Rule focus: infrastructure is replaceable plug-in surface.

#### 6) Interface (Latest Stage)

13. Add API routes, actions, or UI wiring after core flow is stable.
14. Convert requests into command/query contracts.
15. Call use cases, do not inline business decisions.

Rule focus: interface is the last-mile translation layer.

### Forced Order Guardrails

1. Do not build UI first and backfill domain later.
2. Do not call repositories directly from interface.
3. Do not design infrastructure schema first and force domain to match it.
4. Do not start implementation before use-case intent is defined.

### Legacy Exception: Outside-In Strangler

1. Start from interface or API when delivery pressure requires it.
2. Wrap legacy behavior behind a use-case boundary first.
3. Incrementally move business logic into domain.
4. Converge back to the standard flow.

Rule focus: temporary mess is acceptable only if convergence is explicit and scheduled.

### Firebase x Next.js Runtime Reinforcement

1. Run use cases on server entry points (Server Actions, route handlers, or functions).
2. Keep domain in pure TypeScript with no Firebase imports.
3. Implement Firestore integration in infrastructure adapters.
4. Keep Next.js routes and RSC in interface composition.
5. Allow read-model realtime queries to consume Firestore snapshots directly when they are query-only.
6. Keep realtime query paths side-effect free and outside command use-case flow.

### Development-Order Essence

Define behavior first, define rules second, connect the outside world last.

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
