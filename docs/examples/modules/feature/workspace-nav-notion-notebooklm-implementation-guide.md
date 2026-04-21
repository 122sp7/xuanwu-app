# Workspace Nav — Notion & NotebookLM Tab Implementation Guide

## Purpose

本文件說明如何以現有 Xuanwu 架構（Hexagonal DDD + Next.js App Router）實作
`notion` 與 `notebooklm` 兩個主域在 workspace 導覽層的**完整分頁畫面**。

前一步驟（`workspace-nav-model.ts` 已新增 8 個 tab 項目）只完成了**導覽資料層**的定義。
本文件延續那個基線，說明資料層、行為層、UI / Navigation 層各自該做什麼，以及如何在不違反邊界規則的前提下串接起來。

---

## 1. 三層模型對照表

### 1.1 Notion — 知識與資料結構

| 層次 | 內容 |
|---|---|
| **資料層 (Data / Resource Layer)** | `Page` — 階層式內容容器，含 `parentPageId`、`blockIds[]`、`iconUrl`、`coverUrl`；`Block` — 最小內容單元（text / image / code / table 等）；`Database` — 具型別屬性的結構化集合（text / number / select / date / relation）；`View` — 資料庫的呈現設定（table / board / calendar / gallery / timeline）；`Template` — 可重用頁面或資料庫鷹架（scope: workspace / org / global；category: page / database / workflow）；`Comment` — 頁面或 Block 上的討論串 |
| **行為層 (Behavior / Capability Layer)** | Page: `CreatePage`、`RenamePage`、`ArchivePage`、`QueryPages`；Block: `AppendBlock`、`UpdateBlock`；Database: `CreateDatabase`、`AddProperty`、`QueryDatabase`；View: `CreateView`（type / filter / sort）；Template: `ApplyTemplate`（erase 再植入）；Collaboration: `AddComment`、`ResolveComment` |
| **UI / Navigation 層** | `notion.knowledge` → 知識中心（page tree 入口）；`notion.pages` → 頁面瀏覽器（樹狀 + 搜尋）；`notion.database` → 結構化資料視圖（table / board 切換）；`notion.templates` → 範本庫 |

### 1.2 NotebookLM — AI 理解與推理

| 層次 | 內容 |
|---|---|
| **資料層 (Data / Resource Layer)** | `Notebook` — AI 筆記本（`sourceIds[]`、`model`、status）；`IngestionSource` — 已 ingested 的來源文件（`mimeType`、`sizeBytes`、`classification`: image / manifest / record / other、`status`: active / processing / archived / deleted、`storageUrl`）；`Conversation` — 與 Notebook 綁定的 thread（`messages[]`：`role`: `"user"` / `"assistant"` / `"system"`，此處 `"user"` 為 AI message role 術語，非 `Actor` 身份語意；`content`）|
| **行為層 (Behavior / Capability Layer)** | Notebook: `CreateNotebook`、`AddSourceToNotebook`、`RemoveSource`、`GenerateNotebookResponse`、`ArchiveNotebook`；IngestionSource: `AddSource`（upload trigger）、`ArchiveSource`、`DeleteSource`；Conversation: `StartConversation`、`AddMessage`（user message → RAG grounding → assistant reply）|
| **UI / Navigation 層** | `notebooklm.notebook` → RAG 查詢（notebook 列表 + 執行 grounding query）；`notebooklm.ai-chat` → AI 對話（Conversation thread UI）；`notebooklm.sources` → 來源文件（IngestionSource 上傳 / 狀態追蹤）；`notebooklm.research` → 研究摘要（Conversation synthesis / summary 視圖）|

---

## 2. 目前已完成的基線

```
src/modules/workspace/adapters/inbound/react/workspace-nav-model.ts
```

已定義的 tab 項目（`WORKSPACE_TAB_ITEMS`）：

```typescript
// notion group
{ id: "notion.knowledge",  value: "Knowledge",  label: "知識",   domainGroup: "notion" }
{ id: "notion.pages",      value: "Pages",      label: "頁面",   domainGroup: "notion" }
{ id: "notion.database",   value: "Database",   label: "資料庫", domainGroup: "notion" }
{ id: "notion.templates",  value: "Templates",  label: "範本",   domainGroup: "notion" }

// notebooklm group
{ id: "notebooklm.notebook", value: "Notebook", label: "RAG 查詢",  domainGroup: "notebooklm" }
{ id: "notebooklm.ai-chat",  value: "AiChat",   label: "AI 對話",   domainGroup: "notebooklm" }
{ id: "notebooklm.sources",  value: "Sources",  label: "來源文件",  domainGroup: "notebooklm" }
{ id: "notebooklm.research", value: "Research", label: "研究摘要",  domainGroup: "notebooklm" }
```

`WorkspaceTabValue` union 已含 `Pages | Database | Templates | Sources | Research`。
`DEFAULT_NAV_PREFS.pinnedWorkspace` 已依 domain 分組排列，所有新 ID 都在預設清單中。
Legacy aliases（`NotionPages`、`NotionDatabase`、`NotionTemplates`、`NotebookSources`、`NotebookResearch`）已加入 `WORKSPACE_TAB_ALIASES`。

---

## 3. 下一步實作路徑

### 3.1 `workspace-route-screens.tsx` — 新增 tab 分支

`WorkspaceDetailRouteScreen` 的 `<section>` 目前只處理 `Overview`，其餘 tab 顯示佔位文字。
每個新 tab 需補上對應的 **route section component**。

**原則**：
- Section component 只做 UI composition，不含業務邏輯。
- 呼叫 module use case 必須透過 server action 或 tRPC 路由，**不直接 import use case class**。
- 跨模組資料只能透過 `@/modules/notion` 或 `@/modules/notebooklm` 的 `index.ts` 公開介面取得。

**範例結構（notion.pages）**：

```tsx
// 在 WorkspaceDetailRouteScreen 的 <section> 中加入：
{activeTab === "Pages" && (
  <NotionPagesSection workspaceId={workspaceId} accountId={accountId} />
)}
```

```tsx
// 新建 src/modules/notion/adapters/inbound/react/NotionPagesSection.tsx
"use client";
// 職責：只做列表 UI + 呼叫 server action。
// 禁止：import Page 聚合、import PageRepository。
```

#### 各 tab 對應的 section components

| Tab value | 建議 component 名稱 | 所屬模組 adapter 路徑 |
|---|---|---|
| `Pages` | `NotionPagesSection` | `src/modules/notion/adapters/inbound/react/` |
| `Database` | `NotionDatabaseSection` | `src/modules/notion/adapters/inbound/react/` |
| `Templates` | `NotionTemplatesSection` | `src/modules/notion/adapters/inbound/react/` |
| `Knowledge` | `NotionKnowledgeSection` | `src/modules/notion/adapters/inbound/react/` |
| `Notebook` | `NotebooklmNotebookSection` | `src/modules/notebooklm/adapters/inbound/react/` |
| `AiChat` | `NotebooklmAiChatSection` | `src/modules/notebooklm/adapters/inbound/react/` |
| `Sources` | `NotebooklmSourcesSection` | `src/modules/notebooklm/adapters/inbound/react/` |
| `Research` | `NotebooklmResearchSection` | `src/modules/notebooklm/adapters/inbound/react/` |

### 3.2 Server Actions（notion）

在 `src/modules/notion/adapters/inbound/server-actions/` 建立各 tab 所需的 server action 檔案。
必須遵守「先 Zod parse → 呼叫 use case → 回傳 CommandResult」的三段式：

```typescript
// src/modules/notion/adapters/inbound/server-actions/page-actions.ts
"use server";
import { z } from "zod";
import { createClientNotionUseCases } from "../../outbound/firebase-composition";

const QueryPagesInputSchema = z.object({
  workspaceId: z.string().uuid(),
  accountId: z.string(),
  parentPageId: z.string().nullable().optional(),
});

export async function queryPagesAction(rawInput: unknown) {
  const input = QueryPagesInputSchema.parse(rawInput);
  const { queryPages } = createClientNotionUseCases();
  return queryPages.execute(input);
}
```

現有 use case：
- `QueryPagesUseCase` → 給 `notion.pages` / `notion.knowledge`
- `CreatePageUseCase` → 新增頁面
- `RenamePageUseCase` → 重命名
- `ArchivePageUseCase` → 封存

### 3.3 Server Actions（notebooklm）

```typescript
// src/modules/notebooklm/adapters/inbound/server-actions/notebook-actions.ts
"use server";
import { z } from "zod";
import { createClientNotebooklmUseCases } from "../../outbound/firebase-composition";

const ListNotebooksInputSchema = z.object({
  workspaceId: z.string().uuid(),
  accountId: z.string(),
});

export async function listNotebooksAction(rawInput: unknown) {
  const input = ListNotebooksInputSchema.parse(rawInput);
  const { listNotebooks } = createClientNotebooklmUseCases();
  return listNotebooks.execute(input);
}
```

現有 use case：
- `CreateNotebookUseCase` → 給 `notebooklm.notebook`
- `AddDocumentToNotebookUseCase` → 給 `notebooklm.sources`
- `GenerateNotebookResponseUseCase` → 給 `notebooklm.notebook` / `notebooklm.research`

---

## 4. 開發順序建議

遵循架構核心規則中的「Use Case → Domain → (Application ↔ Ports iterate) → Infrastructure → Interface」：

```
1. 確認 use case 已存在（或新增）  → src/modules/<context>/subdomains/*/application/
2. 建立 server action                → src/modules/<context>/adapters/inbound/server-actions/
3. 建立 section component            → src/modules/<context>/adapters/inbound/react/
4. 在 workspace-route-screens.tsx 加入 tab branch
5. 在 workspace-shell-interop.tsx 補 quick access item
6. lint + build + unit test 驗證
```

---

## 5. 邊界規則摘要

| 規則 | 正確做法 | 禁止做法 |
|---|---|---|
| 跨模組呼叫 | `import { ... } from "@/modules/notion"` | `import { Page } from "@/modules/notion/subdomains/page/domain/entities/Page"` |
| Server Action 輸入 | 先 `ZodSchema.parse(rawInput)` | 直接把 `rawInput` 傳進 use case |
| UI component | 只做 composition + 呼叫 action | 在 `.tsx` 內含 business invariant |
| notion AI 能力 | 透過 `ai` 模組路由 | 在 notion 內直接呼叫 Genkit |
| notebooklm 文件所有權 | 透過 `platform.FileAPI` 處理 ownership | 直接呼叫 raw `StorageAPI` |
| 任務物化 | 透過 `TaskMaterializationWorkflowPort` | notebooklm 直接寫入 workspace repository |

---

## 6. 與 workspace-nav-model.ts 的對應關係

```
WorkspaceTabValue          →  domainGroup    →  backing subdomain
──────────────────────────────────────────────────────────────────
Knowledge                  →  notion         →  notion/page (page tree overview)
Pages                      →  notion         →  notion/page
Database                   →  notion         →  notion/database + notion/view
Templates                  →  notion         →  notion/template
Notebook                   →  notebooklm     →  notebooklm/notebook
AiChat                     →  notebooklm     →  notebooklm/conversation
Sources                    →  notebooklm     →  notebooklm/source
Research                   →  notebooklm     →  notebooklm/conversation (synthesis mode)
```

`resolveTabDomainGroup(tab)` 可在 shell sidebar 中用於條件顯示對應主域的 section nav，
`resolveWorkspaceTabValue(rawValue)` 可在 `WorkspaceDetailRouteScreen` 的 URL 解析時使用。

---

## 7. 相關文件

- [`workspace-nav-model.ts`](../../../../src/modules/workspace/adapters/inbound/react/workspace-nav-model.ts) — tab 資料模型
- [`workspace-route-screens.tsx`](../../../../src/modules/workspace/adapters/inbound/react/workspace-route-screens.tsx) — route section composition
- [`workspace-shell-interop.tsx`](../../../../src/modules/workspace/adapters/inbound/react/workspace-shell-interop.tsx) — shell quick access + nav preferences
- [`docs/structure/contexts/notion/subdomains.md`](../../../structure/contexts/notion/subdomains.md) — notion 子域策略
- [`docs/structure/contexts/notebooklm/subdomains.md`](../../../structure/contexts/notebooklm/subdomains.md) — notebooklm 子域策略
- [`docs/examples/modules/feature/notebooklm-source-processing-task-flow.md`](./notebooklm-source-processing-task-flow.md) — notebooklm/source 文件處理 use case
- [`docs/structure/system/hard-rules-consolidated.md`](../../../structure/system/hard-rules-consolidated.md) — 全域邊界規則
