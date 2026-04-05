# Aggregates — ai

## 聚合根：IngestionJob

### 職責
管理 RAG 攝入管線的單一工作記錄。追蹤從上傳到 indexed 的完整狀態機。

### 生命週期狀態機
```
uploaded ──► parsing ──► embedding ──► indexed
                │                         │
                └──────► failed ◄─────────┘
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Job 主鍵 |
| `documentId` | `string` | 關聯 SourceDocument ID |
| `organizationId` | `string` | 所屬組織 |
| `workspaceId` | `string` | 所屬工作區 |
| `status` | `IngestionStatus` | 當前狀態 |
| `startedAt` | `string \| null` | ISO 8601 開始時間 |
| `completedAt` | `string \| null` | ISO 8601 完成時間 |
| `errorMessage` | `string \| null` | 失敗原因 |

### 不變數

- `indexed` 狀態後不可再轉換回其他狀態
- `failed` 狀態的 errorMessage 不可為空

---

## 實體：IngestionDocument

### 職責
交付給攝入管線的文件元資料，提供 `py_fn/` worker 所需的來源資訊。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 文件主鍵 |
| `sourceFileId` | `string` | 關聯 SourceDocument ID |
| `mimeType` | `string` | 檔案 MIME type |
| `storageUrl` | `string` | Firebase Storage URL |

---

## 值物件：IngestionChunk

### 職責
文件切分後的向量化 chunk，由 `py_fn/` 生成後寫入 Firestore。

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Chunk 主鍵 |
| `documentId` | `string` | 所屬文件 ID |
| `chunkIndex` | `number` | Chunk 在文件中的序號 |
| `content` | `string` | Chunk 文字內容 |
| `embedding` | `number[]` | 向量嵌入（由 py_fn/ 寫入） |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `IngestionJobRepository` | `save()`, `findByDocumentId()`, `listByWorkspace()`, `updateStatus()` |
