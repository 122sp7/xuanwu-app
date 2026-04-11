# Knowledge Analytics

知識使用行為量測。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Baseline
- **Status**: Stub — awaiting use case definition

## Layers

| Layer | Purpose |
|-------|----------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
