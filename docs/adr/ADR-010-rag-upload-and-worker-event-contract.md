# ADR 010: RAG Upload and Worker Event Contract

## 狀態 (Status)
Accepted

## 背景 (Context)

Upload 與 ingestion 若只靠文字描述，容易在 Next.js 與 worker 之間出現 payload 漂移：

1. upload metadata 欄位命名不一致。
2. worker trigger 事件缺少必要欄位，導致不可重試。
3. 同一文件不同流程使用不同識別鍵。

## 決策 (Decision)

建立 Upload Request、Document Metadata、Worker Event 三種契約，作為 Next.js 與 worker 的交接標準。

## Required Technology Stack

1. Next.js 16 Route Handlers / Server Actions
2. Firebase Storage（upload binary）
3. Firestore（document metadata 與 status）
4. Cloud Functions for Firebase (Python)（event-driven worker）
5. TypeScript 5（request/response schema）
6. Python 3.x + pydantic/dataclass（worker payload validation）

## 設計細節 (Design)

### 1. Upload request contract (Next.js)

```text
UploadRequest
- organizationId: string
- workspaceId: string
- uploaderId: string
- sourceFileName: string
- mimeType: string
- sizeBytes: number
- checksum: string
```

規則：

1. `organizationId` 與 `workspaceId` 必填。
2. checksum 必須在 metadata 建立前可用。
3. `documentId` 由伺服器端生成，不接受前端指定。

### 2. Document metadata contract (Firestore)

```text
DocumentMetadata
- id: documentId
- organizationId
- workspaceId
- sourceFileName
- title
- storagePath
- checksum
- status=uploaded
- createdBy
- createdAt
```

規則：

1. 建立 metadata 時 `status` 必須是 `uploaded`。
2. `storagePath` 必須指向 organization/workspace-scoped path。
3. metadata 欄位命名需與 ADR-003 一致。

### 3. Worker trigger event contract

Primary event source: Firestore document create/update to `status=uploaded`

```text
WorkerTriggerEvent
- documentId
- organizationId
- workspaceId
- storagePath
- checksum
- status
- traceId
```

規則：

1. event payload 缺少 organization/workspace 時必須拒絕處理。
2. worker 先驗證 `status=uploaded` 才進入 processing。
3. 同 checksum + same document 不得重複執行完整 ingestion。

### 4. Worker result contract

```text
WorkerResult
- documentId
- finalStatus: ready | failed
- chunkCount
- errorCode?
- errorMessage?
- processingStartedAt
- completedAt
```

### 5. Event versioning

新增契約欄位時需遵守：

1. 新增向後相容欄位優先。
2. breaking changes 需升版本標記，例如 `eventVersion`。
3. 版本升級要有雙寫或兼容讀取期間。

## 與 py_fn ADR 協作與不衝突規則

1. 本 ADR 定義 Next.js 與 worker 交接契約。
2. `py_fn/docs/adr/ADR-004-structure-and-interaction-design.md` 與 `ADR-006-enterprise-rag-end-to-end-pipeline.md` 定義 worker 內部流程與觸發方向。
3. 不得將 worker 事件契約改寫成 browser-facing API。
4. 本 ADR 若更新欄位，需同步檢查 py_fn ADR 是否需要補充但不能改變其 worker runtime 定位。

## 後果 (Consequences)

### 正面影響

1. Upload 到 worker 的交接一致。
2. 事件可重試、可追蹤、可版本化。
3. Next.js 與 worker 分工更穩定。

### 負面影響

1. 契約治理成本增加。
2. 事件版本升級需要協調窗口。

## Operational Notes

- 建議維護單一 schema registry（可用 markdown + type 定義雙軌）。
- 每次新增欄位需補 migration 與 rollback 說明。
