# AI Module

`src/modules/ai` 是蒸餾自 `modules/ai` 的精簡等價版，以 `src/modules/template` 骨架為基線。
僅保留 **active** 子域的 domain 概念（content-generation、content-distillation、tool-runtime），略過所有 stub-only 子域。

## 領域定位

| 項目 | 內容 |
|---|---|
| **DDD 分類** | Core Domain |
| **定位** | AI 能力中樞（所有智慧行為來源）|
| **核心價值** | 把「語言模型能力」產品化；提供 workspace / notion / notebooklm 可復用的 AI 能力 |
| **不做** | UI、商業規則（billing / plan）、使用者身份管理 |
| **依賴方向** | 被 workspace / notion / notebooklm 使用；不依賴其他 domain |

## 蒸餾來源

`modules/ai`（完整六邊形 + 14 個 subdomains）→ `src/modules/ai`（精簡骨架，3 active ports）

## 目錄結構

```
src/modules/ai/
  index.ts                                    ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts
    ports/
      AiTextGenerationPort.ts                 ← content-generation port
      DistillationPort.ts                     ← content-distillation port
      TaskExtractionPort.ts                   ← task extraction port
      ToolRuntimePort.ts                      ← tool-runtime port
  application/
    index.ts
    use-cases/
      generate-ai-text.use-case.ts
      distill-content.use-case.ts
      extract-tasks-from-content.use-case.ts
      generate-with-tools.use-case.ts
    dto/
      AiTextGenerationDTO.ts
      DistillationDTO.ts
      TaskExtractionDTO.ts
  adapters/
    inbound/
      index.ts
      http/                                   ← HTTP route handlers（ai endpoints）
      rpc/                                    ← tRPC routers
    outbound/
      index.ts
      genkit/
        GenkitAiTextGenerationAdapter.ts      ← implements AiTextGenerationPort
        GenkitDistillationAdapter.ts          ← implements DistillationPort
        GenkitToolRuntimeAdapter.ts           ← implements ToolRuntimePort
        GenkitTaskExtractionAdapter.ts        ← implements TaskExtractionPort
      openai/                                 ← (future) fallback adapter
```

## Barrel 結構

| Barrel | 覆蓋範圍 |
|---|---|
| `index.ts` | domain + application 的公開符號 |
| `domain/index.ts` | 4 ports |
| `application/index.ts` | use-cases + dto |
| `adapters/inbound/index.ts` | http, rpc |
| `adapters/outbound/index.ts` | genkit/, openai/ |

所有 barrel 使用 `export { X }` / `export type { X }`，嚴禁 `export *`。
Source 檔案內部 import 使用直接相對路徑，不走 barrel。

## 蒸餾範圍

| src 概念 | 蒸餾自 modules/ai | 狀態 |
|---|---|---|
| domain/ports/AiTextGenerationPort | domain/ports/ 或 subdomains/content-generation | ✅ 保留 |
| domain/ports/DistillationPort | domain/ports/ 或 subdomains/content-distillation | ✅ 保留 |
| domain/ports/TaskExtractionPort | domain/ports/ | ✅ 保留 |
| domain/ports/ToolRuntimePort | domain/ports/ 或 subdomains/tool-runtime | ✅ 保留 |
| evaluation-policy, memory-context | subdomains/*（stub only） | ❌ 跳過 |
| model-observability, safety-guardrail | subdomains/*（stub only） | ❌ 跳過 |
| conversations, datasets, embeddings, models | subdomains/*（stub only） | ❌ 跳過 |

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

`domain/` 絕對不依賴 Genkit、OpenAI SDK、React 或任何 Firebase 模組。
Genkit / OpenAI SDK 只能出現在 `adapters/outbound/genkit/` 或 `adapters/outbound/openai/`。

## 外部消費方式

```ts
// types（client-safe）
import type { AIAPI, GenerateAiTextInput, DistillationResult } from "@/src/modules/ai";

// server-only functions
import { generateAiText, distillContent, extractTasksFromContent } from "@/src/modules/ai";
```

原始 API 合約參考：`modules/ai/api/index.ts` 與 `modules/ai/api/server.ts`。
