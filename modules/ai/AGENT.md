# AGENT.md — ai BC

## 模組定位

`ai` 是 RAG 攝入管線的 Job 協調支援域。管理 IngestionJob 生命週期，協調 py_fn/ Python worker。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `IngestionJob` | Job、Task（在此 BC 內）、ParseJob |
| `IngestionDocument` | Document、File（在此 BC 內）|
| `IngestionChunk` | Chunk、VectorChunk |
| `IngestionStatus` | Status, JobStatus |

## 棄用檔案守衛

以下檔案都是 `@deprecated` stubs，已移至其他模組，**絕對不要** import：
- `modules/ai/domain/entities/graph-node.ts` → 移至 `modules/wiki/`
- `modules/ai/domain/entities/link.ts` → 移至 `modules/wiki/`
- `modules/ai/domain/repositories/GraphRepository.ts` → 移至 `modules/wiki/`

## 邊界規則

### ✅ 允許
```typescript
import { aiApi } from "@/modules/ai/api";
import type { IngestionJobDTO } from "@/modules/ai/api";
```

### ❌ 禁止
```typescript
import { IngestionJob } from "@/modules/ai/domain/entities/IngestionJob";
import { graph-node } from "@/modules/ai/domain/entities/graph-node"; // deprecated stub
```

## Runtime 邊界規則

- `ai` 模組只在 Next.js 端做 Job 協調
- Embedding 生成在 `py_fn/` 執行，不要在 `ai` module 加入 heavy ML 邏輯

## 驗證命令

```bash
npm run lint
npm run build
```
