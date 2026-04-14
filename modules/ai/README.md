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
import type { AIAPI, GenerateAiTextInput, GenerateAiTextOutput, AiTextGenerationPort } from "@/modules/ai/api";

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
