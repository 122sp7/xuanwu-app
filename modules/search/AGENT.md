# AGENT.md — modules/search

## 模組定位

`modules/search` 是 Knowledge Platform 的**支援域（Supporting Domain）**，負責向量搜尋、RAG 查詢管理與使用者查詢反饋。為 `notebook` 模組提供 RAG 檢索服務。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `RagQuery`（不是 Query、SearchQuery）
- `RagQueryFeedback`（不是 Feedback、Rating）
- `VectorStorePort`（不是 VectorDB、SearchIndex）
- `KnowledgeChunk`（不是 Chunk、Fragment）
- `SimilarityScore`（不是 Score、Rank）

## 最重要邊界規則：Client/Server 分離

```typescript
// ✅ Server-only import — 從 /api barrel
import { submitRagFeedback } from "@/modules/search/api";

// ✅ Client-safe import — 從 root barrel
import { RagView, RagQueryView } from "@/modules/search";

// ❌ 禁止：api/index.ts 不能 export "use client" 元件
// 違反此規則會導致 Server Component 打包失敗
```

## 邊界規則

### ✅ 允許

```typescript
import { searchApi } from "@/modules/search/api";
import type { RagQueryDTO } from "@/modules/search/api";
```

### ❌ 禁止

```typescript
import { RagQueryFeedbackRepository } from "@/modules/search/domain/repositories/...";
import { FirebaseRagRetrievalRepository } from "@/modules/search/infrastructure/...";
```

## VectorStorePort 實作規則

- `VectorStorePort` 介面定義在 `domain/ports/vector-store.ts`
- 具體實作（Firebase Vector Search 等）在 `infrastructure/` 下
- Use Cases 只依賴 Port 介面，不依賴具體實作

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `notebook/api` | 提供服務 | 回應 RAG 檢索請求 |
| `ai/api` | API 呼叫 | 委派 Embedding 向量計算 |
| `workspace/api` | API 呼叫 | 驗證查詢範圍（組織/工作區） |

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
