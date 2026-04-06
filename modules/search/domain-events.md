# Domain Events — search

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `search.feedback_submitted` | 使用者提交 RagQueryFeedback | `feedbackId`, `queryId`, `helpful`, `occurredAt` |
| `search.index_updated` | 向量索引更新完成（文件重新索引） | `documentId`, `chunkCount`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `ai` | `ai.ingestion_completed` | 新 chunks 的 embedding 已就緒，觸發向量索引更新 |

## 消費 search 事件的其他 BC

`search` 主要提供**同步查詢服務**（非事件），被 `notebook` 與 workspace-scoped ask/cite 介面直接呼叫：

```typescript
// notebook 呼叫 search 的同步查詢
const result = await searchApi.answerRagQuery({
  organizationId,
  userQuery,
  topK: 5,
});
```
