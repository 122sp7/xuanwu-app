# Notion 功能對齊 開發指南

> **文件版本**：v1.0.0
> **最後更新**：2026-03-23
> **目標讀者**：參與 `modules/wiki-beta` Notion 對齊功能開發的工程師

---

## 文件一致性（單一真實來源）

- 本文件與設計規格、使用手冊皆以 [docs/wiki-beta/wiki-beta-runtime-flow.mermaid](../wiki-beta/wiki-beta-runtime-flow.mermaid) 為準。
- Notion 能力對照詞彙一律以 [docs/wiki-beta/wiki-beta-naming-alignment.md](../wiki-beta/wiki-beta-naming-alignment.md) 為準。
- 任何對 runtime boundary、資料模型、命名的調整，必須同步更新本文件、設計規格和使用手冊。

---

## 1. 前置閱讀

開始實作前，請先閱讀：

1. **架構規範**：`docs/architecture/wiki.md`
2. **命名對照**：`docs/wiki-beta/wiki-beta-naming-alignment.md`
3. **Runtime 流程圖**：`docs/wiki-beta/wiki-beta-runtime-flow.mermaid`
4. **開發契約**：`docs/reference/development-contracts/wiki-contract.md`
5. **整體 MDDD 規範**：`CLAUDE.md`

---

## 2. 目的

本指南定義 Xuanwu 專案如何對齊 Notion 核心能力，並在 `modules/wiki-beta` 的 MDDD 邊界內安全地實作。對齊 Notion 的目標並非複製 Notion，而是讓使用者在 Xuanwu 內可以完成相同的知識管理工作流程：

- 以層級頁面（Pages）組織資訊
- 以結構化資料表（Libraries）管理記錄
- 以 RAG 查詢整合 AI 知識

---

## 3. Runtime 邊界

### Next.js 擁有

- 路由與頁面結構（`app/(shell)/wiki-beta/`）
- Pages 與 Libraries 的 UI 流程
- 上傳互動與狀態顯示
- Application use-case 協調（`modules/wiki-beta/application/`）

### py_fn 擁有

- RAG 查詢執行（`rag_query`）
- 文件重整執行（`rag_reindex_document`）
- Storage trigger ingestion pipeline

### 禁止跨越

- 不可在 Next.js runtime 執行 parse/chunk/embed。
- 不可讓 py_fn 擁有任何 UI 渲染或 session 邏輯。
- 不可在 `modules/wiki-beta` 內部直接引用 `modules/wiki`（反向亦然）。

---

## 4. 命名原則

實作時一律使用下表對應詞彙：

| Notion 術語 | Xuanwu UI 術語 | Xuanwu Domain 術語 |
|---|---|---|
| Page tree | Pages | `WikiBetaPage` |
| Database / Data source | Libraries | `WikiBetaLibrary` |
| Properties（欄位） | Fields | `WikiBetaLibraryField` |
| Pages in database（行） | Records | `WikiBetaLibraryRow` |
| Relation | Relation | relation field type |
| Page properties | Page Metadata | page metadata fields |

- 不可在 runtime code identifier 中直接使用 `Notion`。
- UI 文案一律使用 `Pages` 和 `Libraries`，不可混用 `database`、`table`、`collection`。

---

## 5. 模組責任

```
modules/wiki-beta/
├── domain/
│   ├── entities/
│   │   ├── wiki-beta-page.types.ts       # WikiBetaPage, CreateWikiBetaPageInput, ...
│   │   ├── wiki-beta-library.types.ts    # WikiBetaLibrary, WikiBetaLibraryField, WikiBetaLibraryRow
│   │   └── wiki-beta.types.ts            # RAG, Documents, KnowledgeTree
│   └── repositories/
│       └── wiki-beta.repositories.ts     # Repository interfaces
├── application/
│   └── use-cases/
│       ├── wiki-beta-pages.use-case.ts       # CRUD + tree + cycle guard
│       ├── wiki-beta-libraries.use-case.ts   # CRUD + fields + rows
│       ├── wiki-beta-rag.use-case.ts         # RAG query + reindex
│       └── wiki-beta-knowledge-tree.use-case.ts
├── infrastructure/
│   └── repositories/
│       ├── firebase-wiki-beta-page.repository.ts
│       ├── firebase-wiki-beta.repository.ts
│       ├── in-memory-wiki-beta-page.repository.ts
│       └── in-memory-wiki-beta-library.repository.ts
└── interfaces/
    └── components/
        ├── WikiBetaPagesTreeView.tsx   # 頁面樹 UI
        ├── WikiBetaLibrariesView.tsx   # Libraries UI
        └── WikiBetaHubView.tsx
```

---

## 6. Pages 功能開發流程

### 6.1 建立頁面（Create Page）

**Use-case**：`createWikiBetaPage(input)`

```typescript
import { createWikiBetaPage } from "@/modules/wiki-beta";

const page = await createWikiBetaPage({
  accountId: "acc_123",
  workspaceId: "ws_456",  // 選填
  title: "我的第一頁",
  parentPageId: null,      // null = 根頁面
});
```

**限制**：
- `title` 必填，最長 120 字元。
- `parentPageId` 必須是同一 account 下存在的頁面。
- 同層 slug 自動去重（`page-title`, `page-title-2`, ...）。

### 6.2 更名頁面（Rename Page）

```typescript
import { renameWikiBetaPage } from "@/modules/wiki-beta";

await renameWikiBetaPage({
  accountId: "acc_123",
  pageId: "page_abc",
  title: "新標題",
});
```

### 6.3 移動頁面（Move Page）

```typescript
import { moveWikiBetaPage } from "@/modules/wiki-beta";

await moveWikiBetaPage({
  accountId: "acc_123",
  pageId: "page_child",
  targetParentPageId: "page_parent", // null = 提升為根頁面
});
```

**限制**：
- 禁止形成循環（頁面不可移到自己的子孫下）。

### 6.4 讀取頁面樹

```typescript
import { listWikiBetaPagesTree } from "@/modules/wiki-beta";

const tree = await listWikiBetaPagesTree("acc_123", "ws_456");
// 回傳 WikiBetaPageTreeNode[]，已遞迴排序
```

---

## 7. Libraries 功能開發流程

### 7.1 建立 Library

```typescript
import { createWikiBetaLibrary } from "@/modules/wiki-beta";

const library = await createWikiBetaLibrary({
  accountId: "acc_123",
  workspaceId: "ws_456",  // 選填
  name: "任務追蹤",
});
```

### 7.2 新增欄位（Field）

支援型別：`title` | `text` | `number` | `select` | `relation`

```typescript
import { addWikiBetaLibraryField } from "@/modules/wiki-beta";

await addWikiBetaLibraryField({
  accountId: "acc_123",
  libraryId: "lib_xyz",
  key: "status",
  label: "狀態",
  type: "select",
  required: true,
  options: ["待處理", "進行中", "完成"],
});
```

### 7.3 新增記錄（Row）

```typescript
import { createWikiBetaLibraryRow } from "@/modules/wiki-beta";

await createWikiBetaLibraryRow({
  accountId: "acc_123",
  libraryId: "lib_xyz",
  values: {
    title: "修復登入 Bug",
    status: "進行中",
  },
});
```

---

## 8. 資料範圍原則

- 所有讀寫必須是 `accounts/{accountId}/...` 範圍。
- `workspaceId` 為選填篩選視角，不改變 account 主範圍。
- Pages 集合：`accounts/{accountId}/pages/{pageId}`（planned，目前由 in-memory/firebase repository 抽象）。
- Libraries 集合：`accounts/{accountId}/databases/{databaseId}`（planned；Firestore 路徑使用 `databases` 作為儲存層識別，UI 與 domain code 一律使用 `Libraries`/`WikiBetaLibrary*`，請勿在應用層混用兩個詞彙）。
- 嚴禁 global fallback collection。

---

## 9. Domain 事件

Pages 與 Libraries 操作會發布以下 domain events：

| 事件 | 觸發時機 |
|---|---|
| `wiki_beta.page.created` | 建立頁面成功 |
| `wiki_beta.page.renamed` | 更名頁面成功 |
| `wiki_beta.page.moved` | 移動頁面成功 |
| `wiki_beta.library.created` | 建立 Library 成功 |
| `wiki_beta.library.field_added` | 新增欄位成功 |
| `wiki_beta.library.row_created` | 新增記錄成功 |

---

## 10. 測試策略

- **Unit tests**：針對 use-case 使用 `InMemoryWikiBetaPageRepository` / `InMemoryWikiBetaLibraryRepository`。
- **不可**在 unit test 直接依賴 Firebase SDK；repository 必須注入。
- **Integration tests**：透過 Playwright MCP 驗證 `/wiki-beta/pages` 與 `/wiki-beta/libraries` 頁面流程。

---

## 11. 開發步驟總覽

1. **定義能力映射**：先確認對應 Notion 哪一能力，查閱命名對照表。
2. **更新 domain types**：在 `domain/entities/` 擴充或新增型別。
3. **更新 repository interface**：在 `domain/repositories/wiki-beta.repositories.ts` 定義新方法。
4. **實作 use-case**：在 `application/use-cases/` 建立業務邏輯，repo 注入。
5. **實作 infrastructure adapter**：在 `infrastructure/repositories/` 實作 Firebase 版本。
6. **實作 UI**：在 `interfaces/components/` 實作 React 元件，page 只做薄協調。
7. **加入 Server Action**（必要時）：在 `interfaces/_actions/` 建立 `"use server"` 入口。
8. **驗證**：
   - `npm run lint` — 0 errors
   - `npm run build` — 通過
   - Playwright MCP 走完 UI 流程

---

## 12. 驗收清單

- [ ] 命名對齊：UI 文案使用 Pages / Libraries，domain code 使用 `WikiBetaPage*` / `WikiBetaLibrary*`。
- [ ] 無跨 `wiki-beta` ↔ `wiki` 邊界的 deep import。
- [ ] 所有讀寫是 `accounts/{accountId}/...` 範圍。
- [ ] Use-case 測試可在 in-memory repository 下執行。
- [ ] `npm run lint` 和 `npm run build` 通過。
- [ ] 設計規格與使用手冊同步更新。
