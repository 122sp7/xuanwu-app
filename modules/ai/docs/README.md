# AI Module Docs

模組本地架構筆記。此文件描述 **目前已落地的 infrastructure baseline**，並用 Context7 驗證過的 Genkit 模式補齊本地說明。

## Current Baseline

- generation 子域持有 Genkit-backed 文字生成接縫，實作位於 [modules/ai/infrastructure/generation/genkit/GenkitAiTextGenerationAdapter.ts](modules/ai/infrastructure/generation/genkit/GenkitAiTextGenerationAdapter.ts)。
- distillation 子域已提供結構化蒸餾能力，實作位於 [modules/ai/subdomains/distillation/infrastructure/llm/GenkitDistillationAdapter.ts](modules/ai/subdomains/distillation/infrastructure/llm/GenkitDistillationAdapter.ts)。
- `generateAiText`、`summarize`、`distillContent` 是目前對外可用的 server functions。
- Notion 與 NotebookLM 都只能透過 AI 公開邊界消費能力，不擁有 provider 或 Genkit runtime。

## Infrastructure Layout

| Path | Responsibility |
|---|---|
| [modules/ai/api/index.ts](modules/ai/api/index.ts) | client-safe types 與 capability contracts |
| [modules/ai/api/server.ts](modules/ai/api/server.ts) | server-only public functions |
| [modules/ai/infrastructure/generation/genkit/GenkitAiTextGenerationAdapter.ts](modules/ai/infrastructure/generation/genkit/GenkitAiTextGenerationAdapter.ts) | 自由文字 generation 與 summarization |
| [modules/ai/subdomains/distillation/infrastructure/llm/GenkitDistillationAdapter.ts](modules/ai/subdomains/distillation/infrastructure/llm/GenkitDistillationAdapter.ts) | schema-validated structured distillation |

## Distillation

distillation 子域負責將長輸出或多段內容濃縮為精煉知識片段（`DistillationResult`）。

它與 generation 的 `summarize` 差異如下：

- generation/summarize：回傳單一摘要字串，偏向快速文字結果。
- distillation：接收 `objective + sources[]`，回傳 `overview + distilledItems[] + trace metadata`，適合下游主域重用。

目前實作的輸出欄位包含：
- `overview`
- `distilledItems`
- `model`
- `traceId`
- `completedAt`

根據 Context7 驗證的官方 Genkit 文件，這個能力使用了：
- `generate()` 作為標準模型呼叫入口
- 結構化輸出 schema 驗證
- prompt/flow 作為可觀測、可調試的執行單位

## Public API Surface

```ts
// client-safe types
import type {
  AIAPI,
  DistillationAPI,
  DistillContentInput,
  DistillationResult,
  GenerateAiTextInput,
  GenerateAiTextOutput,
  AiTextGenerationPort,
} from "@/modules/ai/api";

// server-only functions
import { distillContent, generateAiText, summarize } from "@/modules/ai/api/server";
```

## Architecture Notes

- provider plugin 與 Genkit client 只能存在於 infrastructure adapter。
- 預設模型為 `googleai/gemini-2.5-flash`，可透過 `GENKIT_MODEL` 覆蓋。
- distillation 輸出屬於 **AI capability signal**，不是 KnowledgeArtifact 或 Notebook 的正典模型。
- 子域之間的協調仍由 application / orchestration 控制，不直接跨子域 domain 依賴。

## References

- [modules/ai/README.md](modules/ai/README.md)
- [docs/contexts/ai/README.md](docs/contexts/ai/README.md)
- [docs/contexts/ai/subdomains.md](docs/contexts/ai/subdomains.md)
- [docs/contexts/ai/ubiquitous-language.md](docs/contexts/ai/ubiquitous-language.md)
