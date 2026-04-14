# AI

共享 AI capability bounded context：content-generation、content-distillation、context-assembly、evaluation-policy、memory-context、model-observability、prompt-pipeline、safety-guardrail。

## Intended Ownership

- provider routing 與 model policy
- safety-guardrail：風險限制與安全護欄
- prompt-pipeline：prompt、flow 與 tool-calling orchestration
- content-generation：共享文字生成與 summarization 能力
- content-distillation：將長輸出濃縮為精煉知識片段
- context-assembly：組裝 token-budgeted、模型可用的上下文
- evaluation-policy：輸出品質與回歸評估規則
- model-observability：AI 執行觀測與 trace metadata
- memory-context：可重用的 AI 記憶與脈絡保留

## Active Baseline

- content-generation 子域持有 Genkit-backed 文字生成接縫（`generateAiText`、`summarize`）
- content-distillation 子域現在提供結構化蒸餾能力（`distillContent`）
- 下游模組透過 `modules/ai/api`（client-safe types）與 `modules/ai/api/server`（server-only functions）消費
- 其餘子域為語意骨架，依需求逐步實作

## Capability Rules

- context-assembly 應先聚合、排序並壓縮上下文，再把可用輸入交給 content-generation 或 content-distillation。
- content-generation 應透過 provider-agnostic adapter 產生最終文字或結構化輸出，且輸出必須先經 schema 驗證。
- memory-context 應優先保存 distilled knowledge，而不是無限制累積 raw content。
- content-distillation 應作為 AI domain 的 knowledge compiler，把 raw 或多來源內容轉為低 token、可重用、可結構化的知識訊號。
- prompt-pipeline 應控制多步 flow、retry、fallback 與 tool-calling orchestration，不承載下游業務語義。
- evaluation-policy 應覆蓋 content-generation 與 content-distillation，至少量測 compression、retention 與 hallucination 風險。
- safety-guardrail 可以在任何步驟阻斷執行；model-observability 只負責觀測，不得改變業務決策。

## Subdomains

| Subdomain | Status | Notes |
|---|---|---|
| content-generation | active | GenkitAiTextGenerationAdapter 已實作 |
| content-distillation | active | GenkitDistillationAdapter 已實作 |
| context-assembly | semantic skeleton | 模型上下文組裝 |
| evaluation-policy | semantic skeleton | 輸出品質評估規則 |
| memory-context | semantic skeleton | 可重用 AI 記憶脈絡 |
| model-observability | semantic skeleton | 執行觀測與 trace metadata |
| prompt-pipeline | active baseline | prompt、flow、tool-calling orchestration |
| safety-guardrail | semantic skeleton | 安全護欄與限制 |

## Public API

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

## Dependency Direction

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- domain 不得依賴任何 SDK 或框架。
- Genkit 與 provider SDK 只能在 `infrastructure/` 層。
- 跨模組消費只能透過 `api/` 邊界。
