# Wiki-Beta 設計規格

> **單一真實來源**：[docs/wiki-beta/wiki-beta-runtime-flow.mermaid](docs/wiki-beta/wiki-beta-runtime-flow.mermaid)
> 所有章節（Runtime Boundary、Data Model、Pipeline）不得與 runtime-flow 圖相衝突。若發現差異，先更新本規格與使用手冊，再補充實作計畫。

---

## 1. 文件資訊

| 項目 | 值 |
|---|---|
| 系統 | Wiki-Beta |
| 路徑 | `/wiki-beta` |
| 版本 | v1.0 |
| 目標 | 提供 account-scoped 文件上傳、列表、RAG 查詢與重整；能力對齊 /dev-tools 核心功能 |

---

## 2. 設計目標

| 代號 | 目標 | 說明 |
|---|---|---|
| G1 | account 唯一資料主範圍 | 所有讀寫強制在 `accounts/{accountId}/...` 路徑下；禁止 global fallback |
| G2 | 預設全覽 | 列表預設顯示帳號下所有 workspace 文件；使用者不需先「猜」文件在哪個 workspace |
| G3 | workspace 只作篩選視角 | workspace 是 account 下的分組標籤，不另開資料邊界 |
| G4 | dev-tools 等級可觀測性 | 每份文件的 parse/rag pipeline 狀態均可在 UI 觀測 |
| G5 | 嚴守 runtime boundary | Next.js 不執行 parse/embed；py_fn 不持有 session 或 UI 狀態 |

---

## 3. Runtime Boundary

### Next.js 擁有

| 職責 | 說明 |
|---|---|
| 路由與頁面結構 | `app/(shell)/wiki-beta/` |
| 上傳互動 | 前端 MIME 驗證、uploadBytes、customMetadata 寫入 |
| 文件列表 | account-scoped Firestore 查詢與 workspace 篩選 |
| callable 觸發入口 | `rag_query`、`rag_reindex_document` 的發起點 |

### py_fn 擁有

| 職責 | 說明 |
|---|---|
| Storage trigger ingestion | 解析 → 清洗 → 分類 → 切塊 → 嵌入 |
| rag_reindex_document | 單文件重整 callable |
| rag_query | RAG 問答 callable |

**禁止跨越**：

- Next.js 不執行 parse/chunk/embed（計算在 py_fn）
- py_fn 不擁有任何 UI 渲染或 session 邏輯

---

## 4. 功能規格

### F1 文件上傳

| 項目 | 規格 |
|---|---|
| 入口 | `/wiki-beta/documents` |
| 操作方式 | 拖曳或點擊上傳 |
| 支援格式 | `application/pdf`、`image/tiff`、`image/png`、`image/jpeg` |
| 上傳 API | Firebase Storage `uploadBytes` |
| 必填 metadata | `account_id` |
| 選填 metadata | `workspace_id`（帶入 workspace 視角時） |
| 上傳後 | 文件即時出現在列表，`status: processing` |

### F2 文件列表

| 項目 | 規格 |
|---|---|
| 資料來源 | `accounts/{accountId}/documents` |
| 預設視角 | account 全覽（無 workspace 篩選） |
| workspace 篩選 | URL 帶 `workspaceId` 參數時啟動 |
| 顯示欄位 | `filename`、`status`、`ragStatus`、`pageCount`、`uploadedAt` |
| 讀取模式 | Firestore `onSnapshot` 或單次查詢（視 UX 需求決定） |
| 預期讀取量 | 單帳號 P95 < 500 份文件；超過時需分頁或 cursor-based pagination |

### F3 RAG 重整

| 項目 | 規格 |
|---|---|
| 觸發方式 | callable `rag_reindex_document` |
| 必填參數 | `account_id`、`doc_id`、`json_gcs_uri`、`source_gcs_uri`、`filename`、`page_count` |
| 前提條件 | 文件 `status: ready`（有 `json_gcs_uri`）才可觸發 |
| 成功後行為 | 刷新 documents 列表，`rag_status` 更新 |
| 錯誤後行為 | toast 顯示錯誤訊息，按鈕恢復可用 |

### F4 RAG 查詢

| 項目 | 規格 |
|---|---|
| 觸發方式 | callable `rag_query` |
| 必填參數 | `account_id`、`query`、`top_k` |
| 回傳欄位 | `answer`、`citations`（provider、doc_id/filename、snippet）、`cache`、`vector_hits`、`search_hits` |
| top_k 建議範圍 | 3–10；預設 5 |

### F5 錯誤處理與可觀測性

- UI 用 toast 顯示失敗訊息（格式：「操作失敗：{原因}」）
- Console 不得有初始化必填參數錯誤（`accountId required` 類型）
- 所有關鍵操作（上傳、重整、查詢）需可在 Playwright MCP 中重現與驗證

### F6 Documents 右側 `+` 快捷建立（planned）

- 位置：側邊欄 Wiki-Beta `Documents` 項右側。
- 點擊：開啟 popover 選單，提供「新增頁面」與「新增資料庫」兩個入口。
- 範圍規則：必須在 account scope 下建立；若存在 workspace 視角，帶入 workspace 預設值。
- 成功回饋：toast + 導向新建項目。
- 失敗回饋：toast 顯示錯誤，不可靜默失敗。

### F7 任務分類與門檻治理（planned）

當帳號下 documents / vectors 增長後，提供 page/database 作為分類與管理層。任務模型需支援：`tasks`、`task_dependencies`、`skills`、`task_skill_thresholds`。

---

## 5. 資料模型規格

### 5.1 現有 Canonical 集合

```
accounts/{accountId}/documents/{documentId}
```

| 欄位 | 型別 | 說明 |
|---|---|---|
| `status` | `string` | `processing` / `ready` / `error` |
| `source.gcs_uri` | `string` | Storage 原始路徑 |
| `source.filename` | `string` | 原始檔名 |
| `parsed.json_gcs_uri` | `string?` | Document AI JSON 輸出路徑（解析完成後存在） |
| `parsed.page_count` | `number?` | 解析頁數 |
| `rag.status` | `string` | `pending` / `indexed` / `error` |
| `rag.chunk_count` | `number?` | 切塊數量 |
| `rag.vector_count` | `number?` | 向量數量 |
| `spaceId` | `string?` | 選填，workspace 視角欄位 |
| `metadata.space_id` | `string?` | 同 spaceId（migration 保留相容） |

**存取模式**（對應查詢索引設計）：
1. **全覽讀取**：`where accountId == X, orderBy uploadedAt DESC`
2. **workspace 篩選**：`where accountId == X AND spaceId == Y, orderBy uploadedAt DESC`
3. **單文件讀取**：`doc(accounts/X/documents/Y)`

### 5.2 Planned 管理層集合

優先順序：Documents `+` 快捷建立（Phase 5）為近期高優先；Tasks/Skills 治理（Phase 7+）待排期。

```
accounts/{accountId}/pages/{pageId}
accounts/{accountId}/databases/{databaseId}
accounts/{accountId}/tasks/{taskId}
accounts/{accountId}/task_dependencies/{dependencyId}
accounts/{accountId}/skills/{skillId}
accounts/{accountId}/task_skill_thresholds/{thresholdId}
```

---

## 6. 導航規格

| 側邊欄項目 | 路由 | 狀態 |
|---|---|---|
| 知識總覽 | `/wiki-beta` | ✅ 現有 |
| RAG Query | `/wiki-beta/rag-query` | ✅ 現有 |
| RAG Reindex | `/wiki-beta/rag-reindex` | ✅ 現有 |
| Documents（含 `+`） | `/wiki-beta/documents` | ✅ 現有（`+` planned） |
| Workspaces（摺疊） | — | ✅ 現有 |
| Namespace 入口 | — | ❌ 不暴露（背景能力） |
| Workspace Context 下拉 | — | ❌ 已移除 |

---

## 7. 非功能性需求

| 類別 | 需求 |
|---|---|
| 安全性 | `account_id` 為必填；所有 Firestore 讀寫強制在 `accounts/{accountId}/...` 路徑下 |
| 可觀測性 | 每份文件的 `status` 與 `rag.status` 可在列表中即時觀測 |
| 可維護性 | page 薄協調，業務邏輯集中在 use-case；不在 page 內放 Firebase 呼叫 |
| 一致性 | 與 /dev-tools 的操作模型一致（upload、list、reindex、query） |
| 可測試性 | Playwright 能完整驗證主要流程（upload → list → reindex → query） |
| 效能 | Documents 列表初始載入 P95 < 2s；重整觸發回應 P95 < 3s |

---

## 8. 驗收標準

| 代號 | 標準 | 測試方式 |
|---|---|---|
| A1 | Documents 頁可完成拖曳上傳 | Playwright MCP |
| A2 | 上傳後文件出現在 account 全覽 | Playwright MCP |
| A3 | `workspaceId` 篩選正確生效，且頁面顯示篩選提示 | Playwright MCP |
| A4 | RAG Reindex 可成功觸發，`rag.status` 更新 | Playwright MCP |
| A5 | RAG Query 可回應且含 `citations` 欄位（或顯示空狀態提示） | Playwright MCP |
| A6 | Documents 右側 `+` 可建立頁面/資料庫（planned 上線後驗收） | Playwright MCP |
| A7 | Console 無 `accountId required` 類型 error | 人工 + Playwright |
