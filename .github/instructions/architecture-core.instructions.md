---
description: 'Consolidated Hexagonal DDD architecture rules: layer ownership, API-only boundaries, module shape, and bounded-context dependency direction.'
applyTo: 'src/modules/**/*.{ts,tsx,js,jsx,md}'
---

# Architecture Core

## Core Boundary Rules

- Determine owning bounded context and subdomain from `docs/**/*` before choosing file placement.
- Cross-module collaboration must go through `src/modules/<target>/index.ts` or explicit events.
- Cross-module route components must be props-scoped (`accountId`, `workspaceId`, optional `currentUserId`) from the composition owner; do not consume another module's context provider directly.
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
- `index.ts`: cross-module entry surface with stable semantic capability contracts.
- `index.ts` must not expose repository factories, container wiring, or other internal composition helpers as public contracts.
- Internal composition helpers belong under module-local `interfaces/` or `infrastructure/` paths unless a real cross-module semantic boundary requires promotion.

## Use Case Decision Rules

- Use a use case only for business behavior.
- Pure reads without business logic go to query handlers.
- Keep UI state and interaction logic in `interfaces/`.
- Use cases orchestrate flow; complex business rules stay in `domain/`.
- `GetXxxUseCase` is usually a query smell.

## Development Order

- Use-case contract first: actor, goal, main success scenario, failure branches.
- Recommended order: `Use Case -> Domain -> (Application <-> Ports iterate as needed) -> Infrastructure -> Interface`.
- Do not build UI first and backfill domain later.
- Do not call repositories directly from `interfaces/`.
- Do not force domain design from storage schema first.

## Module Shape and Naming

- Bounded-context root required shape: `index.ts`, `adapters/`, `subdomains/`, `shared/`, `orchestration/`, `README.md`, `AGENTS.md`.
- Subdomain default shape follows core-first (`domain/`, `application/`, optional `ports/`); subdomain `infrastructure/` and `interfaces/` are gate-based, not always required.
- Public boundary is `index.ts`; cross-module consumers import only from module root `index.ts`.
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

## Zod — System-Level Validation Layer

Zod is the system's runtime validation baseline. It is applied at three distinct levels with different purposes:

### Level 1 — External Input Boundary (interfaces / Server Action)

All external input (Server Action args, tRPC input, API route body) must pass through a Zod schema **before** reaching the application layer. If parsing fails, return a structured error immediately — do not let unparsed data propagate.

```typescript
// ✅ Correct: parse at Server Action boundary
const CreateWorkspaceInputSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  organizationId: z.string().uuid(),
});

export async function createWorkspaceAction(rawInput: unknown) {
  const input = CreateWorkspaceInputSchema.parse(rawInput);  // throws ZodError if invalid
  return createWorkspaceUseCase.execute(input);
}
```

### Level 2 — Domain Value Objects (domain layer)

Value objects in `domain/` use Zod brand types to enforce type safety at compile time and runtime. This is the only place Zod is permitted inside `domain/`.

```typescript
// ✅ Correct: brand type in domain
export const WorkspaceIdSchema = z.string().uuid().brand('WorkspaceId');
export type WorkspaceId = z.infer<typeof WorkspaceIdSchema>;
```

`domain/` must not import Zod for anything other than schema definitions and brand types. No I/O, no HTTP, no Firebase.

### Level 3 — External System Output (infrastructure / AI adapters)

Any data arriving from external systems (Firestore reads, AI flow outputs, third-party APIs) must be validated with a Zod schema in the infrastructure/adapter layer before the typed result is returned to the application layer.

```typescript
// ✅ Correct: validate Firestore result before returning to use case
const raw = (await docRef.get()).data();
return FirestoreWorkspaceSchema.parse(raw);  // throws if schema drifted

// ❌ Wrong: cast without validation
return raw as WorkspaceSnapshot;
```

### Zod Placement Rules

| Where | Use Zod for |
|---|---|
| `interfaces/` (Server Action, route) | External input parsing before use-case call |
| `domain/value-objects/` | Brand type definitions only |
| `domain/events/` | Domain event payload schemas |
| `infrastructure/` adapters | External system output validation |
| `application/` DTOs | Command/query input schemas (optional, defer to boundary) |

### Anti-Patterns

- ❌ Passing `rawInput: unknown` into a use case without Zod parsing at the boundary
- ❌ Using `as SomeType` to cast Firestore or AI output without validation
- ❌ Importing Zod in `domain/` for anything other than schema and brand-type definitions
- ❌ Duplicating the same schema in both `domain/` and `application/` — keep it in one place

### Additional Zod Guardrails

- `z.object().passthrough()` is forbidden for production data paths — use strict schemas.
- `z.any()` and `z.unknown()` without a subsequent `.parse()` or `.safeParse()` call are validation gaps.
- Zod schemas must not contain business logic — invariants belong in domain aggregates.

## Review Checklist

Use before merging any change touching `src/modules/` or `src/app/`.

### Dependency Direction
- [ ] `interfaces/` does not call `infrastructure/` or `domain/` internals directly?
- [ ] `application/` depends only on `domain/` abstractions, not infrastructure implementations?
- [ ] `domain/` has zero imports of Firebase / React / HTTP client / ORM?
- [ ] `index.ts` exposes only the cross-module public surface, no repository factories or container wiring?

### Import Boundary
- [ ] Cross-module calls go through `src/modules/<target>/index.ts` only — no direct internal path imports?
- [ ] Route components pass scope via props (`accountId`, `workspaceId`) and do not call foreign module context providers?

### Module Shape
- [ ] Bounded context root contains `index.ts`, `domain/`, `application/`, `infrastructure/`, `interfaces/`?
- [ ] Subdomains follow core-first shape (`domain/`, `application/`, optional `ports/`) — `infrastructure/` and `interfaces/` are gate-based?

### Layer Coupling Smells
- [ ] No God Use Case mixing business rules with infrastructure logic?
- [ ] No anemic model (aggregate with only getters/setters and no business methods)?
- [ ] No layer skipping (`interfaces/` calling repositories directly)?

### Runtime Boundary
- [ ] Next.js does not execute parsing / chunking / embedding pipelines directly?
- [ ] `fn/` contains no browser-facing auth / session / chat logic?

## Validation

- Use `eslint.config.mjs` restricted-import and boundary rules as enforcement source.
- Re-check changed imports under `@/modules/` for API-only access.
- Keep dependency flow acyclic unless an explicit event contract documents an exception.

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill hexagonal-ddd
