# Grounding

建立引用對齊與可追溯證據的正典邊界。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Tier 2 — RAG Pipeline (Migration Target)
- **Status**: Stub — receiving migration from `ai` subdomain

## Migration From `ai`

| Class | Migration source |
|-------|------------------|
| `RagCitationBuilder` | ai/domain/services |
| `RagCitation` | ai/domain/entities |
| `RelevanceScore` | ai/domain/value-objects |

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
