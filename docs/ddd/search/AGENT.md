# AGENT.md — search BC

## 模組定位

`search` 是 RAG 語意檢索的支援域，提供向量搜尋、RAG answer 生成與查詢反饋收集。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `RagQuery` | Query、SearchQuery、VectorQuery |
| `RagQueryFeedback` | Feedback、Rating |
| `RagRetrievedChunk` | Chunk、SearchResult |
| `RagCitation` | Citation、Source、Reference |
| `VectorStore` | VectorDB、EmbeddingStore |
| `RagRetrievalRepository` | RetrievalRepo、SearchRepo |
| `RagGenerationRepository` | GenerationRepo、AIRepo |

## 最重要邊界規則：Server vs Client Import

```typescript
// ✅ server code（Server Action、API route）
import { searchApi } from "@/modules/search/api";

// ✅ client code（React Component）
import { RagView } from "@/modules/search"; // root barrel

// ❌ 禁止：在 /api barrel 匯出 "use client" UI 元件
// RagView, RagQueryView 只能從 root barrel 匯出
```

## 邊界規則

### ❌ 禁止
```typescript
// api/index.ts 不得 re-export "use client" 元件
export { RagView } from "./interfaces/components/RagView"; // 禁止在 api/
```

## 驗證命令

```bash
npm run lint
npm run build
```
