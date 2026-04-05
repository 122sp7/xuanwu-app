# Context Map — ai

## 上游（依賴）

### source → ai（Customer/Supplier）

- `source.upload_completed` 觸發 `ai` 建立 IngestionJob
- `ai` 依賴 `source/api` 取得 SourceDocument 元資料（storageUrl、mimeType）

---

## 下游（被依賴）

### ai → search（Customer/Supplier）

- `ai.ingestion_completed` 通知 `search` 更新向量索引
- `search` 的 RAG 查詢依賴 `ai` 生成的 IngestionChunk

### ai → py_fn（Runtime Boundary）

**這不是 BC 間的 DDD 整合，而是 runtime 邊界分割：**

```
Next.js ai module ──[Firestore Job Record]──► py_fn/ worker
                   ──[Firebase Storage URL]──► py_fn/ worker
py_fn/ worker ──[Chunk + Embedding 寫回 Firestore]──► Next.js reads
```

- Next.js 端：Job 建立、狀態查詢、API
- `py_fn/`：parse / chunk / embed 實際執行

---

## IDDD 整合模式總結

| 關係 | 上游 | 下游 | 模式 |
|------|------|------|------|
| source → ai | source | ai | Published Language (Events) |
| ai → search | ai | search | Published Language (Events) |
| ai → py_fn | Next.js | py_fn | Runtime Boundary（非 DDD 邊界） |
