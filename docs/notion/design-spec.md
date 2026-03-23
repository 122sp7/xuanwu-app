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

| 代號 | 目標 | 說明 |
|---|---|---|
| G1 | Notion 核心能力對齊 | 以 Page tree、Database、Relation 為對齊基準，讓使用者完成相同的知識管理工作流程 |
| G2 | Account scope 管理 | 所有 Notion 對齊能力都在 `accounts/{accountId}/...` 下管理；禁止 global fallback |
| G3 | Xuanwu 術語一致 | 不在 runtime code 暴露 `Notion` 標籤；UI 使用 Pages / Libraries |
| G4 | Runtime boundary 分離 | Next.js 擁有 UI 流程；py_fn 擁有 RAG pipeline |
| G5 | 獨立演進 | Pages 與 Libraries 可獨立演進，不相互耦合 |

---

## 2. Notion 能力對照表

| 能力 | Notion 術語 | Xuanwu UI 術語 | Xuanwu Domain 型別 | 狀態 |
|---|---|---|---|---|
| 階層頁面 | Page tree | **Pages** | `WikiBetaPage` | ✅ 實作中 |
| 頁面內容區塊 | Blocks | **Page Blocks** | `WikiBetaPageBlock`（planned） | 🔲 Phase 6+，低優先 |
| 結構化資料表 | Database / Data source | **Libraries** | `WikiBetaLibrary` | ✅ 實作中 |
| 資料表欄位 | Properties | **Fields** | `WikiBetaLibraryField` | ✅ 實作中 |
| 資料表列 | Pages in database | **Records** | `WikiBetaLibraryRow` | ✅ 實作中 |
| 跨資料引用 | Relation | **Relation** | `relation` field type | ✅ 型別定義 |
| 頁面中繼資料 | Page properties | **Page Metadata** | page metadata fields | 🔲 Phase 6+，低優先 |
| 變更訊號 | Webhooks / Events | **Sync Signals** | Domain Events | ✅ event module |

---

## 3. Runtime Boundary

### 3.1 Next.js 擁有

| 職責 | 位置 |
|---|---|
| 路由與頁面結構 | `app/(shell)/wiki-beta/pages`, `app/(shell)/wiki-beta/libraries` |
| Pages / Libraries UI 互動 | `modules/wiki-beta/interfaces/components/` |
| Application use-case 協調 | `modules/wiki-beta/application/` |
| Documents 快速建立入口（`+`，planned） | 側邊欄 Server Action |

### 3.2 py_fn 擁有

| 職責 | 說明 |
|---|---|
| Storage trigger ingestion | parse → clean → taxonomy → chunk → embed |
| `rag_query` callable | RAG 問答執行 |
| `rag_reindex_document` callable | 單文件重整執行 |

### 3.3 Firestore 邊界

- 所有集合必須在 `accounts/{accountId}/...` 路徑下。
- workspace 視角透過欄位篩選（`workspaceId`），不另開頂層集合。
- **強制規則**：不可直接查詢 `/pages`、`/databases` 等頂層路徑。

---

## 4. 功能規格

### F1 Pages（階層頁面）

**路由**：`/wiki-beta/pages`

| 操作 | Use-case | 業務規則 |
|---|---|---|
| 建立頁面 | `createWikiBetaPage` | title 必填（≤120 字元）；同 parent 下 slug 自動去重 |
| 更名頁面 | `renameWikiBetaPage` | 更新 title 與 slug；slug 去重規則同建立 |
| 移動頁面 | `moveWikiBetaPage` | 變更 `parentPageId`；**含循環偵測**：頁面不可成為自己的子孫 |
| 讀取樹狀結構 | `listWikiBetaPagesTree` | 遞迴排序，依 `order` + `title` |

**狀態**：`active`（顯示於樹）| `archived`（封存，不顯示於樹）

**存取模式**（Firestore 查詢設計）：
- 讀取 account 下所有 active 頁面：`where accountId == X AND status == "active"`
- 讀取特定 parent 下子頁面：`where parentPageId == Y AND accountId == X`

### F2 Libraries（結構化資料表）

**路由**：`/wiki-beta/libraries`

| 操作 | Use-case | 業務規則 |
|---|---|---|
| 建立 Library | `createWikiBetaLibrary` | name 必填（≤80 字元）；slug 自動去重 |
| 新增欄位 | `addWikiBetaLibraryField` | field key 自動 normalize（lowercase、underscore、英數）；同 library 內 key 不可重複 |
| 新增記錄 | `createWikiBetaLibraryRow` | 所有 `required: true` 欄位必須提供值 |
| 讀取 Library | `getWikiBetaLibrarySnapshot` | 回傳 library + fields + rows |

**欄位型別**：

| 型別 | 說明 | 典型用途 |
|---|---|---|
| `title` | 標題文字（必要主欄位） | 任務名稱、文件標題 |
| `text` | 多行文字 | 說明、備註 |
| `number` | 數字 | 優先級、評分 |
| `select` | 單選（可定義 options） | 狀態、類別 |
| `relation` | 跨記錄引用 | 關聯頁面或其他記錄 ID |

### F3 Documents `+` 快速建立（planned，Phase 5）

**入口**：側邊欄 Wiki-Beta 區塊中 `Documents` 項右側的 `+` 按鈕

**行為**：
- 點擊後開啟 popover 選單，提供「新增頁面」和「新增資料庫」兩個入口。
- 建立時帶入目前 account scope；若有 workspace 視角則優先帶入。
- 成功後顯示 toast 並導向新建項目。
- 失敗後顯示錯誤 toast，不可靜默失敗。

### F4 RAG 整合

Notion 對齊功能與 RAG pipeline 的整合點：

| 功能 | 描述 | 狀態 |
|---|---|---|
| Document to Page curation | 從已解析文件手動建立 Page，保留來源連結 | planned |
| Library 分類輔助 taxonomy filter | Libraries 作為知識分類層，`rag_query` 支援 `taxonomyFilters` | planned |

---

## 5. 資料模型規格

### 5.1 現有集合（Canonical）

```
accounts/{accountId}/documents/{documentId}
  status                    # processing | ready | error
  source.gcs_uri
  source.filename
  parsed.json_gcs_uri       # 解析完成後存在
  parsed.page_count
  rag.status                # pending | indexed | error
  rag.chunk_count
  rag.vector_count
  spaceId                   # 選填，workspace 視角欄位
  metadata.space_id         # 同 spaceId（保留相容）
```

### 5.2 Notion 對齊規劃集合（Planned）

> **優先順序**：
> - **Phase 5（近期高優先）**：Documents `+` 快速建立，需要 pages / databases 集合基本讀寫
> - **Phase 6+（遠期低優先）**：Page Blocks、Page Metadata，待 Pages / Libraries 穩定後排期

```
accounts/{accountId}/pages/{pageId}
  accountId
  workspaceId               # 選填
  title                     # ≤120 字元
  slug                      # 同 parent 下唯一
  parentPageId              # null = 根頁面
  order
  status                    # "active" | "archived"
  createdAt
  updatedAt

accounts/{accountId}/databases/{databaseId}
  accountId
  workspaceId               # 選填
  name                      # ≤80 字元
  slug                      # account 下唯一
  status                    # "active" | "archived"
  createdAt
  updatedAt

  fields/{fieldId}
    libraryId
    key                     # lowercase、underscore、英數
    label
    type                    # "title" | "text" | "number" | "select" | "relation"
    required
    options                 # select 型別用
    createdAt

  rows/{rowId}
    libraryId
    values                  # Record<fieldKey, unknown>
    createdAt
    updatedAt
```

> **注意**：Firestore 儲存路徑使用 `databases`（基礎設施識別）；UI 與 domain code 一律使用 `Libraries` / `WikiBetaLibrary*`。

---

## 6. Domain 事件規格

| 事件名稱 | aggregate type | 觸發條件 | payload 必填欄位 |
|---|---|---|---|
| `wiki_beta.page.created` | `wiki-page` | 頁面建立成功 | `accountId`, `workspaceId?`, `parentPageId`, `slug` |
| `wiki_beta.page.renamed` | `wiki-page` | 頁面更名成功 | `accountId`, `pageId`, `title`, `slug` |
| `wiki_beta.page.moved` | `wiki-page` | 頁面移動成功 | `accountId`, `pageId`, `fromParentPageId`, `toParentPageId` |
| `wiki_beta.library.created` | `wiki-library` | Library 建立成功 | `accountId`, `workspaceId?`, `libraryId`, `slug` |
| `wiki_beta.library.field_added` | `wiki-library` | 欄位新增成功 | `accountId`, `libraryId`, `fieldKey`, `fieldType` |
| `wiki_beta.library.row_created` | `wiki-library` | 記錄建立成功 | `accountId`, `libraryId`, `rowId`, `fields` |

**事件消費原則**：事件為 signal-first（最終一致）。消費者收到事件後自行 fetch 最新狀態，不依賴事件 payload 中的完整資料。

> **最終一致性注意事項**：消費者在收到事件後立即讀取 Firestore，偶有可能因寫入尚未傳播而讀到舊資料。建議在讀取失敗或資料不一致時實作 retry（例如：延遲 200ms 後重試一次）。若業務邏輯對一致性有嚴格需求，改用 Firestore `onSnapshot` 直接監聽文件變更。

---

## 7. 非功能性需求

| 類別 | 需求 |
|---|---|
| 安全性 | `accountId` 為必填；禁止 global fallback 查詢 |
| 可維護性 | page 薄協調，use-case 集中業務邏輯；domain code 不直接 import Firebase SDK |
| 可測試性 | use-case 可在 in-memory repository 下完整測試；不依賴 Firebase SDK |
| 隔離性 | `wiki-beta` ↔ `wiki` 模組 import boundary 嚴格隔離 |
| 一致性 | 命名對照表是唯一詞彙標準；不可在相同文件中混用 Notion 術語與 Xuanwu 術語 |
| 效能 | Pages 樹狀讀取 P95 < 1s（account 下 ≤1000 頁）；Library snapshot 讀取 P95 < 2s |

---

## 8. 路由與導覽規格

| 路徑 | 功能 | 狀態 |
|---|---|---|
| `/wiki-beta` | 知識總覽 | ✅ 現有 |
| `/wiki-beta/pages` | Pages 樹狀管理（建立、更名、移動） | ✅ 實作中 |
| `/wiki-beta/libraries` | Libraries 管理（建立、新增欄位、新增記錄） | ✅ 實作中 |
| `/wiki-beta/documents` | 文件上傳、列表、RAG 重整 | ✅ 現有 |
| `/wiki-beta/rag-query` | RAG 問答查詢 | ✅ 現有 |
| `/wiki-beta/rag-reindex` | 手動重整文件 | ✅ 現有 |

---

## 9. 驗收標準

| 代號 | 標準 | 測試方式 |
|---|---|---|
| A1 | `/wiki-beta/pages` 可建立根頁面與子頁面 | Playwright MCP |
| A2 | 頁面更名後 slug 自動更新且同層不重複 | Unit test + Playwright MCP |
| A3 | 移動頁面時循環偵測正確阻擋非法移動 | Unit test |
| A4 | `/wiki-beta/libraries` 可建立 Library 並新增欄位 | Playwright MCP |
| A5 | 建立 row 時必填欄位驗證正確，缺少必填欄位時顯示明確錯誤 | Unit test + Playwright MCP |
| A6 | Domain events 在每次操作後正確發布，payload 包含必填欄位 | Unit test |
| A7 | 所有操作是 account-scoped，無 global collection 存取 | Code review + lint rule |
| A8 | `npm run lint` 與 `npm run build` 通過，無 error | CI |
