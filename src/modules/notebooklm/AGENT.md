# NotebookLM Module Agent Guide

## Purpose

`src/modules/notebooklm` 等價蒸餾 `modules/notebooklm` 的推理輸出能力：
notebook（容器）、conversation（對話生命週期）、source（來源管理）、synthesis（RAG pipeline）。

> **DDD 分類**: Core / Productized AI ｜ **角色**: AI 知識推理域 — document ingestion、chunking/embedding、RAG Q&A、source citation

## Boundary Rules

- `domain/` 禁止依賴 Genkit、Firestore SDK、React 或任何外部框架。
- `application/` 只依賴 `domain/` 的 repository + service 抽象。
- Genkit SDK 只能出現在 `adapters/outbound/genkit/`。
- Firestore SDK 只能出現在 `adapters/outbound/firestore/`。
- 外部消費者只透過 `src/modules/notebooklm/index.ts`（具名匯出）存取。
- Notebooklm 消費 AI capability 透過 `src/modules/ai`（不自行持有 LLM 調用邏輯）。
- 所有 barrel 用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾規則

- 保留 notebook + conversation + source + synthesis 4 個 Tier 1 active 子域概念。
- conversation-versioning、grounding、evaluation 等 gap/stub subdomains 不進 src/modules/notebooklm。
- `RagDocument` 是 normalized chunk，不是原始 SourceFile；兩者語意不同。
- synthesis 的 RAG pipeline 在 application use-case 層協調；排序規則（RagScoringService）屬於 domain。

## Route Here When

- 需要建立 Notebook 或管理 Notebook 生命週期。
- 需要新增來源（URL / 上傳 / notion KnowledgePage引用）。
- 需要 RAG 問答（`askQuestion`）。
- 需要從答案生成筆記（`generateNoteFromAnswer`）。
- 需要引用對齊與 citation 追蹤。

## Route Elsewhere When

- 正典知識頁面內容 → `src/modules/notion`（notebooklm 只引用，不擁有）。
- 身份、存取治理 → `src/modules/iam`。
- LLM 生成能力 → `src/modules/ai`（notebooklm 消費 AI API）。
- 工作區範疇、task → `src/modules/workspace`。
- 帳號、組織 → `src/modules/platform`。

## 子域資料夾設計

每個子域 = **`domain/`（名詞：知識 / 推理元素）** + **`application/`（動詞：RAG 操作）**。
NotebookLM 子域：`notebook/`、`source/`（RAG chunk）、`conversation/`（問答）、`synthesis/`（domain rules）。

## Development Order

```
<subdomain>/domain/ (名詞域：entity / VO / port / domain service)
→ <subdomain>/application/ (動詞域：use-case / DTO)
→ adapters/outbound/(firestore|genkit) → adapters/inbound/ → 更新 barrel
```

## Delivery Style

- 優先實作 `addSourceToNotebook` + `askQuestion`（最核心的 RAG 路徑）。
- `RagScoringService` 與 `RagCitationBuilder` 屬於 domain service，不要讓它們漏入 application 或 adapter。
- 奧卡姆剃刀：synthesis 子域先保持為單一 use-case + service，待召回、排序、評估需求獨立時才分拆。
- Source processing（py_fn ingestion）屬於 py_fn runtime，src 層只消費 processed results。
