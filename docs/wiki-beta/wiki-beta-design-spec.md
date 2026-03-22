# Wiki-Beta 設計規格

## 0. 文件一致性（單一真實來源）

- 本設計規格以 [docs/wiki-beta/wiki-beta-runtime-flow.mermaid](docs/wiki-beta/wiki-beta-runtime-flow.mermaid) 為單一真實來源。
- 所有章節（Runtime Boundary、Data Model、Pipeline）不得與 runtime-flow 圖相衝突。
- 若發現差異，先更新本規格與使用手冊，再補充實作計畫。

## 1. 文件資訊

- 系統：Wiki-Beta
- 路徑：/wiki-beta
- 版本：v1.0
- 目標：提供 account-scoped 文件上傳、列表、RAG 查詢與重整，能力對齊 /dev-tools 核心功能

## 2. 設計目標

- G1：以 account 為唯一資料主範圍
- G2：預設提供所有 workspace 文件全覽
- G3：可切換 workspace 篩選視角
- G4：具備 dev-tools 等級的操作能力與可觀測性
- G5：嚴守 Next.js 與 py_fn 邊界

## 3. Runtime Boundary

### Next.js 擁有

- 路由與頁面結構
- 上傳互動與狀態顯示
- documents 列表查詢與篩選
- callable 觸發入口

### py_fn 擁有

- Storage trigger ingestion
- parse/chunk/embed/reindex worker 執行
- rag_query 與 rag_reindex_document 執行細節

## 4. 功能規格

### F1 文件上傳

- 入口：/wiki-beta/documents
- 支援：拖曳或點擊上傳
- MIME：pdf/tiff/png/jpeg
- 上傳 API：Storage uploadBytes
- 上傳 metadata：
  - account_id: 必填
  - workspace_id: 選填

### F2 文件列表

- 預設顯示 account 全部 documents
- 若 URL 有 workspaceId，套用 workspace 篩選
- 顯示欄位：
  - filename
  - status
  - ragStatus
  - pageCount
  - uploadedAt

### F3 RAG 重整

- 對單一文件觸發 callable: rag_reindex_document
- 請求內容：account_id、doc_id、json_gcs_uri、source_gcs_uri、filename、page_count
- 成功後刷新 documents

### F4 RAG 查詢

- callable: rag_query
- 請求內容：account_id、query、top_k
- 回傳：answer、citations、cache、vector/search 命中數

### F5 錯誤處理與觀測

- UI 用 toast 顯示失敗訊息
- console 不得有初始化必填參數錯誤
- 需可在 Playwright MCP 中重現與驗證

### F6 Documents 右側 `+` 快捷建立（Notion-like，planned）

- 位置：側邊欄 Wiki-Beta `Documents` 項右側。
- 點擊行為：開啟選單，提供兩個建立入口：
  - 新增頁面
  - 新增資料庫
- 範圍規則：
  - 必須在 account scope 下建立。
  - 若存在 workspace 視角，建立流程可帶入 workspace 預設值。
- 成功回饋：
  - 顯示成功提示。
  - 導向新建項目或刷新對應列表。
- 失敗回饋：
  - 顯示錯誤提示，不可靜默失敗。

### F7 任務分類與門檻治理（planned）

- 當 account 下 documents / vectors 增長後，提供 page/database 作為分類與管理層。
- 任務模型需支援：
  - 任務本體（tasks）
  - 任務依賴（task_dependencies）
  - 技能定義（skills）
  - 任務技能門檻（task_skill_thresholds）
- 任務執行與指派需能檢查門檻是否達標（例如技能等級、必備技能集合）。

## 5. 資料模型規格

目前 canonical 主集合：

- accounts/{accountId}/documents/{documentId}

planned 管理層集合（依 runtime-flow）：

- accounts/{accountId}/pages/{pageId}
- accounts/{accountId}/databases/{databaseId}
- accounts/{accountId}/tasks/{taskId}
- accounts/{accountId}/task_dependencies/{dependencyId}
- accounts/{accountId}/skills/{skillId}
- accounts/{accountId}/task_skill_thresholds/{thresholdId}

核心欄位：

- status
- source.gcs_uri
- source.filename
- parsed.json_gcs_uri
- parsed.page_count
- rag.status
- rag.chunk_count
- rag.vector_count
- spaceId (選填)
- metadata.space_id (選填)

## 6. 導航規格

Wiki-Beta 側邊欄保留：

- 知識總覽
- RAG Query
- RAG Reindex
- Documents（含右側 `+` 快捷建立，planned）
- Workspaces 摺疊列表

移除：

- Workspace Context 下拉區塊
- Namespace 可見入口

## 7. 非功能性需求

- 安全性：account scope 必填
- 可維護性：page 薄協調、use-case 集中
- 一致性：與 /dev-tools 的操作模型一致
- 可測試性：Playwright 能完整驗證主要流程

## 8. 驗收標準

- A1：Documents 頁可完成拖曳上傳
- A2：上傳後文件出現在 account 全覽
- A3：workspaceId 篩選能正確生效
- A4：RAG Reindex 可成功觸發
- A5：RAG Query 可回應且含 citations
- A6：Documents 右側 `+` 可建立頁面/資料庫（planned 上線後驗收）
- A7：console 無 error
