---
name: zod-validation
description: >-
  Zod Schema Validation skillbook for Xuanwu. Use when designing or reviewing Zod validation placement
  at external input boundaries, domain brand types, and infrastructure output validation. Covers
  the three validation levels, schema design rules, brand types, and anti-patterns.
user-invocable: true
disable-model-invocation: false
---

# Zod Schema Validation

Use this skill when the task involves input validation, domain value object schema design,
Firestore output validation, AI output validation, or Zod placement across layers.

## Research Basis

Context7-verified + Xuanwu-specific:

- Zod is a TypeScript-first schema validation library that provides both runtime validation and static type inference.
- `z.infer<typeof Schema>` eliminates type duplication between schema and TypeScript interface.
- `z.brand()` enables nominal typing in TypeScript, preventing inadvertent identity confusion between values of the same primitive type.
- Validation should happen at system boundaries — not inside business logic.

## Working Synthesis

Zod in Xuanwu means:

1. All external inputs are validated at boundaries before reaching use cases.
2. Domain value objects use Zod brand types for compile-time and runtime type safety.
3. Infrastructure adapters validate all external system outputs before mapping to domain.
4. Zod schemas must not contain business logic — that belongs in domain aggregates.

---

## Three Validation Levels

### Level 1 — External Input Boundary (interfaces/)

**Purpose**: Reject malformed data at the system edge before it reaches the application layer.

**Location**: `interfaces/` Server Actions, tRPC input handlers, route handlers.

```typescript
// modules/workspace/interfaces/actions/create-workspace.action.ts
'use server';
import { z } from 'zod';

const CreateWorkspaceInputSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  organizationId: z.string().uuid(),
  visibility: z.enum(['private', 'team', 'public']).default('private'),
});

export async function createWorkspaceAction(rawInput: unknown) {
  // Parse at boundary — ZodError is thrown immediately if invalid
  const input = CreateWorkspaceInputSchema.parse(rawInput);

  // input is now fully typed: { name: string; organizationId: string; visibility: 'private' | 'team' | 'public' }
  return createWorkspaceUseCase.execute(input);
}
```

**Rules**:
- `rawInput` must be typed as `unknown`, not `any`.
- Use `.parse()` (throws on failure) rather than `.safeParse()` unless the caller needs structured error handling.
- Never pass `rawInput` directly to a use case without parsing.

---

### Level 2 — Domain Value Objects (domain/)

**Purpose**: Enforce nominal typing so `WorkspaceId` and `UserId` cannot be accidentally swapped at compile time.

**Location**: `domain/value-objects/`, `domain/events/`.

#### Identity Value Objects (branded UUID)

```typescript
// modules/workspace/domain/value-objects/WorkspaceId.ts
import { z } from 'zod';

export const WorkspaceIdSchema = z.string().uuid().brand('WorkspaceId');
export type WorkspaceId = z.infer<typeof WorkspaceIdSchema>;
```

#### Semantic Value Objects (validated primitives)

```typescript
// modules/workspace/domain/value-objects/WorkspaceName.ts
import { z } from 'zod';

export const WorkspaceNameSchema = z.string()
  .min(1, 'Name cannot be empty')
  .max(100, 'Name exceeds 100 characters')
  .trim()
  .brand('WorkspaceName');

export type WorkspaceName = z.infer<typeof WorkspaceNameSchema>;
```

#### Domain Event Payload Schemas

```typescript
// modules/workspace/domain/events/WorkspaceCreated.ts
import { z } from 'zod';
import { DomainEventBaseSchema } from '@shared/domain/events';

export const WorkspaceCreatedEventSchema = DomainEventBaseSchema.extend({
  type: z.literal('workspace.created'),
  payload: z.object({
    workspaceId: z.string().uuid(),
    organizationId: z.string().uuid(),
    name: z.string(),
    ownerId: z.string(),
    createdAt: z.string().datetime(),
  }),
});

export type WorkspaceCreatedEvent = z.infer<typeof WorkspaceCreatedEventSchema>;
```

**Rules**:
- Domain layer may ONLY use Zod for schema definitions and brand types.
- No I/O, no framework imports, no HTTP calls in `domain/`.
- Do NOT write business logic inside `.refine()` or `.superRefine()` callbacks in `domain/` — keep domain schemas as structural validators only.

---

### Level 3 — Infrastructure Adapter Output (infrastructure/)

**Purpose**: Validate external system output (Firestore, AI, third-party APIs) before mapping to domain entities.

**Location**: `infrastructure/` repository implementations, AI adapter implementations.

#### Firestore Document Validation

```typescript
// modules/workspace/infrastructure/schemas/firestore-workspace.schema.ts
import { z } from 'zod';

export const FirestoreWorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  organizationId: z.string().uuid(),
  ownerId: z.string(),
  visibility: z.enum(['private', 'team', 'public']),
  lifecycle: z.enum(['active', 'archived', 'deleted']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// In repository:
const raw = (await docRef.get()).data();
const validated = FirestoreWorkspaceSchema.parse(raw);   // throws if schema has drifted
return Workspace.reconstitute(validated);
```

#### AI Flow Output Validation

```typescript
// In AI adapter:
const rawAIResult = await runFlow(synthesisFlow, input);
const validated = SynthesisOutputSchema.parse(rawAIResult);  // validate before returning to use case
return validated;
```

**Rules**:
- Never cast with `as SomeType` without Zod validation.
- `z.object().passthrough()` is forbidden for production data paths.
- A `ZodError` from Level 3 is an infrastructure error — log it with the raw input for debugging.

---

## Schema Design Rules

### Rule 1: `z.infer<>` over parallel interface definition

```typescript
// ✅ Correct: one source of truth
const UserInputSchema = z.object({ name: z.string(), email: z.string().email() });
type UserInput = z.infer<typeof UserInputSchema>;

// ❌ Wrong: type duplicated separately
interface UserInput { name: string; email: string; }
const UserInputSchema = z.object({ name: z.string(), email: z.string().email() });
```

### Rule 2: One canonical schema location

Each schema lives in ONE place. Choose `domain/value-objects/` for domain schemas and `infrastructure/schemas/` for persistence schemas. Do not copy.

### Rule 3: No business logic in schemas

```typescript
// ✅ Correct: structural validation only
const PriceSchema = z.number().positive().max(999999);

// ❌ Wrong: business rule in schema
const PriceSchema = z.number().refine(
  (p) => p > minimumAllowedPrice(),   // business rule
  'Price below minimum allowed'
);
// Business rules belong in domain aggregate, not in Zod schema
```

### Rule 4: Explicit error messages for user-facing schemas

```typescript
// ✅ Correct: descriptive messages for Level 1 boundary schemas
const CreateWorkspaceSchema = z.object({
  name: z.string()
    .min(1, 'Workspace name is required')
    .max(100, 'Workspace name must be 100 characters or fewer'),
  organizationId: z.string().uuid('Invalid organization ID format'),
});
```

### Rule 5: `z.discriminatedUnion` for event type safety

```typescript
// ✅ Correct: use discriminatedUnion for domain events
const DomainEventSchema = z.discriminatedUnion('type', [
  WorkspaceCreatedEventSchema,
  WorkspaceArchivedEventSchema,
  MemberInvitedEventSchema,
]);
```

---

## Placement Summary

| Schema Type | Location | Purpose |
|---|---|---|
| External input | `interfaces/` Server Action / route | Level 1 boundary validation |
| Brand types | `domain/value-objects/` | Nominal type safety |
| Event payloads | `domain/events/` | Domain event structure |
| Firestore document | `infrastructure/schemas/` | Level 3 external system output |
| AI output | `infrastructure/ai/` schemas | Level 3 AI output validation |
| Command/query DTOs | `application/dtos/` (optional) | Application-layer input typing |

---

## Red Flags

- `rawInput: any` passed to a use case without Zod parsing.
- `as SomeType` used to cast Firestore or AI output.
- `z.any()` or `z.unknown()` in production data paths without subsequent `.parse()`.
- `z.object().passthrough()` in infrastructure schemas.
- Same schema defined in both `domain/` and `application/` (duplication).
- Business logic inside `.refine()` in a `domain/` schema.
- Zod imported in `domain/` for anything other than schema or brand-type definition.
- `SafeParseReturnType` ignored without logging the `ZodError`.

## Review Loop

1. Identify which validation level applies: boundary / domain / infrastructure.
2. Verify schema is in the correct location for that level.
3. Verify `z.infer<>` is used instead of a parallel interface.
4. Verify no business logic is inside Zod `refine` or `superRefine` callbacks.
5. Verify `as SomeType` casts are replaced with Zod parsing.
6. Verify `z.discriminatedUnion` is used for event type unions.
7. Verify error messages are descriptive for Level 1 user-facing schemas.

## Output Contract

When this skill is used, provide:

1. Validation level classification (Level 1 / 2 / 3),
2. Schema placement path,
3. Corrected schema definition,
4. Removed `as SomeType` casts replaced with validated schemas,
5. Anti-pattern findings.
