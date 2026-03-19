# ADR 007: Firestore 作為 RAG canonical data model 與 vector indexing 基礎

## 狀態 (Status)
**Accepted**

## 背景 (Context)

現有文件已提到 `documents` 與 `chunks` 是主要集合，但對企業級 RAG 來說，若沒有把：

- document metadata
- chunk metadata
- embedding placement
- vector index 依附位置
- optional cache / feedback collections

定義成正式 ADR，後續會出現：

1. 同一份 document metadata 在多個地方重複寫入。
2. chunk schema 漂移，造成 filter/search 不穩定。
3. vector field 與 query filters 無一致規範。
4. cache / feedback 沒有 canonical 落點。

## 決策 (Decision)

Firestore 是本倉庫企業級 RAG 的 **canonical metadata store**，也是第一優先的
**vector-search backing store**。

核心資料模型固定為：

- `documents`
- `chunks`

可選輔助模型為：

- `queryCache`
- `queryFeedback`

## 設計細節 (Design)

### `documents` collection

```text
collection: documents
- id
- title
- status            (uploaded | processing | ready)
- taxonomy          (document-level)
- createdAt
```

建議擴充欄位：

- `storagePath`
- `contentType`
- `updatedAt`
- `errorCode`
- `errorMessage`
- `readyAt`

### `chunks` collection

```text
collection: chunks
- id
- docId
- text
- embedding
- taxonomy
- page
- chunkIndex
- tags
```

`chunks` 是 query / retrieval 的 canonical unit。  
每個 chunk 應至少具備：

- `docId`
- `chunkId` 或以 `id` 承載
- `taxonomy`
- `page`
- `tags`
- `embedding`

### Embedding placement

- embedding 與 chunk record 同步存放
- query-time vector search 直接以 `chunks` 為目標
- 不建立第二套 canonical embedding store

### Vector index

- Firestore vector index 建立在 `chunks.embedding`
- query filters 優先使用穩定 metadata：
  - `docId`
  - `taxonomy`
  - `tags`
  - `page`

### Optional collections

#### `queryCache`

```text
collection: queryCache
- id                (query hash)
- query
- response
- retrievedChunkIds
- createdAt
- expiresAt
```

#### `queryFeedback`

```text
collection: queryFeedback
- id
- queryHash
- responseId
- rating            (up | down)
- reason
- createdAt
```

### Ownership

#### functions-python writes

- `documents.status` transition fields
- parsed/chunked/embedded outputs
- `chunks` canonical ingestion outputs

#### Next.js writes

- initial `documents` creation
- query cache entries (when product flow needs them)
- feedback entries

## Alternatives Considered

### 方案 A：額外建立第二套 canonical relational/vector store

**目前不採用。**

原因：

- 會讓 document/chunk canonical source 失真
- 增加同步與維運成本
- 在目前 Firebase-native 架構下屬於過早複雜化

### 方案 B：把 cache / feedback 也塞進 `documents` 或 `chunks`

**不採用。**

原因：

- 會污染 canonical ingestion schema
- 讓 query-time concerns 與 ingestion-time concerns 混在一起

## 後果 (Consequences)

### 正面影響

1. Ingestion 與 query 都能對齊同一份 canonical schema。
2. Firestore vector search 的 filter 與 metadata 有穩定基礎。
3. cache / feedback 有清楚擴充路徑，不會反向污染 documents/chunks。

### 負面影響

1. Firestore document size 與 embedding 成本需要持續監控。
2. 若未來超出 Firestore vector search 的能力範圍，仍需要新的替代 ADR。

## Operational Notes

- `documents.status` 必須支援至少：`uploaded -> processing -> ready`
- `chunks` 的 metadata 欄位命名應保持穩定，避免 query filter 失效
- 若未來導入 Redis cache，仍不改變 Firestore 作為 canonical metadata store 的地位
