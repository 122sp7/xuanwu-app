# search — Search & Retrieval Layer

> **開發狀態**：🚧 Developing — 積極開發中
> **Domain Type**：Supporting Domain（支援域）

`modules/search` 負責知識平台的搜尋索引管理與向量檢索。提供語意搜尋（Vector Search）、關鍵字搜尋（BM25）以及 RAG 查詢反饋管理能力。

外界互動規則：
- `"use server"` 程式碼從 `modules/search/api` import
- Client 端 UI 元件從 `modules/search`（root barrel）import
- 禁止在 `api/index.ts` 匯出 `"use client"` UI 元件

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 向量檢索 | 語意相似度搜尋（Dense Retrieval） |
| 關鍵字搜尋 | BM25 稀疏檢索 |
| RAG 查詢管理 | 管理 RagQuery 生命週期與範圍過濾 |
| 查詢反饋 | 收集 RagQueryFeedback 改善搜尋品質 |
| 向量存儲抽象 | 透過 VectorStorePort 隔離底層向量資料庫 |

---

## 聚合根（Aggregate Roots）

| Aggregate | 說明 |
|-----------|------|
| `RagQuery` | 使用者自然語言查詢，含組織/工作區範圍與過濾條件 |
| `RagQueryFeedback` | 對 RAG 查詢結果的使用者反饋 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| RAG 查詢 | RagQuery | 使用者自然語言問題，附帶範圍與過濾條件 |
| 查詢反饋 | RagQueryFeedback | 對 RAG 查詢結果的評分與改善意見 |
| 向量存儲埠 | VectorStorePort | 向量資料庫的抽象埠（Similarity Search 介面） |
| 知識片段 | KnowledgeChunk | 知識的向量化片段，用於語意搜尋 |
| 相似度分數 | SimilarityScore | 向量距離計算的相關性分數 |
| Wiki RAG 類型 | WikiRagTypes | Wiki 知識圖譜的 RAG 查詢型別定義 |

---

## 領域事件（Domain Events）

| 事件 | 觸發條件 |
|------|----------|
| `search.query_submitted` | 使用者提交搜尋查詢時 |
| `search.feedback_submitted` | 使用者提交查詢反饋時 |

---

## 依賴關係

- **上游（依賴）**：`ai/api`（Embedding 計算）、`workspace/api`（範圍過濾）
- **下游（被依賴）**：`notebook/api`（RAG 檢索服務）

---

## 重要規則：Client/Server 分離

```typescript
// ✅ Server-side import（use server / use-cases）
import { RagQueryRepository } from "@/modules/search/api";

// ✅ Client-side import（UI 元件）
import { RagView, RagQueryView } from "@/modules/search";  // root barrel

// ❌ 禁止：在 api/index.ts 匯出 UI 元件
// api/index.ts 不能 export RagView（含 "use client"）
```

---

## 目錄結構

```
modules/search/
├── api/                  # 公開 API 邊界（server-only 匯出）
│   ├── index.ts          # server actions, repos（禁止 "use client" 元件）
│   └── server.ts         # 明確 server-only barrel
├── application/          # Use Cases
│   └── use-cases/        # submit-rag-feedback.use-case.ts
├── domain/               # Aggregates, Ports, Repositories
│   ├── entities/         # RagQuery.ts, RagQueryFeedback.ts, WikiRagTypes.ts
│   ├── ports/            # vector-store.ts（VectorStorePort）
│   └── repositories/     # RagQueryFeedbackRepository
├── infrastructure/       # Firebase / 向量資料庫適配器
└── index.ts              # root barrel（client-safe：RagView, RagQueryView）
```

---

## 架構參考

- 系統設計文件：`docs/architecture/domain-model.md`
- Repository 模式：`docs/architecture/repository-pattern.md`
