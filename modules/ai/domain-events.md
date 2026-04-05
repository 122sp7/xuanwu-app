# Domain Events — ai

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `ai.ingestion_job_created` | 新 IngestionJob 建立 | `jobId`, `documentId`, `workspaceId`, `occurredAt` |
| `ai.ingestion_completed` | Job 狀態達到 `indexed` | `jobId`, `documentId`, `chunkCount`, `occurredAt` |
| `ai.ingestion_failed` | Job 狀態轉為 `failed` | `jobId`, `documentId`, `errorMessage`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `source` | `source.upload_completed` | 建立 IngestionJob，啟動攝入管線 |

## 消費 ai 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `search` | `ai.ingestion_completed` | 更新向量索引，RagDocument 標記為可查詢 |
| `source` | `ai.ingestion_completed` | 更新 SourceDocument 狀態為 ready |
| `workspace-audit` | `ai.ingestion_completed / failed` | 記錄攝入稽核軌跡 |
