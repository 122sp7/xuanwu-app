# ADR 011: RAG Genkit Flow Contract

## 狀態 (Status)
Accepted

## 背景 (Context)

Genkit 若沒有明確 flow contract，常見問題是：

1. preprocess、retrieval、generation 的輸入輸出不一致。
2. citation 結構與 UI 需求對不上。
3. streaming 事件格式漂移，前端無法穩定渲染。

## 決策 (Decision)

定義 Genkit flow 的輸入、輸出、citation schema 與 streaming event 契約，作為 query orchestration 的標準。

## Required Technology Stack

1. Genkit（flow orchestration）
2. Google AI provider 或相容 LLM provider
3. Next.js 16（streaming response 終端）
4. TypeScript 5（flow schema typing）
5. Firestore（retrieval context source）

## 設計細節 (Design)

### 1. Flow stages

```text
query input
 -> preprocess
 -> retrieval input build
 -> context assembly
 -> generation
 -> stream output
```

### 2. Flow input contract

```text
GenkitQueryInput
- traceId
- organizationId
- workspaceId
- userQuery
- queryEmbeddingRef
- retrievalOptions
- modelOptions
```

規則：

1. organizationId 必填；workspaceId 依查詢範圍決定是否帶入。
2. retrievalOptions 必須明確 topK 與 taxonomy filter。
3. modelOptions 必須可追蹤模型版本。

### 3. Context contract

```text
RetrievedChunk
- docId
- chunkIndex
- page
- taxonomy
- text
- score
```

```text
PromptContext
- query
- chunks[]
- systemConstraints
- citationMode
```

### 4. Generation output contract

```text
GenkitQueryOutput
- answer
- citations[]
- retrievalSummary
- modelMetadata
- traceId
```

`citations[]` 最小欄位：

- `docId`
- `chunkIndex`
- `page`
- `reason`

### 5. Streaming event contract

```text
StreamEvent
- type: token | citation | done | error
- traceId
- payload
```

規則：

1. token 事件可重複輸出。
2. citation 事件可在 done 前逐步補齊。
3. done 事件必須只出現一次。
4. error 事件需帶錯誤碼與可追蹤訊息。

### 6. Error model

建議錯誤碼：

- `FLOW_PREPROCESS_ERROR`
- `FLOW_CONTEXT_BUILD_ERROR`
- `FLOW_MODEL_PROVIDER_ERROR`
- `FLOW_STREAM_SERIALIZATION_ERROR`

## 與 functions-python ADR 協作與不衝突規則

1. 本 ADR 只定義 query-time Genkit 契約。
2. functions-python ADR 系列負責 ingestion worker，不負責 Genkit product-facing orchestration。
3. 本 ADR 不得將 Genkit flow 放入 worker runtime 作為 browser 入口。
4. 若需要 worker 提供離線特徵，應透過 Firestore/事件交接，不直接改寫 worker 角色。

## 後果 (Consequences)

### 正面影響

1. Genkit flow 可測試、可追蹤、可替換 provider。
2. citation 與 streaming 規格穩定。
3. 前後端協作成本降低。

### 負面影響

1. flow schema 變更需要版本治理。
2. 多模型策略會增加契約管理複雜度。

## Operational Notes

- flow schema 版本建議與 API 版本同步。
- 每次模型切換需回歸 citation 與 streaming 相容性。
