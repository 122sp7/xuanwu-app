# shared-validators

## Purpose

Zod-based input validation schemas for cross-cutting concerns shared across multiple modules. Domain-specific validators should live in their owning module's `interfaces/` layer.

## Belongs to Module

Cross-cutting — used across identity, workspace, and other modules that share common input shapes.

## Public API

### Schemas

| Export | Description |
|--------|-------------|
| `idSchema` | UUID string validation |
| `paginationSchema` | Page + limit with defaults |
| `signInSchema` | Email + password sign-in |
| `registerSchema` | Email + password + name registration |
| `createWorkspaceSchema` | Workspace name + accountId + accountType |
| `taskSchema` | Full task object schema |

### Inferred Types

| Export | Description |
|--------|-------------|
| `SignInInput` | `z.infer<typeof signInSchema>` |
| `RegisterInput` | `z.infer<typeof registerSchema>` |
| `CreateWorkspaceInput` | `z.infer<typeof createWorkspaceSchema>` |
| `TaskSchemaType` | `z.infer<typeof taskSchema>` |

## Dependencies

- `zod` — schema validation library

## Example

```typescript
import { signInSchema, type SignInInput } from "@shared-validators";

function validateSignIn(input: unknown): SignInInput {
  return signInSchema.parse(input);
}
```

## Rules

- Keep only truly shared cross-cutting schemas here
- Domain-specific schemas belong in their module's `interfaces/` layer
- Do not put business logic inside validators
