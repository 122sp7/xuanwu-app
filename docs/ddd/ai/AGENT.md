# AGENT.md ??ai BC

## 璅∠?摰?

`ai` ??RAG ?蝞∠???Job ?矽?舀?恣??IngestionJob ??望?嚗?隤?py_fn/ Python worker??

## ?隤?嚗biquitous Language嚗?

| 甇?Ⅱ銵? | 蝳迫雿輻 |
|----------|----------|
| `IngestionJob` | Job?ask嚗甇?BC ?改??arseJob |
| `IngestionDocument` | Document?ile嚗甇?BC ?改?|
| `IngestionChunk` | Chunk?ectorChunk |
| `IngestionStatus` | Status, JobStatus |

## 璉瑼?摰?

隞乩?瑼??賣 `@deprecated` stubs嚗歇?券?瑽??宏?歹?**蝯?銝?** import嚗?
- `modules/ai/domain/entities/graph-node.ts` ??撌脣?歹????撌脩宏?歹?
- `modules/ai/domain/entities/link.ts` ??撌脣?歹????撌脩宏?歹?
- `modules/ai/domain/repositories/GraphRepository.ts` ??撌脣?歹????撌脩宏?歹?

## ??閬?

### ???迂
```typescript
import { aiApi } from "@/modules/ai/api";
import type { IngestionJobDTO } from "@/modules/ai/api";
```

### ??蝳迫
```typescript
import { IngestionJob } from "@/modules/ai/domain/entities/IngestionJob";
import { graph-node } from "@/modules/ai/domain/entities/graph-node"; // deprecated stub
```

## Runtime ??閬?

- `ai` 璅∠??芸 Next.js 蝡臬? Job ?矽
- Embedding ????`py_fn/` ?瑁?嚗?閬 `ai` module ? heavy ML ?摩

## 撽??賭誘

```bash
npm run lint
npm run build
```
