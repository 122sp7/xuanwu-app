# AI (TRANSITIONAL — Non-Strategic)

> ⚠️ 此子域為過渡性（Transitional）邊界，不是最終戰略設計。
> 所有責任應遷移至 Tier 2 目標子域後逐步移除。

AI-powered RAG pipeline（過渡中）。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain Type**: Transitional (Tech Debt — Migration in Progress)
- **Status**: Active but non-strategic — Strangler Pattern migration target

## Migration Responsibility Map

| 現有類別 | 遷移目標 |
|---------|---------|
| `AnswerRagQueryUseCase` | → synthesis |
| `SubmitRagFeedbackUseCase` | → evaluation |
| `RagPromptBuilder` | → synthesis |
| `GenkitRagGenerationAdapter` | → synthesis |
| `RagCitationBuilder`, `RagCitation` | → grounding |
| `RelevanceScore` | → grounding |
| `IRagRetrievalRepository`, `RagScoringService` | → retrieval |
| `IKnowledgeContentRepository` | → retrieval |
| `IRagQueryFeedbackRepository` | → evaluation |
| `RagRetrievedChunk` (entity) | → retrieval |

## Layers

| Layer | Purpose |
|-------|---------|
| `api/` | Public boundary for cross-subdomain access |
| `application/` | Use case orchestration and DTOs |
| `domain/` | Entities, value objects, and business rules |
| `infrastructure/` | Adapters, persistence, and external integrations |
| `interfaces/` | UI components, hooks, actions, and queries |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

## Development Order

新功能**不得**在此子域開發。一律在目標子域 (retrieval/grounding/synthesis/evaluation) 建立新能力，再用 Strangler Pattern 將此子域的現有類別遷移過去。
