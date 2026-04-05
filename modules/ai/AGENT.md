# AGENT.md — modules/ai

## 模組定位

`modules/ai` 是 Knowledge Platform 的**支援域（Supporting Domain）**，負責 Embedding、向量索引、LLM 推理協調與 RAG 流程。是 `notebook` 和 `search` 模組的 AI 計算引擎。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `Embedding`（不是 Vector、Representation）
- `VectorIndex`（不是 Index、Store）
- `AIQuery`（不是 Query、Request）
- `Prompt`（不是 Input、Instruction）
- `Completion`（不是 Response、Output）
- `Context`（不是 Background、Info）
- `IngestionJob`（不是 Job、Task）

## 邊界規則

### ✅ 允許

```typescript
// 其他模組透過 api/ 存取 AI 能力
import { aiApi } from "@/modules/ai/api";
import type { EmbeddingDTO, AIQueryDTO } from "@/modules/ai/api";
```

### ❌ 禁止

```typescript
// 禁止直接 import 內部層
import { GenkitRagGenerationRepository } from "@/modules/ai/infrastructure/genkit";
```

## Runtime 邊界（最重要規則）

```
Next.js (ai module)  ──→  LLM 推理、串流回應、Genkit Flow
py_fn/               ──→  Embedding 生成、文件解析、向量寫入（重型工作）
```

- **不要**在 Next.js 端做 Embedding 生成或向量寫入
- **不要**在 py_fn 端做使用者對話串流

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `notebook/api` | 提供服務 | 回應 LLM 推理請求 |
| `search/api` | 提供服務 | 提供 Embedding 向量計算 |
| `knowledge/api` | 事件訂閱 | 監聽知識更新觸發 IngestionJob |
| `source/api` | 事件訂閱 | 監聽文件上傳觸發 ingestion |

## Genkit 整合規則

- Genkit Flow 定義在 `infrastructure/genkit/` 下
- `aiClient`（RAG 答案生成）和 `agentClient`（對話代理）分別有獨立 client
- Server Action 不能從 `ai/api` barrel 在 client component import — 會打包 Genkit/gRPC

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
cd py_fn && python -m pytest tests/ -v  # Python worker tests
```
