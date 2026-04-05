# ai — AI 攝入管線上下文

> **Domain Type:** Supporting Subdomain（支援域）
> **模組路徑:** `modules/ai/`
> **開發狀態:** 🏗️ Midway

## 定位

`ai` 管理 RAG 攝入管線的 **Job 生命週期**（uploaded → parsing → embedding → indexed）。它是 Next.js 端的 Job 協調器：接收來自 `source` 的上傳完成信號，建立 IngestionJob，並協調 `py_fn/` Python worker 執行重型工作。

## 職責

| 能力 | 說明 |
|------|------|
| IngestionJob 管理 | Job 建立、狀態追蹤（uploaded → parsing → embedding → indexed / failed） |
| IngestionDocument 登記 | 登記待攝入文件的元資料 |
| IngestionChunk 儲存 | 儲存 `py_fn/` 產生的向量化 chunks |
| Job 狀態查詢 | 依 documentId 或 workspaceId 查詢 Job 狀態 |

## 核心聚合根

- **`IngestionJob`** — 攝入工作聚合根，管理 Job 狀態機
- **`IngestionDocument`** — 待攝入文件記錄（元資料）
- **`IngestionChunk`** — 文件的向量化 chunk（by `py_fn/` 生成）

## 狀態機

```
uploaded ──► parsing ──► embedding ──► indexed
                │                         │
                └──► failed ◄─────────────┘
```

## Runtime 邊界

- Next.js `ai` module：Job CRUD、狀態查詢 API
- `py_fn/`：實際 parse / chunk / embed 執行（重型 worker）

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | IngestionJob 聚合根設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
