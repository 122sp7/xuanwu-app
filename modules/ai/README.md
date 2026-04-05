# ai — AI 攝入上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/ai/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`ai` 是 NotebookLM-like 推理能力的攝入協調層，負責把 `source` 交付的來源文件轉成可供 `search` 與 `notebook` 消費的結構化索引材料。它不直接承載使用者問答體驗，而是保證後續推理層有可靠、可追溯的資料基礎。

## 主要職責

| 能力 | 說明 |
|---|---|
| Ingestion Job 管理 | 追蹤 uploaded → parsing → embedding → indexed / failed 狀態生命週期 |
| Worker Handoff | 協調 Next.js 與 `py_fn/` 之間的重型 ingestion 工作交接 |
| Chunk / Index 前處理 | 接收文件切塊與索引前資料，為檢索層準備輸入 |

## 與其他 Bounded Context 協作

- `source` 是上游，提供來源文件與交接事件。
- `search` 消費 `ai` 產生的索引就緒資料；`notebook` 間接建立在這個攝入基礎上。

## 核心聚合 / 核心概念

- **`IngestionJob`**
- **`IngestionDocument`**
- **`IngestionChunk`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
