# AI Module Agent Guide

## Purpose

modules/ai 是共享 AI capability 的唯一邊界。它擁有 generation、orchestration、distillation、retrieval、memory、safety 與 provider policy，向下游模組輸出能力接縫。

## Boundary Rules

- 把 provider routing、model policy、safety 與 AI orchestration 放在這裡。
- distillation（長輸出蒸餾）與 retrieval（向量搜尋）的通用能力屬於此模組。
- 不放 workspace UI 組合、billing policy、identity governance。
- 跨模組消費者只能透過 `modules/ai/api`（types）或 `modules/ai/api/server`（functions）存取。
- Genkit 與 LLM SDK 只能在 `infrastructure/` 層，domain 層必須框架無關。

## Route Here When

- 需要呼叫 LLM、選擇模型、路由 provider。
- 需要蒸餾（distillation）長輸出或多來源內容為精煉片段。
- 需要向量搜尋、上下文組裝或多步驟 AI flow。
- 需要 safety 護欄或 AI 執行觀測。

## Route Elsewhere When

- 身份與存取治理 → iam。
- 訂閱、配額商業政策 → billing。
- 正典知識內容 → notion。
- 推理輸出、notebook synthesis → notebooklm。

## Delivery Style

- 優先擴展 generation 子域（已有實作），再決定是否需要 distillation 或 orchestration 子域。
- 新子域只有在業務語義真的不同時才建立；骨架存在不代表需要立即實作。
- 奧卡姆剃刀：一個 port + use case 能解決就不要新增 service。
