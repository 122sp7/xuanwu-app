# notebooklm/subdomains/retrieval

## 子域職責

`retrieval` 子域負責查詢召回與排序策略的正典邊界：

- 接收語意查詢請求，執行向量近似搜尋與關鍵字搜尋
- 管理召回排序策略（`RerankerPolicy`）與結果過濾規則
- 提供可審計的召回日誌供 `grounding` 與 `evaluation` 使用

## 核心語言

| 術語 | 說明 |
|---|---|
| `RetrievalQuery` | 一次召回的查詢請求（含查詢文字、過濾條件、topK） |
| `RetrievedChunk` | 召回結果單位，包含原始內容、相似度分數與來源引用 |
| `RerankerPolicy` | 控制召回結果排序的策略定義 |
| `RetrievalLog` | 一次召回作業的可稽核記錄 |
| `ChunkEmbedding` | 已向量化的內容片段（向量 + 元數據） |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`ExecuteRetrieval`、`UpdateRerankerPolicy`、`QueryRetrievalLog`）
- `domain/`: `RetrievalQuery`、`RetrievedChunk`、`RerankerPolicy`
- `infrastructure/`: 向量資料庫適配器（Firestore Vector Store、Vertex AI Search 等）
- `interfaces/`: server action 接線

## 整合規則

- `retrieval` 由 `synthesis` 與 `conversation` 子域觸發，回傳 `RetrievedChunk` 列表
- 不直接操作 UI，只對上層子域提供召回能力
- 父模組 public API（`@/modules/notebooklm/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/notebooklm/subdomains.md 建議建立
