# Domain Events — source

## 發出事件

| 事件 | 觸發條件 | 關鍵欄位 |
|------|---------|---------|
| `source.upload_initiated` | upload-init 完成、簽名 URL 已產生 | `documentId`, `workspaceId`, `actorId`, `occurredAt` |
| `source.upload_completed` | upload-complete 確認完成 | `documentId`, `workspaceId`, `occurredAt` |
| `source.rag_document_registered` | RagDocument 成功登記進入攝入管線 | `documentId`, `ragDocumentId`, `occurredAt` |
| `source.file_archived` | 文件被封存 | `documentId`, `actorId`, `occurredAt` |

## 訂閱事件

| 來源 BC | 訂閱事件 | 行動 |
|---------|---------|------|
| `workspace` | `workspace.created` | 初始化工作區的 WikiLibrary |
| `identity` | `TokenRefreshSignal` | 更新 ActorContext 授權快照 |

## 消費 source 事件的其他 BC

| 消費 BC | 事件 | 行動 |
|---------|------|------|
| `ai` | `source.upload_completed` | 建立 IngestionJob，啟動 RAG 攝入管線 |
| `knowledge` | `source.upload_completed` | 文件關聯知識頁面通知（可選） |
