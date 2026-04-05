# Context Map — search

## 上游（依賴）

### ai → search（Customer/Supplier）

- `ai.ingestion_completed` 通知 `search` 更新向量索引
- `search` 依賴 `ai` 生成的 IngestionChunk（embedding 向量）

### wiki → search（Customer/Supplier）

- `wiki.node_activated` 觸發 `search` 更新節點向量表示

---

## 下游（被依賴）

### search → notebook（Customer/Supplier）

- `notebook` 呼叫 `search/api.answerRagQuery()` 取得 RAG chunks 與答案
- 這是同步查詢，不是事件

### search → Wiki UI（Interfaces）

- `RagView`, `RagQueryView` 從 `modules/search` root barrel 匯出（非 /api）
- Wiki 頁面直接呼叫 `search/api` Server Actions

---

## Import 路由

```
server code (Server Action, API route) → import from @/modules/search/api
client code (React Component)          → import from @/modules/search (root barrel)
```

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| ai → search | ai | search | Published Language (Events) |
| wiki → search | wiki | search | Published Language (Events) |
| search → notebook | search | notebook | Customer/Supplier（同步） |
| search → Wiki UI | search | app/ | Conformist |
