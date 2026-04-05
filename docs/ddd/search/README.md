# search — 語意檢索上下文

> **Domain Type:** Supporting Subdomain（支援域）  
> **模組路徑:** `modules/search/`  
> **開發狀態:** 🏗️ Midway

## 在 Knowledge Platform / Second Brain 中的角色

`search` 是 NotebookLM-like 推理層的檢索核心，負責從向量索引與知識內容中擷取最相關的引用材料，為摘要、問答與洞察建立可追溯的語意上下文。

## 主要職責

| 能力 | 說明 |
|---|---|
| 向量檢索 | 執行語意相似度搜尋與結果排序 |
| RAG Answer 組合 | 組合 retrieved chunks、引用與答案內容 |
| 反饋收集 | 記錄 RagQueryFeedback 以改進檢索品質 |

## 與其他 Bounded Context 協作

- `ai` 提供索引就緒資料；`notebook` 是主要消費者。
- `knowledge` 與 `knowledge-base` 提供被檢索的知識主體與結構資訊。

## 核心聚合 / 核心概念

- **`RagQuery`**
- **`RagQueryFeedback`**
- **`VectorStore`**

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | 聚合根與核心概念 |
| [domain-events.md](./domain-events.md) | 領域事件與整合語言 |
| [context-map.md](./context-map.md) | 與其他 BC 的關係與整合方式 |
