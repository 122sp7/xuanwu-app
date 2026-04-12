# Synthesis

完整 RAG pipeline：retrieval → grounding → answer generation → evaluation/feedback。

## Ownership

- **Bounded Context**: notebooklm
- **Subdomain**: synthesis (Active)
- **Status**: Consolidated — all RAG pipeline responsibilities

## Internal Facets

The RAG pipeline is organized as internal domain facets within this single subdomain:

| Facet | Responsibility | Key Types |
|-------|---------------|-----------|
| retrieval | 查詢召回與排序策略、向量搜尋 | RetrievedChunk, IChunkRetrievalPort, RagScoringService |
| grounding | 引用對齊與可追溯證據 | Citation, GroundingEvidence, ICitationBuilder, RagCitationBuilder |
| generation | RAG 合成、摘要與洞察生成 | GenerateAnswerInput/Output, IGenerationPort, RagPromptBuilder |
| evaluation | 品質評估、feedback 收集 | QualityFeedback, IFeedbackPort, SubmitRagQueryFeedbackUseCase |

## Key Components

| Component | Layer | Purpose |
|-----------|-------|---------|
| AnswerRagQueryUseCase | application | 完整 RAG Q&A 流程 orchestration |
| SubmitRagQueryFeedbackUseCase | application | 用戶品質 feedback 收集 |
| FirebaseRagRetrievalAdapter | infrastructure | Firestore 向量/稀疏檢索 |
| GenkitRagGenerationAdapter | infrastructure | Genkit AI answer generation |
| FirebaseRagQueryFeedbackAdapter | infrastructure | Firestore feedback 持久化 |
| FirebaseKnowledgeContentAdapter | infrastructure | Knowledge 文件查詢與 reindex |
| RagQueryView | interfaces | 最小化 RAG 查詢 UI |

## Development Order

When implementing, follow inside-out:
1. Domain → 2. Application → 3. Ports (if needed) → 4. Infrastructure → 5. Interfaces
