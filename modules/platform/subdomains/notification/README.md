# Notification

Notification delivery and preference management.

## Ownership

- **Bounded Context**: platform
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
