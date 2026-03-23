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

開始實作前，請先閱讀（按順序）：

| 優先 | 文件 | 說明 |
|---|---|---|
| 1 | `docs/wiki-beta/wiki-beta-design-spec.md` | 架構規範 |
| 2 | `docs/wiki-beta/wiki-beta-naming-alignment.md` | **命名對照**（所有術語依此為準） |
| 3 | `docs/wiki-beta/wiki-beta-runtime-flow.mermaid` | Runtime 流程圖 |
| 4 | `docs/wiki-beta/wiki-beta-development-guide.md` | 開發指南 |
| 5 | `CLAUDE.md` | 整體 MDDD 規範 |

---

## 2. 目的

本指南定義 Xuanwu 專案如何對齊 Notion 核心能力，並在 `modules/wiki-beta` 的 MDDD 邊界內安全地實作。

**對齊 Notion 的目標**：讓使用者在 Xuanwu 內完成相同的知識管理工作流程，而非複製 Notion：

- 以**層級頁面（Pages）**組織資訊
- 以**結構化資料表（Libraries）**管理記錄
- 以 **RAG 查詢**整合 AI 知識

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

| 禁止行為 | 理由 |
|---|---|
| Next.js 執行 parse/chunk/embed | 計算密集，屬 py_fn 職責 |
| py_fn 擁有 UI 渲染或 session 邏輯 | 違反 runtime boundary |

---

## 4. 命名原則

實作時一律使用下表對應詞彙（詳見 [wiki-beta-naming-alignment.md](../wiki-beta/wiki-beta-naming-alignment.md)）：

| Notion 術語 | Xuanwu UI 術語 | Xuanwu Domain 術語 |
|---|---|---|
| Page tree | Pages | `WikiBetaPage` |
| Database / Data source | Libraries | `WikiBetaLibrary` |
| Properties（欄位） | Fields | `WikiBetaLibraryField` |
| Pages in database（行） | Records | `WikiBetaLibraryRow` |
| Relation | Relation | `relation` field type |
| Page properties | Page Metadata | page metadata fields |

**嚴格規則**：

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
│       └── wiki-beta.repositories.ts     # Repository interfaces（不依賴 Firebase SDK）
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
│       ├── in-memory-wiki-beta-page.repository.ts    # Unit test 用
│       └── in-memory-wiki-beta-library.repository.ts # Unit test 用
└── interfaces/
    └── components/
        ├── WikiBetaPagesTreeView.tsx   # 頁面樹 UI
        ├── WikiBetaLibrariesView.tsx   # Libraries UI
        └── WikiBetaHubView.tsx
```

**關鍵原則**：
- `domain/` 不可 import Firebase SDK 或任何框架。
- `application/` 依賴 `domain/repositories/` 介面，由 constructor 注入實作。
- `infrastructure/` 提供 Firebase 實作；`in-memory` 實作供 unit test 使用。

---

## 6. Pages 功能開發流程

### 6.1 建立頁面（Create Page）

**Use-case**：`createWikiBetaPage(input, repo)`

```typescript
import { createWikiBetaPage } from "@/modules/wiki-beta";

// ✅ 根頁面
const page = await createWikiBetaPage({
  accountId: "acc_123",
  title: "我的第一頁",
  parentPageId: null,         // null = 根頁面
  workspaceId: "ws_456",      // 選填
}, pageRepository);

// ✅ 子頁面
const subPage = await createWikiBetaPage({
  accountId: "acc_123",
  title: "子頁面",
  parentPageId: page.id,      // 指向父頁面
}, pageRepository);
```

**業務規則**：
- `title` 必填，最長 120 字元。
- `parentPageId` 必須是同一 account 下存在的頁面（或 `null`）。
- 同層 slug 自動去重（`page-title`, `page-title-2`, ...）。

### 6.2 更名頁面（Rename Page）

```typescript
import { renameWikiBetaPage } from "@/modules/wiki-beta";

await renameWikiBetaPage({
  accountId: "acc_123",
  pageId: "page_abc",
  title: "新標題",
}, pageRepository);
// slug 自動更新並去重
```

### 6.3 移動頁面（Move Page）

```typescript
import { moveWikiBetaPage } from "@/modules/wiki-beta";

await moveWikiBetaPage({
  accountId: "acc_123",
  pageId: "page_child",
  targetParentPageId: "page_parent", // null = 提升為根頁面
}, pageRepository);
```

**循環偵測**（必須實作）：
```typescript
// 禁止形成循環：page 不可移動到自己的子孫下
// 以下為偽代碼，實際實作請參考 wiki-beta-pages.use-case.ts 中的 detectCycle() 函式
if (await isDescendant(pageId, targetParentPageId, repo)) {
  // isDescendant: 遞迴找到 targetParentPageId 的所有祖先，若包含 pageId 則回傳 true
  throw new Error("CYCLE_DETECTED: 頁面不可成為自己的子孫");
}
```

### 6.4 讀取頁面樹

```typescript
import { listWikiBetaPagesTree } from "@/modules/wiki-beta";

const tree = await listWikiBetaPagesTree({
  accountId: "acc_123",
  workspaceId: "ws_456",  // 選填
}, pageRepository);
// 回傳 WikiBetaPageTreeNode[]，已遞迴排序（依 order + title）
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
}, libraryRepository);
```

### 7.2 新增欄位（Field）

支援型別：`title` | `text` | `number` | `select` | `relation`

```typescript
import { addWikiBetaLibraryField } from "@/modules/wiki-beta";

// select 欄位
await addWikiBetaLibraryField({
  accountId: "acc_123",
  libraryId: "lib_xyz",
  key: "status",
  label: "狀態",
  type: "select",
  required: true,
  options: ["待處理", "進行中", "完成"],
}, libraryRepository);

// text 欄位
await addWikiBetaLibraryField({
  accountId: "acc_123",
  libraryId: "lib_xyz",
  key: "description",
  label: "說明",
  type: "text",
  required: false,
}, libraryRepository);
```

**欄位 key 規則**：自動 normalize（lowercase、underscore、英數），同 library 內不可重複。

### 7.3 新增記錄（Row）

```typescript
import { createWikiBetaLibraryRow } from "@/modules/wiki-beta";

await createWikiBetaLibraryRow({
  accountId: "acc_123",
  libraryId: "lib_xyz",
  values: {
    title: "修復登入 Bug",    // required: true，必須提供
    status: "進行中",         // required: true，必須提供
    description: "...",      // required: false，可選
  },
}, libraryRepository);
// 若缺少 required 欄位，拋出 REQUIRED_FIELD_MISSING 錯誤
```

---

## 8. 資料範圍原則

| 規則 | 說明 |
|---|---|
| 強制 account scope | 所有讀寫必須是 `accounts/{accountId}/...` 範圍 |
| workspace 只是篩選 | `workspaceId` 為選填篩選視角，不改變 account 主範圍 |
| Pages 集合 | `accounts/{accountId}/pages/{pageId}` |
| Libraries 集合 | `accounts/{accountId}/databases/{databaseId}`（儲存層識別）；UI / domain code 一律用 `Libraries` / `WikiBetaLibrary*` |
| 禁止 global fallback | 不可查詢 `/pages`、`/databases` 等頂層路徑 |

---

## 9. Domain 事件

Pages 與 Libraries 操作後，透過 `modules/event` 發布以下 domain events：

| 事件 | 觸發時機 | 消費注意 |
|---|---|---|
| `wiki_beta.page.created` | 建立頁面成功 | 消費者自行 fetch 最新頁面狀態 |
| `wiki_beta.page.renamed` | 更名頁面成功 | 消費者自行 fetch 最新頁面狀態 |
| `wiki_beta.page.moved` | 移動頁面成功 | 消費者自行 fetch 最新頁面樹 |
| `wiki_beta.library.created` | 建立 Library 成功 | 消費者自行 fetch 最新 Library 列表 |
| `wiki_beta.library.field_added` | 新增欄位成功 | 消費者自行 fetch 最新 Library snapshot |
| `wiki_beta.library.row_created` | 新增記錄成功 | 消費者自行 fetch 最新 Library snapshot |

**原則**：事件為 signal-first（最終一致）。消費者收到事件後自行 fetch 最新狀態，不依賴事件 payload 中的完整資料。

> **最終一致性注意事項**：消費者收到事件後立即讀取 Firestore，偶有可能因寫入尚未傳播而讀到舊資料。建議實作 retry（延遲 200ms 後重試一次）。若業務邏輯對一致性有嚴格需求，改用 Firestore `onSnapshot` 直接監聽文件變更。

---

## 10. 測試策略

| 層次 | 測試方式 | 範圍 |
|---|---|---|
| Unit test | `InMemoryWikiBetaPageRepository` / `InMemoryWikiBetaLibraryRepository` | use-case 業務邏輯（slug 去重、循環偵測、必填驗證） |
| Unit test | Jest + domain type mocks | domain event 發布驗證 |
| Integration test | Playwright MCP | `/wiki-beta/pages`、`/wiki-beta/libraries` UI 流程 |

**規則**：
- Unit test **不可**直接依賴 Firebase SDK；repository 必須透過 interface 注入。
- 循環偵測與 slug 去重必須有 unit test 覆蓋。
- Integration test 至少覆蓋：建立 page、建立 library + 新增欄位 + 新增 record。

---

## 11. 開發步驟總覽

1. **定義能力映射**：確認對應 Notion 哪一能力，查閱命名對照表確認術語。
2. **更新 domain types**：在 `domain/entities/` 擴充或新增型別；domain 不 import Firebase。
3. **更新 repository interface**：在 `domain/repositories/wiki-beta.repositories.ts` 定義新方法簽名。
4. **實作 use-case**：在 `application/use-cases/` 建立業務邏輯，repo 由外部注入。
5. **實作 infrastructure adapter**：在 `infrastructure/repositories/` 實作 Firebase 版本與 in-memory 版本。
6. **實作 UI**：在`interfaces/components/` 實作 React 元件，定義完整狀態（idle/loading/error/empty/populated）。
7. **加入 Server Action**（必要時）：在 `interfaces/_actions/` 建立 `"use server"` 入口。
8. **驗證**：
   - `npm run lint` — 0 errors
   - `npm run build` — 通過
   - Playwright MCP 走完 UI 流程

---

## 12. 常見錯誤（Anti-patterns）

| Anti-pattern | 正確做法 |
|---|---|
| use-case 內直接 `import { getFirestore }` | use-case 只依賴 repository interface；Firebase 在 infrastructure 層 |
| UI 文案使用「資料庫」或「Database」 | 一律使用「資料庫」（可接受中文）或 `Libraries`；不使用 `Database` |
| 循環偵測後直接 throw 沒有錯誤訊息 | 拋出包含 `CYCLE_DETECTED` 代碼與可讀訊息的錯誤 |
| Unit test 直接 new Firebase repo | 使用 `InMemoryWikiBetaPageRepository` 讓 test 不依賴網路 |

---

## 13. 驗收清單

- [ ] 命名對齊：UI 文案使用 Pages / Libraries，domain code 使用 `WikiBetaPage*` / `WikiBetaLibrary*`
- [ ] 無跨 `wiki-beta` ↔ `wiki` 邊界的 deep import
- [ ] 所有讀寫是 `accounts/{accountId}/...` 範圍
- [ ] 循環偵測 unit test 通過（包含正常移動與非法移動兩種情況）
- [ ] 必填欄位驗證 unit test 通過
- [ ] Use-case 測試可在 in-memory repository 下執行，不依賴 Firebase
- [ ] `npm run lint` 和 `npm run build` 通過
- [ ] 設計規格與使用手冊同步更新
