# Knowledge Versioning

全域版本快照策略管理。

## Ownership

- **Bounded Context**: notion
- **Subdomain Type**: Tier 3 — Medium-Term Stub
- **Status**: Stub — awaiting use case definition

## Distinction from `collaboration.Version`

| | `collaboration.Version` | `knowledge-versioning` |
|---|---|---|
| Granularity | 每次編輯的細粒度快照（per-change history） | 全域 Checkpoint 策略（workspace-level snapshot） |
| Trigger | 協作動作（comment, edit event） | 策略性里程碑（release, sprint end） |
| Retention | 短期逐次紀錄 | 長期保留策略 |
| Owner | collaboration subdomain | knowledge-versioning subdomain |

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
