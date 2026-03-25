# AI Knowledge Platform Architecture

> **摘要**: Xuanwu App 的 AI 知識管理平台架構，涵蓋 RAG ingestion pipeline、Knowledge Graph Layer、向量索引與模組邊界。

**Status**: Living document — 隨模組演進持續更新。

---

## 系統層次

```text
User Interface (Next.js App Router)
       ↓
Orchestration Layer (Next.js Server Actions / Genkit Flows)
       ↓
┌──────────────────────────────────────┐
│   Knowledge Module  │  Retrieval Module │
│   (knowledge/)      │  (retrieval/)     │
└──────────────────────────────────────┘
       ↓
┌──────────────────────────────────────┐
│         Agent Module (agent/)        │
│   AI orchestration & Genkit flows    │
└──────────────────────────────────────┘
       ↓
┌────────────────────────────────────────────┐
│  Python Worker (py_fn/)                    │
│  ingestion → parsing → chunking → embedding│
└────────────────────────────────────────────┘
       ↓
┌──────────────────┐   ┌──────────────────┐
│  Firestore       │   │  Upstash Vector  │
│  (document store)│   │  (vector index)  │
└──────────────────┘   └──────────────────┘
```

---

## 模組職責摘要

| 模組 | 職責 | 主要邊界 |
|------|------|---------|
| `knowledge/` | 知識節點 CRUD、metadata、版本 | `knowledge/api/` |
| `retrieval/` | 檢索查詢、重排序、結果組裝 | `retrieval/api/` |
| `agent/` | Genkit flow 編排、AI 回應生成 | `agent/api/` |
| `asset/` | 原始檔案上傳、格式管理 | `asset/api/` |
| `knowledge-graph/` | 節點關係、Graph 查詢 | `knowledge-graph/api/` |
| `py_fn/` | 解析 → 分塊 → 向量化 → 寫入 | Firebase Functions HTTP |

---

## RAG Ingestion Pipeline

```
Asset Upload (Next.js)
   → py_fn: parse (Document AI / custom parsers)
   → py_fn: chunk (semantic chunking)
   → py_fn: embed (Google Embedding API)
   → Firestore: store chunk metadata
   → Upstash Vector: store vector embeddings
```

**合約**: 見 [development-contracts/rag-ingestion-contract.md](../../development-reference/reference/development-contracts/rag-ingestion-contract.md)  
**解析合約**: 見 [development-contracts/parser-contract.md](../../development-reference/reference/development-contracts/parser-contract.md)

---

## Knowledge Graph Layer

- 節點由 `knowledge-graph/` 模組管理
- 關係儲存於 Firestore，以 `workspaceId` 為租戶隔離鍵
- 查詢透過 `knowledge-graph/api/` 邊界
- 詳見 [modules/knowledge-graph/README.md](../../../modules/knowledge-graph/README.md)

---

## 邊界規則

- `py_fn/` 只寫入 Firestore 與 Upstash Vector；不呼叫 Next.js API。
- `agent/` 透過 `retrieval/api/` 取得搜尋結果；不直接查 Firestore。
- UI 元件透過 Server Actions 觸發 Genkit flow；不直接呼叫 `py_fn/`。

---

## 相關文件

- [ADR](../adr/README.md)
- [RAG Architecture Instructions](../../../.github/instructions/rag-architecture.instructions.md)
- [Genkit Flow Instructions](../../../.github/instructions/genkit-flow.instructions.md)
- [Knowledge Graph README](../../../modules/knowledge-graph/README.md)
