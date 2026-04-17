---
description: >
  Consolidated architecture standard: Hexagonal Architecture + DDD + Firebase + Genkit + Frontend State + Validation.
  Incorporates layer ownership, API-only boundaries, module shape, runtime split, Bounded Context rules, and subdomain design constraints.
applyTo: "**"
---

# Architecture Standard

System is designed under a combined architecture model:

Hexagonal Architecture (Ports and Adapters) + Domain-Driven Design (DDD)
with semantic-first (business-language-aligned domain modeling)
and Firebase Serverless Backend Architecture (Authentication, Firestore, Cloud Functions, Hosting)
and Genkit AI Orchestration Layer (AI Flows, Tool Calling, Prompt Pipelines)
and Frontend State Management Layer (Zustand for client state, XState for finite-state workflows)
and Schema Validation Layer (Zod for runtime type safety and domain validation)

> **Detailed file-scoped rules** are in `.github/instructions/` siblings (e.g. `domain-modeling`, `firestore-schema`, `nextjs-app-router`).
> This file is the **global system contract** that applies to every file in the repo.

---

# 1. Hexagonal Architecture (Ports and Adapters)

## 1.1 Dependency Direction (Fixed, Non-Negotiable)

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `domain/` must be framework-free and runtime-agnostic.
- `application/` depends only on `domain/` abstractions — never on infrastructure implementations.
- `infrastructure/` implements ports defined in `domain/`; it never depends on UI.
- `interfaces/` and `infrastructure/` are outer layers; do not nest them inside a generic `core/`.

Strict rule: `domain/` must never import Firebase, Genkit, React, Node.js `crypto`, HTTP clients, or ORMs.
Use `@lib-uuid` for UUID generation in domain layers.

## 1.2 Port Design

- Ports are **requirement-driven**, not technology-driven (e.g. `UserRepository`, not `FirestoreUserClient`).
- Port interfaces are defined in `domain/`; implementations live in `infrastructure/`.
- Every port must be mockable, swappable, and independently testable.

## 1.3 Adapter Rules

- Adapters implement ports only; they never contain business rules.
- All external SDKs (Firebase, Genkit, HTTP) exist only inside adapter implementations.
- Adapters translate I/O; they do not make business decisions.

---

# 2. Domain-Driven Design (DDD)

## 2.1 Layer Ownership

| Layer | Owns |
|---|---|
| `domain/` | Business rules, invariants, aggregates, entities, value objects, domain events, repository/port interfaces |
| `application/` | Use-case orchestration, transaction boundaries, command/query contracts |
| `infrastructure/` | Repository and adapter implementations only |
| `interfaces/` | Input/output translation, route/action/UI wiring |
| `index.ts` | Cross-module entry surface only — stable semantic capability contracts |

`index.ts` must NOT expose repository factories, container wiring, or internal composition helpers as public contracts.
Internal composition helpers belong under module-local `interfaces/` or `infrastructure/` paths.

## 2.2 Bounded Context Rules

- Bounded Context is a **semantic consistency boundary**, not just a folder.
- Every Bounded Context has its own Ubiquitous Language — do not mix models across contexts.
- Cross-context model translation must be explicit (Translator / ACL Mapper).
- Domain models must not be reused across contexts; use Published Language tokens instead.
- Bounded Context names must align with `src/modules/<context>/` folder names.

## 2.3 Subdomain Rules

- Subdomains represent **business capability boundaries** — split by business concern, not technical function.
- Default subdomain shape is **core-first**: `domain/`, `application/`, optional `ports/`.
- Subdomain `infrastructure/` and `interfaces/` are gate-based: only add them when there is clear, sustained external integration pressure that the bounded context root cannot absorb.
- One subdomain = one business capability. Never mix responsibilities.
- Subdomains communicate only through the parent module's `index.ts` boundary or domain events.

## 2.4 Main Domain Relationships (Upstream → Downstream)

```
platform → workspace → notion → notebooklm
platform → notion
platform → notebooklm
workspace → notebooklm
```

`platform` is governance upstream. Never invert this direction.

## 2.5 Use Case Decision Rules

- Use a use case only for **business behavior** (orchestration + invariant flow).
- Pure reads without business logic go to query handlers — `GetXxxUseCase` is a query smell.
- Complex business rules stay in `domain/`; use cases orchestrate flow only.
- Do not call repositories directly from `interfaces/`.

## 2.6 Development Order

1. Use-case contract first (actor, goal, main success scenario, failure branches).
2. `Use Case → Domain → (Application ↔ Ports, iterate) → Infrastructure → Interface`.
3. Do not build UI first and backfill domain later.
4. Do not force domain design from storage schema first.

---

# 3. Module Shape and Naming

## 3.1 Required Shape (Bounded Context Root)

```
src/modules/<context>/
  index.ts        ← cross-module entry surface only
  domain/
  application/
  infrastructure/
  interfaces/
  README.md
  AGENT.md
```

## 3.2 Naming Conventions

| Element | Pattern |
|---|---|
| Use case file | `verb-noun.use-case.ts` |
| Repository interface | `PascalCaseRepository` (no `I` prefix) |
| Repository implementation | `TechnologyPascalCaseRepository` |
| Domain event discriminant | `module-name.action` (kebab-case) |
| Domain event naming | Past tense PascalCase (e.g. `WorkspaceCreated`) |

## 3.3 Cross-Module Boundary Rules

- Cross-module collaboration must go through `src/modules/<target>/index.ts` or explicit domain events.
- Do not import another module's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Cross-module route components must use props-scoped scope (`accountId`, `workspaceId`); do not consume another module's context provider directly.

---

# 4. Runtime Boundary (Next.js / py_fn)

- **Next.js** owns: browser-facing interactions, auth/session, server actions, route orchestration, user-facing AI chat.
- **`py_fn/`** owns: parsing, cleaning, taxonomy, chunking, embedding, and background/retryable jobs.
- Do not run heavy ingestion/embedding pipelines inside Next.js server actions.
- Do not add browser-facing auth/session/chat logic inside `py_fn/`.
- Cross-runtime handoff must use an explicit contract (QStash message, Firestore trigger, or event).

---

# 5. Backend Architecture (Firebase)

Firebase is the only backend runtime platform.

- Firestore accessed only via `infrastructure/` repository implementations.
- Cloud Functions must not contain domain logic.
- Authentication state must be mapped into domain identity before crossing into `domain/`.
- `workspace` must not call Firestore directly; it must use `platform/api` Service APIs (FileAPI, PermissionAPI, etc.).

---

# 6. AI Architecture (Genkit)

Genkit is the AI orchestration layer.

- AI is treated as an **external untrusted actor**.
- AI output must be validated via Zod before entering any use case or domain.
- AI must not directly mutate domain state or write to Firestore.
- Shared AI capability ownership (provider, quota, safety policy) belongs to `platform.ai`.
- `notion` and `notebooklm` **consume** `platform.ai` capability — they do not own an `ai` subdomain.

---

# 7. Frontend State Management

- **Zustand**: lightweight client state; no domain logic, no business rule persistence.
- **XState**: complex finite-state workflows aligned with use case transitions; must represent explicit states and events.
- UI state ≠ domain state. Never let UI interaction drive domain model design.

---

# 8. Validation (Zod)

- Zod is the only runtime validation tool.
- All external inputs must be validated via Zod before reaching use cases.
- Domain invariants are enforced **after** Zod validation, inside aggregates.
- Zod schemas must NOT contain business logic.

```
External Input → Zod Validation → Application Use Case → Domain
```

---

# 9. Enforcement Priority

When ambiguity exists, apply in this order:

1. Domain integrity (never compromise)
2. Bounded context isolation
3. Dependency direction
4. Infrastructure convenience

Never sacrifice domain purity for implementation simplicity.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-skill
#use skill hexagonal-ddd

