# Source

Source document ingestion and reference management.

## Ownership

- **Bounded Context**: notebooklm
- **Status**: Active

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Local public boundary for same bounded context access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, events, repositories, and business rules |

> By default, `infrastructure/` and `interfaces/` live at the bounded-context root and are grouped by subdomain. Add local `infrastructure/` or `interfaces/` inside a subdomain only when the mini-module gate is explicitly justified.

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces

## Scope Mapping

- Source flows receive shell-derived scope as `accountId`, `workspaceId`, and `accountType = "user" | "organization"` from upstream workspace composition.
- This subdomain derives an internal `organizationId` for organization-scoped storage and retrieval after boundary translation; it must not be documented or consumed as a shell route param.
- Personal-account scope currently maps to a synthetic internal organization token prefixed with `personal:` so source storage can remain organization-scoped without sharing namespaces with organization accounts.
- `actorAccountId` tracks the calling account scope for source workflows and remains distinct from concrete user identifiers such as `createdByUserId`.
