# ADR 004: RAG Query Retrieval and Enterprise Enhancements

## 狀態 (Status)
Accepted

## 背景 (Context)

RAG 系統的 upload 與 ingestion 決定資料怎麼進來，但真正的 product behavior 取決於 query-time retrieval。若沒有將 query pipeline 與 enterprise enhancements 獨立定義，常見問題是：

1. query orchestration 漂到 worker runtime。
2. vector search、rerank、cache、feedback 混在一起實作，無法演進。
3. retrieval filter 忽略 tenant / workspace 邊界。
4. optional enhancements 反向污染 canonical chunk schema。

## 決策 (Decision)

採用以下固定 query baseline：

1. Query entrypoint 在 Next.js。
2. Genkit 負責 query preprocess、prompt assembly、LLM generation、tool calling。
3. Vector search 對 `chunks.embedding` 執行。
4. retrieval filter 必須至少包含 `tenantId`、`workspaceId`，必要時再加 `taxonomy`。
5. Hybrid search、rerank、cache、feedback 作為 query-time enhancement，不能改變 canonical ownership。

## 設計細節 (Design)

### 1. Query pipeline

```text
[Next.js（User Query）]
        ↓
[Route Handler / Server Action]
        ↓
[Genkit Flow（Query Preprocess）]
        ↓
[Query Embedding]
        ↓
[Firestore Vector Search（Top-K + filter taxonomy）]
        ↓
[取得 Top-K chunks]
        ↓
[Context 組裝（prompt building）]
        ↓
[Genkit LLM（回答生成）]
        ↓
[Streaming 回傳（Next.js UI）]
```

固定步驟：

1. 接收 user query
2. 建立 query embedding
3. 對 `chunks.embedding` 執行 vector search
4. 套用 `tenantId` / `workspaceId` / `taxonomy` filter
5. 取得 top-k chunks
6. 組 context、citation、tool inputs
7. 交給 Genkit / LLM 生成答案
8. Streaming 回傳 UI

### 2. Query-time principles

- vector search 在 query-time 發生
- embedding 在 ingestion-time 發生
- query-time 不直接讀 raw file
- `chunks` 是 canonical retrieval unit

### 3. Hybrid search

```text
[Vector Search] + [Keyword Search / BM25]
        ↓
[Hybrid Merge / Re-rank]
```

規則：

- hybrid orchestration 留在 Next.js / Genkit
- ingestion 可預先準備 keyword-friendly fields
- 不建立第二套與 canonical chunks 脫鉤的 retrieval source

### 4. Re-ranking

```text
[Top-K chunks]
        ↓
[Cross-Encoder / LLM rerank]
        ↓
[Top-N chunks]
```

規則：

- rerank 是 precision layer，不是新的 canonical persistence layer
- rerank 不應反向污染 chunk schema

### 5. Cache

```text
[Query Hash]
        ↓
[Firestore / Redis Cache]
        ↓
[Hit → Direct response]
```

規則：

- query cache 與 UX 耦合，優先由 Next.js 管理
- cache key 至少包含 `tenantId`, `workspaceId`, `queryHash`
- 不得使用全域 query hash 空間

### 6. Feedback loop

```text
[User Feedback 👍👎]
        ↓
[Firestore feedback persistence]
        ↓
[Ranking / prompt improvement]
```

規則：

- feedback entrypoint 留在 Next.js
- worker 可參與離線分析與批次調整
- feedback 不應直接修改 canonical chunk records

### 7. Tenancy and security

所有 retrieval、cache、feedback 都必須 tenant-scoped。

最小隔離鍵：

- `tenantId`
- `workspaceId`

禁止事項：

- query-time 省略 tenant / workspace filter
- 將 cache 做成跨 tenant 全域空間
- worker 直接承接 product-facing query request

## Alternatives Considered

### 方案 A：把 query 與 streaming 移到 Python worker

不採用。

原因：

- 與 auth、session、request context、UX 耦合太高
- product-facing API 應維持在 Next.js

### 方案 B：把 rerank、cache、feedback 直接混進 canonical schema

不採用。

原因：

- canonical schema 容易被 query-time concerns 汙染
- 後續難以獨立演進各 enhancement

## 後果 (Consequences)

### 正面影響

1. Query pipeline 與 upload/ingestion 分離清楚。
2. enterprise enhancements 有固定掛載點。
3. multi-tenant retrieval 邊界可一致落地。

### 負面影響

1. query orchestration 需要較完整的指標與快取策略。
2. 若 enhancements 過多，仍需後續 ADR 再細分。

## Operational Notes

- `chunks.embedding` vector index 與 filter 索引必須支撐 query pattern。
- query latency、rerank latency、cache hit rate、feedback volume 必須可觀測。
- 若未來導入外部搜尋或 rerank provider，仍不得改變 Next.js 作為 query entrypoint 的規則。