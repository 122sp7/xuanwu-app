# search — RAG 語意檢索上下文

> **Domain Type:** Supporting Subdomain（支援域）
> **模組路徑:** `modules/search/`
> **開發狀態:** 🏗️ Midway

## 定位

`search` 提供**語意向量搜尋（RAG）** 能力——從向量索引中檢索語意相關 chunks，並生成 AI 答案。它是 `notebook` 的 RAG 基礎設施，也提供 Wiki 風格的直接 RAG 查詢介面。

## 職責

| 能力 | 說明 |
|------|------|
| 向量檢索 | 透過 VectorStore port 執行語意相似度搜尋 |
| RAG Answer 生成 | 組合 retrieved chunks 呼叫 AI 生成答案（帶引用） |
| Wiki RAG 查詢 | 提供 Wiki 整合的 RAG 查詢介面（WikiContentRepository） |
| 查詢反饋收集 | 收集 RagQueryFeedback（helpful/unhelpful）以改善品質 |

## 核心概念

- **`RagQuery`** — 一次 RAG 查詢（含 retrieved chunks 與生成答案）
- **`RagQueryFeedback`** — 使用者對答案品質的反饋記錄
- **`VectorStore`** — 向量資料庫的 Hexagonal Port（Upstash Vector / Pinecone）

## 重要邊界規則

```
server code   → import from modules/search/api
client code   → import from modules/search (root barrel)
RagView, RagQueryView → 只在 root barrel，不在 /api
```

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | RagQuery / RagQueryFeedback 設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
