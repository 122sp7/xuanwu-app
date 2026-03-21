# shared-types

## Purpose

Core shared domain types and contracts used across all modules. This package is the foundation of the CommandResult pattern and provides the primitive types that all domain entities depend on.

## Belongs to Module

Cross-cutting — used by all domain modules.

## Public API

### Types

| Export | Description |
|--------|-------------|
| `ID` | Opaque string identifier type |
| `PaginationParams` | Page + limit pagination contract |
| `PaginatedResponse<T>` | Paginated result envelope |
| `DomainError` | Structured error with `code`, `message`, `context` |
| `CommandSuccess` | Successful command result |
| `CommandFailure` | Failed command result |
| `CommandResult` | Discriminated union: `CommandSuccess \| CommandFailure` |
| `Timestamp` | Firestore Timestamp shim (no SDK dependency) |

### Functions

| Export | Description |
|--------|-------------|
| `commandSuccess(aggregateId, version)` | Construct a `CommandSuccess` |
| `commandFailure(error)` | Construct a `CommandFailure` from a `DomainError` |
| `commandFailureFrom(code, message, context?)` | Construct a `CommandFailure` inline |
| `formatDate(date)` | Format `Date` as ISO date string |
| `generateId()` | Generate a UUID v4 string |

## Dependencies

**None** — zero external dependencies. This package depends only on TypeScript builtins.

## Example

```typescript
import {
  type CommandResult,
  commandSuccess,
  commandFailureFrom,
} from "@shared-types";

async function myUseCase(): Promise<CommandResult> {
  try {
    // ...business logic...
    return commandSuccess("abc123", 1);
  } catch (err) {
    return commandFailureFrom("USE_CASE_FAILED", "Something went wrong");
  }
}
```

## Rules

- Do not import internal files — only import from `@shared-types`
- Do not add framework-specific types (React, Next.js, Firebase) to this package
- Keep this package dependency-free
