# Evaluation

建立品質評估與回歸比較的正典邊界。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Tier 2 — RAG Pipeline (Migration Target)
- **Status**: Stub — receiving migration from `ai` subdomain

## Migration From `ai`

| Class | Migration source |
|-------|------------------|
| `SubmitRagFeedbackUseCase` | ai/application/use-cases |
| `IRagQueryFeedbackRepository` | ai/domain/repositories |
| `RagFeedback` | ai/domain/entities |

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
