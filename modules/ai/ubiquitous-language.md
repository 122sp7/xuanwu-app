# Ubiquitous Language — ai

> **範圍：** 僅限 `modules/ai/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 攝入工作 | IngestionJob | RAG 攝入管線的單一工作記錄，追蹤 parse/chunk/embed 的執行狀態 |
| 攝入文件 | IngestionDocument | 交付給攝入管線的文件元資料記錄 |
| 攝入 Chunk | IngestionChunk | 文件切分後的向量化單元（由 py_fn/ 生成） |
| 攝入狀態 | IngestionStatus | Job 的生命週期狀態：`uploaded \| parsing \| embedding \| indexed \| failed` |
| 文件 ID | documentId | 關聯的 source 模組 SourceDocument ID |
| 工作區 ID | workspaceId | Job 所屬的工作區 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `IngestionJob` | `Job`, `ParseJob`, `EmbedTask` |
| `IngestionDocument` | `Document`, `File`（在 ai BC 內） |
| `IngestionChunk` | `Chunk`, `VectorEntry` |
| `IngestionStatus` | `JobStatus`, `State` |
