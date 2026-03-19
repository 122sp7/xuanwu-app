# ADR 006: RAG Query Execution Contract

## 狀態 (Status)
Accepted

## 背景 (Context)

Query pipeline 若僅有高層描述，實作時容易出現：

1. 檢索過濾與 tenant 邊界被忽略。
2. prompt 組裝缺乏一致規則，造成答案品質飄移。
3. streaming 回傳格式不穩定，前端難以維護。

## 決策 (Decision)

固定 query 執行契約如下：

1. Query entrypoint 在 Next.js Route Handler 或 Server Action。
2. Query embedding 後，必須先過 tenant/workspace filter gate。
3. retrieval 結果經 context 組裝後才可交由 Genkit 生成。
4. 回應採 streaming-first，並回傳可追蹤 metadata。

## 設計細節 (Design)

### 1. Query execution sequence

```text
receive query
 -> preprocess
 -> query embedding
 -> vector search with filters
 -> top-k chunks
 -> context assembly
 -> LLM generation
 -> stream response
```

### 2. Retrieval gates

每次查詢都必須通過：

1. Organization gate: `organizationId` 必填
2. Workspace gate: 若查詢只針對單一 workspace，`workspaceId` 必填；若做 organization-wide retrieval，可省略
3. Taxonomy gate: 有指定分類時必須精確套用
4. Freshness gate: 僅查詢 `documents.status=ready` 對應 chunks

若任一 gate 不通過，必須立即回傳可解釋錯誤，不進 LLM。

### 3. Context assembly contract

組裝 context 時必須保留：

- `docId`
- `chunkIndex`
- `page`
- `taxonomy`

規則：

1. context 需保留可引用來源資訊
2. 不得混入不同 organization 的 chunks
3. 若 top-k 為空，需回傳明確 no-context response

### 4. Generation contract

Genkit flow 輸入至少包含：

- normalized query
- retrieved chunks
- citation payload
- model selection metadata

Genkit flow 輸出至少包含：

- answer stream
- citations
- retrieval summary
- traceId

### 5. Streaming contract

Next.js streaming response 必須支援：

1. partial tokens
2. completion event
3. error event
4. request trace metadata

### 6. Query failure model

建議錯誤碼：

- `QUERY_INVALID_INPUT`
- `QUERY_FILTER_SCOPE_MISSING`
- `VECTOR_SEARCH_TIMEOUT`
- `VECTOR_SEARCH_PROVIDER_ERROR`
- `NO_RELEVANT_CHUNKS`
- `GENERATION_PROVIDER_ERROR`
- `STREAM_ABORTED`

## 後果 (Consequences)

### 正面影響

1. Query path 的輸入輸出與失敗語意一致。
2. retrieval 與 generation 的責任清楚分離。
3. UI 可依固定 streaming 事件協定維護。

### 負面影響

1. 需要維護更多 query-time 指標與 trace。
2. Gate 規則若過嚴，可能提高 no-context 回應比例。

## Operational Notes

- query latency、retrieval latency、generation latency 應分開量測。
- traceId 應串接 query、retrieval、generation 三段。
- 若新增 rerank provider，必須保持本契約的 gate 順序不變。
