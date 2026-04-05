# AGENT.md — modules/notebook

## 模組定位

`modules/notebook` 是 Knowledge Platform 的**支援域（Supporting Domain）**，對應 NotebookLM 的 AI 筆記與對話管理層。負責筆記本生命週期、多輪對話、摘要與洞察管理。AI 推理能力委派給 `ai/api`，RAG 檢索委派給 `search/api`。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `Notebook`（不是 Note、Document）
- `Thread`（不是 Conversation、History）
- `Message`（不是 Message 以外的術語，role 為 `user` | `assistant`）
- `ChatSession`（不是 Session、Dialog）
- `Summary`（不是 Abstract、Brief）
- `AgentGeneration`（不是 AIResponse、LLMOutput）
- `Citation`（不是 Reference、Source）

## 邊界規則

### ✅ 允許

```typescript
// 其他模組透過 api/ 存取
import { notebookFacade } from "@/modules/notebook/api";
import type { NotebookDTO, ThreadDTO } from "@/modules/notebook/api";
```

### ❌ 禁止

```typescript
// 禁止直接 import 內部層
import { Thread } from "@/modules/notebook/domain/entities/thread";
import { GenkitNotebookRepository } from "@/modules/notebook/infrastructure/genkit";
```

## 重要架構規則

- **Server Action 不能從 `@/modules/notebook/api` barrel 在 client component 中 import** — 會打包 Genkit/gRPC server-only 模組。應在 `app/` 的本地 `_actions.ts` 使用 `"use server"` 包裝。
- AI 生成邏輯不在此模組內直接實作，透過 `ai/api` 委派。

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `ai/api` | API 呼叫 | 委派 LLM 推理、Embedding 生成 |
| `search/api` | API 呼叫 | 委派 RAG 向量檢索 |
| `knowledge/api` | 事件訂閱 | 監聽頁面更新以刷新摘要 |
| `identity/api` | API 呼叫 | 驗證使用者身分 |
| `workspace/api` | API 呼叫 | 驗證工作區範圍 |

## AI 整合安全規則

- Genkit / gRPC 適配器**只能**存在於 `infrastructure/genkit/` 下
- Server Action 必須有獨立的本地 `_actions.ts`，不透過 barrel export

```typescript
// app/(shell)/ai-chat/_actions.ts — 正確方式
"use server";
import { generateNotebookResponse } from "@/modules/notebook/application/use-cases/...";
```

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
