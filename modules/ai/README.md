# AI

共享 AI capability bounded context：generation、orchestration、distillation、retrieval、memory、safety 與 provider routing。

## Intended Ownership

- provider routing 與 model policy
- quota 與 safety guardrails
- prompt & flow orchestration
- shared text generation（Genkit 接縫）
- distillation：將長輸出濃縮為精煉知識片段
- retrieval：向量搜尋與上下文抓取

## Active Baseline

- generation 子域持有 Genkit-backed 文字生成接縫（`generateAiText`、`summarize`）
- distillation 子域現在提供結構化蒸餾能力（`distillContent`）
- 下游模組透過 `modules/ai/api`（client-safe types）與 `modules/ai/api/server`（server-only functions）消費
- 其餘子域為骨架，依需求逐步實作

## Capability Rules

- context 應先聚合、排序並壓縮上下文，再把可用輸入交給 generation 或 distillation。
- conversation 應管理 AI 互動輪次、system prompt 注入與 replay/debug 狀態，但不得接管 notebooklm 的正典 Conversation 語義。
- generation 應透過 provider-agnostic adapter 產生最終文字或結構化輸出，且輸出必須先經 schema 驗證。
- retrieval 應負責抓取、排序與重排候選內容，不直接負責最終答案生成。
- memory 應優先保存 distilled knowledge，而不是無限制累積 raw content。
- distillation 應作為 AI domain 的 knowledge compiler，把 raw 或多來源內容轉為低 token、可重用、可結構化的知識訊號。
- distillation pipeline 應遵守 ingest → chunk/filter → score → distill → structure → store/index 的順序；大型工作應走 async job。
- reasoning 應只對已準備好的輸入做多步推理，不負責資料抓取或持久化。
- orchestration 應控制多步 flow、retry、fallback 與 parallel execution，不承載下游業務語義。
- tool-calling 應定義工具契約、權限與結果正規化；工具執行仍屬 infrastructure。
- evaluation 應覆蓋 generation 與 distillation，至少量測 compression、retention 與 hallucination 風險。
- safety 可以在任何步驟阻斷執行；tracing 只負責觀測，不得改變業務決策。

## Subdomains

| Subdomain | Status | Notes |
|---|---|---|
| generation | active | GenkitAiTextGenerationAdapter 已實作 |
| orchestration | stub | 多步驟 AI flow |
| distillation | active | GenkitDistillationAdapter 已實作 |
| retrieval | stub | 向量搜尋 |
| memory | stub | 對話歷史 |
| context | stub | prompt 上下文組裝 |
| safety | stub | 安全護欄 |
| tool-calling | stub | 外部工具調用 |
| reasoning | stub | 推理步驟管理 |
| conversation | stub | AI 輪次管理 |
| evaluation | stub | 輸出品質評估 |
| tracing | stub | 執行觀測 |

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
