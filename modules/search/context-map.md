# Context Map — search

## 上游（依賴）

### ai → search（Customer/Supplier）

- `ai.ingestion_completed` 通知 `search` 更新向量索引
- `search` 依賴 `ai` 生成的 IngestionChunk（embedding 向量）

### knowledge / knowledge-base / source → search（Indirect Upstream）

- `knowledge`、`knowledge-base` 與 `source` 提供被索引的內容來源
- `search` 透過 `ai` 所產出的 ingestion 結果建立可檢索表示

---

## 下游（被依賴）

### search → notebook（Customer/Supplier）

- `notebook` 呼叫 `search/api.answerRagQuery()` 取得 RAG chunks 與答案
- 這是同步查詢，不是事件

### search → ask/cite interfaces（Interfaces）

- Notebook 與 workspace-scoped ask/cite 介面透過 `search/api` 呼叫同步查詢
- UI 層應透過模組公開表面取得查詢能力，而不是依賴已刪除的 wiki 專屬路由

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
| knowledge / knowledge-base / source → search | content sources | search | Indirect upstream via ai ingestion |
| search → notebook | search | notebook | Customer/Supplier（同步） |
| search → ask/cite interfaces | search | app/ | Conformist |
