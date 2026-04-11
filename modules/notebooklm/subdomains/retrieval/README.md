# Retrieval

建立查詢召回與排序策略的正典邊界。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Tier 2 — RAG Pipeline (Migration Target)
- **Status**: Stub — receiving migration from `ai` subdomain

## Migration From `ai`

| Class | Migration source |
|-------|------------------|
| `IRagRetrievalRepository` | ai/domain/repositories |
| `IKnowledgeContentRepository` | ai/domain/repositories |
| `RagScoringService` | ai/domain/services |
| `RagRetrievedChunk` (entity) | ai/domain/entities |

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
