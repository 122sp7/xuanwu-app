# AI Module Agent Guide

## Purpose

`src/modules/ai` 等價蒸餾 `modules/ai` 的 active AI capabilities：
content-generation、content-distillation、tool-runtime。
向下游模組輸出 LLM 生成、內容蒸餾與工具呼叫能力。

> **DDD 分類**: Core Domain ｜ **角色**: AI 能力中樞 — LLM / Genkit Flow 編排、prompt pipeline、embeddings / RAG、tool calling

## Boundary Rules

- `domain/` 禁止依賴 Genkit、OpenAI SDK、Firebase、React 或任何外部 SDK。
- `application/` 只依賴 `domain/` 的 port 抽象，不直接接觸 adapter 實作。
- Adapters 只負責 I/O 轉換，禁帶任何業務規則。
- 外部消費者只透過 `src/modules/ai/index.ts`（具名匯出）存取。
- 所有 barrel 用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾規則

- 只移植 `modules/ai` 內 **active（已有 adapter 實作）** 的子域概念（3 ports）。
- stub-only 子域（evaluation-policy、memory-context、model-observability 等）不進 src/modules/ai。
- 每個 active domain port 對應一個 `adapters/outbound/genkit/` 的 adapter class。
- ToolRuntimePort 與 TaskExtractionPort 可共用同一 adapter 或分開（視 Genkit flow 邊界決定）。
- 實作之前先確認是否有現成 adapter 可以直接移植，避免重寫。

## Route Here When

- 需要呼叫 LLM 做文字生成（`generateAiText`）。
- 需要內容蒸餾 / 長輸出摘要（`distillContent`）。
- 需要從文本抽取任務候選（`extractTasksFromContent`）。
- 需要 tool calling 能力（`generateWithTools`）。

## Route Elsewhere When

- 身份、Session、存取治理 → `src/modules/iam`。
- 訂閱、配額、商業政策 → `src/modules/billing`。
- 正典知識頁面與內容 → `src/modules/notion`。
- Notebook、對話、synthesis → `src/modules/notebooklm`。
- 帳號、組織、通知 → `src/modules/platform`。
- 工作區生命週期、任務管理 → `src/modules/workspace`。

## Development Order

```
domain/ports/ → application/use-cases/ → adapters/outbound/ → adapters/inbound/ → 更新 barrel
```

## Delivery Style

- 優先移植 `AiTextGenerationPort` + `DistillationPort`（最常被消費），再補 tool-runtime。
- 新 adapter 只實作所需的 port method，不預先埋 stub 或空 placeholder。
- 奧卡姆剃刀：一個 port + use case 能解決就不新增 application service。
- Genkit SDK 只能出現在 `adapters/outbound/genkit/`，測試時應 mock port 而非真實 Genkit。
