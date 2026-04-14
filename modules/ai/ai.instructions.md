---
description: Rules for the AI bounded context.
applyTo: 'modules/ai/**/*.{ts,tsx,js,jsx,md}'
---

# AI Instructions

## Ownership

- modules/ai 擁有共享 AI capability：generation、orchestration、distillation、retrieval、memory、context、safety、tool-calling、reasoning、conversation、evaluation、tracing。
- provider routing 與 model policy 在此模組定義，不在下游模組重建。

## Dependency Rules

- Genkit 與 provider SDK import 只能出現在 `modules/ai/infrastructure/`。
- 下游消費者只能透過 `modules/ai/api`（client-safe types）或 `modules/ai/api/server`（server functions）存取。
- domain 層不得依賴任何框架、SDK 或傳輸層。
- 子域之間透過 ports 或 orchestration application 協調，不直接互相 import domain 層。

## Naming

- 生成輸出型別用 `GenerationResult` 或 `GenerateAiTextOutput`，不用 `Response`。
- 蒸餾輸出型別用 `DistillationResult`，不用 `SummarizedText` 或 `Summary`。
- 搜尋輸出型別用 `RetrievalResult`，不用 `SearchResult` 泛稱。

## Anti-Patterns

- 不在 ai 內定義 KnowledgeArtifact、Notebook、Conversation（notebooklm 正典）等他域型別。
- 不混入 identity governance 或 billing policy。
- 不讓其他模組繞過 api 邊界直接 import subdomain internals。
