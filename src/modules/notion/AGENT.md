# Notion Module Agent Guide

## Purpose

`src/modules/notion` 等價蒸餾 `modules/notion` 的正典知識內容能力：
knowledge（頁面生命週期）、authoring（建立/分類）、collaboration（留言/權限快照）、knowledge-database（結構化多視圖）。

## Boundary Rules

- `domain/` 禁止依賴 Firestore SDK、React 或任何外部框架。
- `application/` 只依賴 `domain/` 的 repository + service 抽象。
- Firestore SDK 只能出現在 `adapters/outbound/firestore/`。
- 外部消費者只透過 `src/modules/notion/index.ts`（具名匯出）存取。
- 下游（notebooklm）只能 **reference** KnowledgePage，不可直接寫入。
- 所有 barrel 用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾規則

- 保留 knowledge + authoring + collaboration + knowledge-database 4 個 core 概念。
- taxonomy 以 `TaxonomyTag` value object 輕量保留（不建完整子域）。
- publishing、knowledge-versioning、automation、templates、external-knowledge-sync 等跳過。
- `KnowledgePage` 是 Published Language token，不可用 `Doc`、`Wiki`、`Article` 替代。

## Route Here When

- 需要建立、更新、發布或封存知識頁面（`KnowledgePage`）。
- 需要管理 Collection（structured database）或 CollectionEntry。
- 需要查詢知識頁面內容供 notebooklm 引用。
- 需要業務規則判斷頁面是否可發布（`PublicationPolicyService`）。

## Route Elsewhere When

- 身份、存取治理 → `src/modules/iam`。
- 工作區範疇、任務、issue → `src/modules/workspace`。
- 對話、RAG 推理、synthesis → `src/modules/notebooklm`（消費 KnowledgePage reference）。
- 帳號、組織 → `src/modules/platform`。
- AI 生成內容 → `src/modules/ai`（先生成，再存 KnowledgePage）。

## Development Order

```
domain/entities/ + repositories/ → application/use-cases/ → adapters/outbound/ → adapters/inbound/ → 更新 barrel
```

## Delivery Style

- 優先實作 `createKnowledgePage` + `publishKnowledgePage`（最核心的內容生命週期路徑）。
- `PublicationPolicyService` 是 domain service，發布規則不要讓它漏入 application 或 UI。
- TaxonomyTag 保持為輕量 VO，等有完整分類需求時才升級為 subdomain。
- 奧卡姆剃刀：CollectionEntry 的多視圖邏輯屬於 UI 呈現層，不需要在 domain 內建 view model。
