# AGENT.md ??search BC

## 璅∠?摰?

`search` ??RAG 隤?瑼Ｙ揣??游?嚗?靘???撠AG answer ???閰Ｗ?擖??

## ?隤?嚗biquitous Language嚗?

| 甇?Ⅱ銵? | 蝳迫雿輻 |
|----------|----------|
| `RagQuery` | Query?earchQuery?ectorQuery |
| `RagQueryFeedback` | Feedback?ating |
| `RagRetrievedChunk` | Chunk?earchResult |
| `RagCitation` | Citation?ource?eference |
| `VectorStore` | VectorDB?mbeddingStore |
| `RagRetrievalRepository` | RetrievalRepo?earchRepo |
| `RagGenerationRepository` | GenerationRepo?IRepo |

## ?????閬?嚗erver vs Client Import

```typescript
// ??server code嚗erver Action?PI route嚗?
import { searchApi } from "@/modules/search/api";

// ??client code嚗eact Component嚗?
import { RagView } from "@/modules/search"; // root barrel

// ??蝳迫嚗 /api barrel ?臬 "use client" UI ?辣
// RagView, RagQueryView ?芾敺?root barrel ?臬
```

## ??閬?

### ??蝳迫
```typescript
// api/index.ts 銝? re-export "use client" ?辣
export { RagView } from "./interfaces/components/RagView"; // 蝳迫??api/
```

## 撽??賭誘

```bash
npm run lint
npm run build
```
