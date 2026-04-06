# Aggregates — search

## 聚合根：RagQueryFeedback

### 職責
收集並持久化使用者對 RAG 查詢答案品質的反饋。支援持續改善 RAG 品質。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `feedbackId` | `string` | 反饋主鍵 |
| `queryId` | `string` | 關聯的查詢 ID |
| `helpful` | `boolean` | 是否有用 |
| `comment` | `string \| null` | 文字評論（可選） |
| `submittedAt` | `string` | ISO 8601 |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `RagRetrievedChunk` | 檢索到的 chunk（chunkId, docId, chunkIndex, text, score, taxonomy） |
| `RagCitation` | 引用資訊（chunkId, docId, text, score） |
| `VectorDocument` | 向量索引文件（id, content, metadata, embedding） |
| `WikiCitation` | 歷史命名的知識引用值物件；目前承載知識頁面或文章的引用資訊（pageId, pageTitle, text, score） |

---

## Ports（Hexagonal Architecture）

| Port | 說明 |
|------|------|
| `IVectorStore` | 向量資料庫抽象（`index()`, `search()`, `deleteByDocId()`） |
| `RagRetrievalRepository` | Chunk 向量搜尋操作 |
| `RagGenerationRepository` | AI 答案生成（組合 chunks + Genkit 呼叫） |
| `RagQueryFeedbackRepository` | 反饋持久化 |
| `WikiContentRepository` | 歷史命名的知識內容查詢 port；目前供 RAG 讀取知識頁面或文章內容 |
