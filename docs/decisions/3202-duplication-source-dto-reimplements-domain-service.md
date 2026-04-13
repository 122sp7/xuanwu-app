# 3202 Duplication — Source DTO Re-implements Domain Service Logic

- Status: Accepted
- Date: 2026-04-13
- Category: Modularity Smells > Duplication

## Context

`modules/notebooklm/subdomains/source/application/dto/source.dto.ts` contains
a function `resolveSourceOrganizationId` that re-implements the exact same logic
as `modules/notebooklm/subdomains/source/domain/services/resolve-source-organization-id.service.ts`.

### Domain service (canonical)

```typescript
export function resolveSourceOrganizationId(
  accountType: "user" | "organization",
  accountId: string,
): string {
  return accountType === "organization" ? accountId : `personal:${accountId}`;
}
```

### Application DTO (duplicate)

```typescript
export function resolveSourceOrganizationId(
  accountType: "user" | "organization",
  accountId: string,
): string {
  return accountType === "organization" ? accountId : `personal:${accountId}`;
}
```

The DTO file comment says "Wraps the domain service to provide a clean
application-layer contract" but actually **re-implements** the logic instead
of delegating to the domain service.

This violates the DTO re-export convention (ADR memory): "Application DTO files
must re-export only types from domain. Runtime values must be inlined or wrapped."

In this case, the function should delegate to the domain service rather than
duplicating its implementation.

## Decision

Replace the duplicate implementation in `source.dto.ts` with a re-export
from the domain service:

```typescript
export { resolveSourceOrganizationId } from "../../domain/services/resolve-source-organization-id.service";
```

This preserves the application-layer import path for consumers while
eliminating the duplicate logic.

## Consequences

Positive:
- Single source of truth for organization ID resolution logic.
- Future changes to the resolution strategy only need to be made in domain service.

Cost:
- Minimal — one-line change in the DTO file.

## Related ADRs

- **ADR 3200** (Duplication): Parent smell category
