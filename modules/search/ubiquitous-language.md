# Ubiquitous Language — search

> **範圍：** 僅限 `modules/search/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| RAG 查詢 | RagQuery | 一次 Retrieval-Augmented Generation 查詢請求 |
| RAG 已檢索 Chunk | RagRetrievedChunk | 向量搜尋返回的單一相關文件片段（含相似度分數） |
| RAG 引用 | RagCitation | AI 答案引用的 chunk 來源資訊 |
| RAG 答案輸出 | AnswerRagQueryOutput | 包含生成答案文字與引用列表的輸出 |
| 查詢反饋 | RagQueryFeedback | 使用者對 RAG 答案品質的評分記錄 |
| 向量存儲 | VectorStore | 向量資料庫的 Hexagonal Port（IVectorStore 介面） |
| Wiki 引用 | WikiCitation | Wiki 整合 RAG 的引用格式（含 pageId、pageTitle） |
| 向量文件 | VectorDocument | 要索引至向量資料庫的文件記錄 |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `RagQuery` | `SearchQuery`, `Query` |
| `RagRetrievedChunk` | `SearchResult`, `Chunk` |
| `RagCitation` | `Citation`, `Source` |
| `VectorStore` | `VectorDB`, `EmbeddingDB` |
