# Notion 功能對齊 設計規格

> **文件版本**：v1.0.0
> **最後更新**：2026-03-23
> **系統**：Xuanwu Wiki-Beta — Notion 對齊能力
> **路徑**：`/wiki-beta`

---

## 0. 文件一致性（單一真實來源）

- 本設計規格以 [docs/wiki-beta/wiki-beta-runtime-flow.mermaid](../wiki-beta/wiki-beta-runtime-flow.mermaid) 為單一真實來源。
- Notion 能力命名以 [docs/wiki-beta/wiki-beta-naming-alignment.md](../wiki-beta/wiki-beta-naming-alignment.md) 為準。
- 若發現與 runtime-flow 圖不一致，先更新本規格，再補充實作計畫。

---

## 1. 設計目標

| 代號 | 目標 |
|---|---|
| G1 | 以 Notion 核心能力（Page tree、Database、Relation）為對齊基準 |
| G2 | 所有 Notion 對齊能力都在 account scope 下管理 |
| G3 | 命名保持 Xuanwu 術語一致，不在 runtime code 暴露 `Notion` 標籤 |
| G4 | Runtime boundary 保持 Next.js / py_fn 分離 |
| G5 | Pages 與 Libraries 可獨立演進，不相互耦合 |

---

## 2. Notion 能力對照表

| 能力 | Notion 術語 | Xuanwu UI 術語 | Xuanwu Domain 型別 | 狀態 |
|---|---|---|---|---|
| 階層頁面 | Page tree | Pages | `WikiBetaPage` | ✅ 實作中 |
| 頁面內容區塊 | Blocks | Page Blocks | `WikiBetaPageBlock`（planned） | 🔲 規劃中（Phase 6+，低優先） |
| 結構化資料表 | Database / Data source | Libraries | `WikiBetaLibrary` | ✅ 實作中 |
| 資料表欄位 | Properties | Fields | `WikiBetaLibraryField` | ✅ 實作中 |
| 資料表列 | Pages in database | Records | `WikiBetaLibraryRow` | ✅ 實作中 |
| 跨資料引用 | Relation | Relation | `relation` field type | ✅ 型別定義 |
| 頁面中繼資料 | Page properties | Page Metadata | page metadata fields | 🔲 規劃中（Phase 6+，低優先） |
| 變更訊號 | Webhooks / Events | Sync Signals | Domain Events | ✅ event module |

---

## 3. Runtime Boundary

### 3.1 Next.js 擁有

- 路由與頁面結構：`app/(shell)/wiki-beta/pages`, `app/(shell)/wiki-beta/libraries`
- Pages 與 Libraries 的 UI 互動流程
- Application use-case 協調
- Documents 快速建立入口（側邊欄 `+`，planned）

### 3.2 py_fn 擁有

- Storage trigger ingestion（parse → chunk → embed）
- `rag_query` callable 執行
- `rag_reindex_document` callable 執行

### 3.3 Firestore 邊界

- 所有集合必須在 `accounts/{accountId}/...` 路徑下。
- workspace 視角透過欄位篩選，不另開頂層集合。

---

## 4. 功能規格

### F1 Pages（階層頁面）

**路由**：`/wiki-beta/pages`

| 操作 | Use-case | 描述 |
|---|---|---|
| 建立頁面 | `createWikiBetaPage` | 建立根頁面或子頁面，slug 自動去重 |
| 更名頁面 | `renameWikiBetaPage` | 更新 title 與 slug |
| 移動頁面 | `moveWikiBetaPage` | 變更 parentPageId，含循環偵測 |
| 讀取樹狀結構 | `listWikiBetaPagesTree` | 遞迴排序，依 order + title |

**業務規則**：
- 頁面 title 最長 120 字元。
- 同一 parent 下 slug 不可重複。
- 移動操作禁止形成循環（頁面不可成為自己的子孫）。
- 狀態：`active` | `archived`（封存不顯示於樹）。

### F2 Libraries（結構化資料表）

**路由**：`/wiki-beta/libraries`

| 操作 | Use-case | 描述 |
|---|---|---|
| 建立 Library | `createWikiBetaLibrary` | 建立新資料表，slug 自動去重 |
| 新增欄位 | `addWikiBetaLibraryField` | 新增型別化欄位 |
| 新增記錄 | `createWikiBetaLibraryRow` | 建立新列，驗證必填欄位 |
| 讀取 Library | `getWikiBetaLibrarySnapshot` | 回傳 library + fields + rows |

**欄位型別**：

| 型別 | 說明 |
|---|---|
| `title` | 標題文字（必要主欄位） |
| `text` | 多行文字 |
| `number` | 數字 |
| `select` | 單選，可定義 options |
| `relation` | 跨紀錄引用 |

**業務規則**：
- Library name 最長 80 字元。
- 欄位 key 自動 normalize（lowercase、underscore、英數）。
- 同一 library 內 field key 不可重複。
- 建立 row 時，所有 `required: true` 欄位必須提供值。

### F3 Documents `+` 快速建立（planned）

**位置**：側邊欄 Wiki-Beta 區塊中 `Documents` 項右側的 `+` 按鈕

**行為**：
- 點擊後開啟選單，提供「新增頁面」和「新增資料庫」兩個入口。
- 建立時帶入目前 account scope；若有 workspace 視角則優先帶入。
- 成功後顯示 toast 並導向新建項目。
- 失敗後顯示錯誤提示，不可靜默失敗。

### F4 RAG 整合

Notion-aligned 功能與 RAG pipeline 的整合點：

- Pages 可透過手動流程與 documents 關聯（Document to Page curation，planned）。
- Libraries 可作為知識分類層，輔助 taxonomy filter。
- RAG Query 支援 `taxonomyFilters` 參數，可與 Library 分類對齊。

---

## 5. 資料模型規格

### 5.1 現有集合（Canonical）

```
accounts/{accountId}/documents/{documentId}
  status
  source.gcs_uri
  source.filename
  parsed.json_gcs_uri
  parsed.page_count
  rag.status
  rag.chunk_count
  rag.vector_count
  spaceId (選填)
  metadata.space_id (選填)
```

### 5.2 Notion 對齊規劃集合（Planned，尚未 canonical）

> **優先順序說明**：Documents `+` 快速建立（Phase 5）為近期高優先；Page Blocks 與 Page Metadata（Phase 6+）為遠期低優先，待 Pages/Libraries 穩定後再排期。

```
accounts/{accountId}/pages/{pageId}
  accountId
  workspaceId (選填)
  title
  slug
  parentPageId (null = root)
  order
  status: "active" | "archived"
  createdAt
  updatedAt

accounts/{accountId}/databases/{databaseId}
  accountId
  workspaceId (選填)
  name
  slug
  status: "active" | "archived"
  createdAt
  updatedAt

  fields/{fieldId}
    libraryId
    key
    label
    type: "title" | "text" | "number" | "select" | "relation"
    required
    options (select 型別)
    createdAt

  rows/{rowId}
    libraryId
    values: Record<string, unknown>
    createdAt
    updatedAt
```

---

## 6. Domain 事件規格

| 事件名稱 | aggregate type | 觸發條件 | payload 必填欄位 |
|---|---|---|---|
| `wiki_beta.page.created` | `wiki-page` | 頁面建立成功 | `accountId`, `workspaceId?`, `parentPageId`, `slug` |
| `wiki_beta.page.renamed` | `wiki-page` | 頁面更名成功 | `accountId`, `title`, `slug` |
| `wiki_beta.page.moved` | `wiki-page` | 頁面移動成功 | `accountId`, `fromParentPageId`, `toParentPageId` |
| `wiki_beta.library.created` | `wiki-library` | Library 建立成功 | `accountId`, `workspaceId?`, `slug` |
| `wiki_beta.library.field_added` | `wiki-library` | 欄位新增成功 | `accountId`, `fieldKey`, `fieldType` |
| `wiki_beta.library.row_created` | `wiki-library` | 記錄建立成功 | `accountId`, `rowId`, `fields` |

---

## 7. 非功能性需求

| 類別 | 需求 |
|---|---|
| 安全性 | account scope 為必填，禁止 global fallback |
| 可維護性 | page 薄協調，use-case 集中業務邏輯 |
| 可測試性 | use-case 可在 in-memory repository 下完整測試 |
| 隔離性 | `wiki-beta` ↔ `wiki` 模組 import boundary 嚴格隔離 |
| 一致性 | 命名對照表是唯一詞彙標準 |

---

## 8. 路由與導覽規格

| 路徑 | 功能 |
|---|---|
| `/wiki-beta` | 知識總覽 |
| `/wiki-beta/pages` | Pages 樹狀管理（建立、更名、移動）|
| `/wiki-beta/libraries` | Libraries 管理（建立、新增欄位、新增記錄）|
| `/wiki-beta/documents` | 文件上傳、列表、RAG 重整 |
| `/wiki-beta/rag-query` | RAG 問答查詢 |
| `/wiki-beta/rag-reindex` | 手動重整文件 |

---

## 9. 驗收標準

| 代號 | 標準 |
|---|---|
| A1 | `/wiki-beta/pages` 可建立根頁面與子頁面 |
| A2 | 頁面更名後 slug 自動更新且不重複 |
| A3 | 移動頁面時循環偵測正確阻擋非法移動 |
| A4 | `/wiki-beta/libraries` 可建立 Library 並新增欄位 |
| A5 | 建立 row 時必填欄位驗證正確 |
| A6 | Domain events 在每次操作後正確發布 |
| A7 | 所有操作是 account-scoped，無 global collection 存取 |
| A8 | `npm run lint` 與 `npm run build` 通過，無 error |
