# ADR 005: RAG Ingestion Execution Contract

## 狀態 (Status)
Accepted

## 背景 (Context)

雖然 ingestion pipeline 已在總覽定義完成，但若沒有執行契約，落地時仍可能出現：

1. worker 依據不同欄位啟動，造成重複處理。
2. parsing、cleaning、taxonomy、chunking、embedding 的失敗沒有一致分類。
3. `documents.status` 更新時機不一致，影響 query 可用性判斷。

## 決策 (Decision)

固定 ingestion 的執行契約如下：

1. canonical trigger: `documents.status=uploaded`。
2. worker 僅處理 organization-scoped、workspace-scoped 文件。
3. 固定步驟順序為 parsing -> cleaning -> taxonomy -> chunking -> embedding -> chunks write -> ready。
4. 任一步驟失敗都必須寫入 `failed` 狀態與錯誤分類。
5. idempotency 由 `documentId + checksum + chunkIndex` 保證。

## 設計細節 (Design)

### 1. Ingestion state transitions

```text
uploaded -> processing -> ready
         \-> failed
failed   -> processing (retry)
ready    -> processing (reprocess)
ready    -> archived   (maintenance / product archive)
```

狀態更新規則：

1. Next.js 建立 `uploaded`。
2. worker 起始時將狀態更新為 `processing` 並寫入 `processingStartedAt`。
3. worker 完成 chunk 寫入後更新 `ready` 與 `readyAt`。
4. worker 失敗時更新 `failed`、`failedAt`、`errorCode`、`errorMessage`。
5. `archived` 由明確 maintenance 或 product flow 觸發，並寫入 `archivedAt`；worker 不得把 archive 當作 ingestion 副作用。

角色與觸發責任：

- `uploaded`: Next.js upload registration
- `processing`: ingestion worker on start, or explicit retry / reprocess flow
- `ready`: ingestion worker after successful chunk persistence
- `failed`: ingestion worker on classified failure
- `archived`: maintenance or product archive flow after document governance decision

### 2. Step contract

#### Step A: Parsing

- 輸入: storagePath 指向 raw file
- 輸出: 解析後 text 與可選 layout artifact
- 失敗分類: `PARSER_UNSUPPORTED_FORMAT`, `PARSER_TIMEOUT`, `PARSER_RUNTIME_ERROR`

#### Step B: Cleaning

- 輸入: parsed text
- 輸出: normalized text
- 規則: 不可破壞來源段落順序與 page 對應資訊

#### Step C: Document-level taxonomy

- 輸入: normalized text
- 輸出: document taxonomy
- 規則: taxonomy 必須在 chunking 前完成

#### Step D: Chunking

- 輸入: normalized text + taxonomy
- 輸出: chunks
- 規則: 產出 deterministic `chunkIndex`

#### Step E: Embedding

- 輸入: chunk text
- 輸出: embedding vector
- 規則: 不得跳過 organization / workspace metadata 綁定

#### Step F: Persistence

- 寫入 `chunks` records
- upsert key: `{documentId}_{chunkIndex}`
- 完成後更新 `documents.status=ready`

### 3. Metadata write contract

worker 在每個步驟至少要維持下列欄位一致：

- `documents.id`
- `documents.organizationId`
- `documents.workspaceId`
- `documents.status`
- `documents.checksum`
- `documents.processingStartedAt`
- `documents.readyAt`
- `documents.failedAt`
- `documents.archivedAt`
- `documents.errorCode`
- `documents.errorMessage`
- `chunks.docId`
- `chunks.organizationId`
- `chunks.workspaceId`
- `chunks.chunkIndex`

### 4. Retry and idempotency

規則：

1. 若同一 `documentId + checksum` 已 `ready`，默認不重跑。
2. `failed` 文件可依策略自動或手動 retry。
3. retry 必須覆蓋舊 chunk records，避免雙份資料並存。
4. reprocess 需有明確原因，例如 parser 升級或 taxonomy 策略更新。
5. 已 `archived` 文件若重新進入 `processing`，必須先由明確治理流程解除 archive，再視為 reprocess，而不是由 worker 自行恢復。

### 5. Error model

`errorCode` 建議分類：

- `UPLOAD_ARTIFACT_MISSING`
- `PARSER_UNSUPPORTED_FORMAT`
- `PARSER_TIMEOUT`
- `PARSER_RUNTIME_ERROR`
- `CLEANING_RUNTIME_ERROR`
- `TAXONOMY_RUNTIME_ERROR`
- `CHUNKING_RUNTIME_ERROR`
- `EMBEDDING_PROVIDER_ERROR`
- `CHUNK_PERSISTENCE_ERROR`

## 後果 (Consequences)

### 正面影響

1. ingestion 的每一步都有固定輸入輸出與失敗語意。
2. ready 與 failed 的判斷一致，降低 query 汙染風險。
3. retry / reprocess 有穩定路徑。

### 負面影響

1. worker 實作需要更多狀態管理與錯誤碼維護。
2. parser 或 embedding provider 更換時需同步維護錯誤分類。

## Operational Notes

- worker entrypoint 應保持薄層，僅負責 trigger handling 與 orchestrate use case。
- parser、embedding secrets 與 runtime config 不得硬編碼。
- 若新增 ingestion 步驟，需先更新本 ADR 再落地。
