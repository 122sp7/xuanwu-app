# Synthesis

RAG 合成、摘要與洞察生成。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Tier 2 — RAG Pipeline (Migration Target)
- **Status**: Stub — receiving migration from `ai` subdomain

## Migration From `ai`

| Class | Migration source |
|-------|------------------|
| `AnswerRagQueryUseCase` | ai/application/use-cases |
| `RagPromptBuilder` | ai/domain/services |
| `GenkitRagGenerationAdapter` | ai/infrastructure |
| `IRagGenerationRepository` (port) | ai/domain/repositories |

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
