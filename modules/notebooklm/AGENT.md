# AGENT.md — notebooklm BC

## 模組定位

`notebooklm` 是 AI 對話的支援域，管理 7 個子域（ai、conversation、note、notebook、source、synthesis、versioning）並封裝 Genkit 呼叫。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Thread` | Conversation、Chat、Session |
| `Message` | ChatMessage、Msg |
| `MessageRole` | Role（單獨使用）、Speaker |
| `NotebookResponse` | AIResponse、GeneratedText |
| `NotebooklmRepository` | AIRepository、ChatRepository |

## 最重要規則：Server Action 隔離

```typescript
// ✅ 正確：在 app/(shell)/ai-chat/_actions.ts 中建立本地 action
"use server";
import { notebooklmApi } from "@/modules/notebooklm/api";
export async function generateResponse(input) {
  return notebooklmApi.generateResponse(input);
}

// ❌ 禁止：在 Client Component 直接 import notebooklm/api
// Genkit/gRPC 是 server-only，會導致打包失敗
import { notebooklmApi } from "@/modules/notebooklm/api"; // 在 "use client" 檔案中
```

## 邊界規則

### ✅ 允許
```typescript
// Server-side context only
import { notebooklmApi } from "@/modules/notebooklm/api";
import type { ThreadDTO, MessageDTO } from "@/modules/notebooklm/api";
```

## 子域導航

| 子域 | 路徑 | 核心職責 |
|------|------|---------|
| `conversation` | `subdomains/conversation/` | Thread 與 Message 生命週期 |
| `note` | `subdomains/note/` | 輕量筆記與知識連結 |
| `notebook` | `subdomains/notebook/` | Notebook 組合與管理 |
| `source` | `subdomains/source/` | 來源文件追蹤與引用 |
| `synthesis` | `subdomains/synthesis/` | RAG 合成、摘要與洞察生成 |
| `conversation-versioning` | `subdomains/conversation-versioning/` | 對話版本與快照策略 |

> ⚠️ **Code Migration Required**
> - `ai` 子域不屬於 notebooklm。通用 AI 模型提供者能力由 `platform.ai` 負責。
>   `subdomains/ai/` 內的 RAG/grounding/synthesis 程式碼應重構至 `retrieval`、`grounding`、`evaluation` gap 子域。
>   受影響：`api/index.ts`、`api/server.ts`（目前引用 `subdomains/ai/qa`）。
> - `subdomains/versioning/` → 已重命名為 `subdomains/conversation-versioning/`。

## 驗證命令

```bash
npm run lint
npm run build
```
