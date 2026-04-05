# Domain Events ??search

## ?澆鈭辣

| 鈭辣 | 閫貊璇辣 | ?甈? |
|------|---------|---------|
| `search.feedback_submitted` | 雿輻??鈭?RagQueryFeedback | `feedbackId`, `queryId`, `helpful`, `occurredAt` |
| `search.index_updated` | ??蝝Ｗ??湔摰?嚗?隞園??啁揣撘? | `documentId`, `chunkCount`, `occurredAt` |

## 閮鈭辣

| 靘? BC | 閮鈭辣 | 銵? |
|---------|---------|------|
| `ai` | `ai.ingestion_completed` | ??chunks ??embedding 撌脣停蝺?閫貊??蝝Ｗ??湔 |
| `wiki` | `wiki.node_activated` | ?郊?湔蝭暺摰孵??蝝Ｗ? |

## 瘨祥 search 鈭辣?隞?BC

`search` 銝餉???**?郊?亥岷??**嚗?鈭辣嚗?鋡?`notebook` ??wiki RAG UI ?湔?澆嚗?

```typescript
// notebook ?澆 search ??甇交閰?
const result = await searchApi.answerRagQuery({
  organizationId,
  userQuery,
  topK: 5,
});
```
