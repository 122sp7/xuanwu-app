# ADR 003: RAG Firestore Data Model and Document Lifecycle

## 狀態 (Status)
Accepted

## 背景 (Context)

若 `documents` 與 `chunks` 沒有穩定 schema，或 document lifecycle 沒有固定狀態流轉，後續通常會出現：

1. query、worker、reprocess 使用不同欄位名。
2. chunk schema 漂移，造成 filter 與 vector retrieval 不穩定。
3. worker 無法清楚處理 retry、idempotency、failed state。
4. Firestore 無法作為 canonical metadata source。

因此，data model 與 lifecycle 必須獨立成 ADR。

## 決策 (Decision)

採用以下固定資料模型：

1. Firestore 是 canonical metadata store。
2. `documents` 是 document lifecycle 的 canonical collection。
3. `chunks` 是 retrieval unit 與 embedding 的 canonical collection。
4. document lifecycle 最少包含 `uploaded | processing | ready | failed | archived`。
5. Firestore `documents.status=uploaded` 作為 primary ingestion trigger。

## 設計細節 (Design)

### 1. `documents`

```text
collection: documents
- id
- organizationId
- workspaceId
- title
- sourceFileName
- mimeType
- extension
- sizeBytes
- storageBucket
- storagePath
- status
- taxonomy
- uploadSource
- parser
- checksum
- createdBy
- createdAt
- updatedAt
- processingStartedAt
- readyAt
- failedAt
- archivedAt
- errorCode
- errorMessage
```

欄位規則：

- `status`: `uploaded | processing | ready | failed | archived`
- `taxonomy`: document-level classification
- `checksum`: dedupe / idempotency / re-upload policy 依據
- `parser`: 例如 `document-ai-layout-parser`

### 2. `chunks`

```text
collection: chunks
- id
- organizationId
- workspaceId
- docId
- chunkIndex
- text
- embedding
- taxonomy
- page
- tags
- tokenCount
- charCount
- sourceHeading
- createdAt
- updatedAt
```

欄位規則：

- `docId` 必須指向 `documents.id`
- `organizationId` / `workspaceId` 必須複寫到 chunk 層
- `taxonomy` 必須可直接用於 retrieval filter
- `embedding` 與 chunk 同步存放

### 3. Optional collections

```text
collection: queryCache
- id
- organizationId
- workspaceId
- queryHash
- response
- retrievedChunkIds
- createdAt
- expiresAt

collection: queryFeedback
- id
- organizationId
- workspaceId
- queryHash
- responseId
- rating
- reason
- createdAt
```

### 4. Lifecycle baseline

```text
uploaded -> processing -> ready
         \-> failed
ready    -> processing   (reprocess)
ready    -> archived
failed   -> processing   (retry)
```

狀態定義：

- `uploaded`: raw file 與 metadata 已建立，尚未處理
- `processing`: worker 正在 parsing / chunking / embedding
- `ready`: chunks 已可供 retrieval
- `failed`: ingestion 失敗
- `archived`: 文件保留但不再參與 query

轉換規則：

1. Next.js 建立 `uploaded`
2. worker 將 `uploaded` / `failed` / `ready` 轉為 `processing`
3. worker 將 `processing` 轉為 `ready` 或 `failed`
4. archive 需由明確 maintenance 或 product flow 觸發

### 5. Trigger and idempotency

Primary ingestion trigger：

- Next.js 建立 `documents/{documentId}` with `status=uploaded`
- worker 監聽 `uploaded` document 並執行 ingestion

Idempotency 規則：

- worker 啟動前檢查 `documentId + checksum + status`
- 若相同 checksum 已 `ready`，避免重複 embedding
- chunk upsert key 採 deterministic naming：

```text
{documentId}_{chunkIndex}
```

Failure handling：

- `errorCode` / `errorMessage` 僅由 worker 更新
- 需保留 `failedAt`
- retry、timeout、dead-letter 策略在實作時必須明確定義

## Alternatives Considered

### 方案 A：不拆 `documents` / `chunks`，直接把 chunk 內嵌回 documents

不採用。

原因：

- 向量檢索與 filter 不友善
- document 尺寸與更新模式不穩定

### 方案 B：只保留簡化 status，不定義 failed / archived

不採用。

原因：

- 無法支援 retry、治理與 archive policy
- 失敗情境無 canonical 表示

## 後果 (Consequences)

### 正面影響

1. Firestore schema 與 lifecycle 穩定。
2. worker、query、maintenance flow 對同一份 canonical state 對齊。
3. reprocess 與 failure handling 有清楚落點。

### 負面影響

1. 初期 schema 較重。
2. 需要維護 lifecycle 與索引一致性。

## Operational Notes

- 在 Xuanwu，organization 是 tenant 邊界，workspace 是子範圍；Firestore 索引與 rules 變更必須與此層級一致。
- `documents` / `chunks` 欄位命名一旦落地，不應隨意漂移。
