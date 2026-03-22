# Wiki-Beta UI/UX 設計稿

## 0. 文件一致性

- 本文件以 [docs/wiki-beta/wiki-beta-runtime-flow.mermaid](docs/wiki-beta/wiki-beta-runtime-flow.mermaid) 為單一真實來源。
- 若畫面設計、流程描述、資料來源與 runtime-flow 不一致，優先以 runtime-flow 修正本文件。

## 1. 設計目標

- 提供與 /dev-tools 對齊的核心操作能力：上傳、列表、重整、狀態觀測。
- 預設顯示 account 全部 workspace 文件，避免使用者誤以為資料遺失。
- workspace 只作為篩選視角，不改變 account 為主的資料邊界。
- 降低認知負擔：將操作集中在 /wiki-beta/documents，RAG 查詢集中在 /wiki-beta/rag-query。

## 2. 資訊架構（IA）

Wiki-Beta 左側導覽保留：

- 知識總覽
- RAG Query
- RAG Reindex
- Documents
- Workspaces（摺疊列表）

不在 UI 暴露：

- Namespace（背景能力）
- Workspace Context 下拉區塊（已移除）

## 3. 關鍵使用者任務

### 任務 A：上傳並確認入庫

1. 進入 Documents。
2. 拖曳或選擇檔案。
3. 點擊上傳並啟動解析。
4. 在文件列表觀察 status/rag status 更新。

### 任務 B：跨工作區檢查文件

1. 進入 Documents（預設 account 全覽）。
2. 先看全覽是否存在目標文件。
3. 需要時再加 workspaceId 篩選縮小範圍。

### 任務 C：RAG 問答驗證

1. 進入 RAG Query。
2. 輸入 query + top_k。
3. 檢查 answer、citations、cache、hits。

## 4. 頁面與區塊規格

### 4.1 /wiki-beta（知識總覽）

- 功能：入口與能力總覽。
- 區塊：
  - 頁首（標題、說明）
  - 快捷入口（RAG Query、RAG Reindex、Documents）
  - Account Topology 摘要

### 4.2 /wiki-beta/documents（主操作頁）

- 功能：上傳、列表、重整、狀態觀測。
- 區塊：
  - 頁首：標題 + 目前視角提示（全覽/特定 workspace）
  - 工具列：返回、刷新
  - Upload 卡：拖曳區 + 選檔 + 上傳按鈕
  - Documents 卡：列表、統計、重整按鈕

### 4.3 /wiki-beta/rag-query

- 功能：執行 rag_query 並檢視回答與引用。
- 區塊：
  - 查詢輸入
  - top_k 控制
  - 回答卡
  - citations 區

### 4.4 /wiki-beta/rag-reindex

- 功能：對文件執行手動重整。
- 區塊：
  - 文件列表
  - 單筆重整按鈕
  - 狀態回饋

## 5. 互動規則

- 拖曳上傳：
  - 進入拖曳時高亮 drop zone。
  - 放開後即做 MIME 驗證。
- 上傳按鈕：
  - 無檔案或無 active account 時 disabled。
  - 上傳中顯示 loading 狀態。
- 文件列表：
  - 預設 account 全覽。
  - URL 帶 workspaceId 才啟動 workspace 篩選。
- 重整按鈕：
  - 無 json_gcs_uri 時 disabled。
  - 執行中單筆 loading，不阻斷其他列檢視。

## 6. 文字版網頁圖（Wireframe）

### 6.1 Desktop：/wiki-beta/documents

```text
+-----------------------------------------------------------------------------------+
| App Rail | Secondary Nav (Wiki Beta) | Header: Wiki Beta · Documents             |
|          | - 知識總覽                 | [搜尋] [語言] [主題] [通知] [用戶]           |
|          | - RAG Query                +-------------------------------------------+
|          | - RAG Reindex              | Wiki Beta                                 |
|          | - Documents (active)       | Documents                                 |
|          | - Workspaces (expand)      | 檢視 account-scoped documents ...         |
+---------------------------------------+-------------------------------------------+
| [返回 Wiki Beta] [刷新文件]                                                      |
+-----------------------------------------------------------------------------------+
| Card: Upload File                                                                |
| 說明: 拖曳或選擇檔案上傳到 account scope（全部 workspace 可見）                   |
|                                                                                   |
|   +-------------------------------- Drop Zone --------------------------------+   |
|   |                        點擊或拖曳上傳                                     |   |
|   |            支援：.pdf .tif/.tiff .png .jpg/.jpeg                          |   |
|   +--------------------------------------------------------------------------+   |
|                                                                                   |
|   [上傳並啟動解析] [清除]                                                        |
+-----------------------------------------------------------------------------------+
| Card: Documents 檢視                                                             |
| account: {activeAccountId} / docs: N / RAG ready: M                              |
|                                                                                   |
| [filename] [status] [rag] [pages] [uploadedAt] [action: 手動重整/僅檢視]       |
| [filename] [status] [rag] [pages] [uploadedAt] [action: 手動重整/僅檢視]       |
+-----------------------------------------------------------------------------------+
```

### 6.2 Mobile：/wiki-beta/documents

```text
+----------------------------------+
| Header: Wiki Beta · Documents    |
+----------------------------------+
| Wiki Beta                        |
| Documents                        |
| 檢視 account-scoped documents... |
+----------------------------------+
| [返回] [刷新]                    |
+----------------------------------+
| Upload File                      |
| [ Drop Zone ]                    |
| [上傳並啟動解析] [清除]          |
+----------------------------------+
| Documents 檢視                   |
| account: ... / docs: ...         |
| - filename                       |
|   status / rag / pages / time    |
|   [手動重整]                     |
| - filename                       |
|   status / rag / pages / time    |
|   [手動重整]                     |
+----------------------------------+
```

### 6.3 Desktop：/wiki-beta/rag-query

```text
+-----------------------------------------------------------------------------------+
| Header: Wiki Beta · RAG Query                                                     |
+-----------------------------------------------------------------------------------+
| [返回 Wiki Beta]                                                                   |
+-----------------------------------------------------------------------------------+
| Card: RAG Query                                                                    |
| [Textarea: 請輸入問題]                                                             |
| [top_k] [送出查詢]                                                                  |
|                                                                                     |
| Answer                                                                              |
| - 回答文字                                                                          |
| - chips: cache / scope / vector hits / search hits                                 |
|                                                                                     |
| Citations                                                                           |
| - 引用 1 (provider, filename/doc_id, snippet)                                      |
| - 引用 2 (...)                                                                      |
+-----------------------------------------------------------------------------------+
```

## 7. 視覺與文案規格

- 視覺優先順序：
  - 第一層：頁面目的（Documents / RAG Query）
  - 第二層：可操作區（Upload、Query）
  - 第三層：結果區（列表、答案、引用）
- 文案原則：
  - 操作動詞一致（上傳、刷新、手動重整、送出查詢）
  - scope 文案顯性化（account 全覽 / workspace 篩選）

## 8. 狀態與錯誤設計

- Loading：
  - 按鈕與區塊內顯示 spinner。
- Empty：
  - 文件列表無資料時顯示清楚提示（目前沒有可用文件）。
- Error：
  - 上傳失敗、讀取失敗、重整失敗以 toast 呈現。
  - 避免初始化時丟出 accountId required 類型錯誤。

## 9. 可近用性（A11y）

- Drop zone、按鈕、輸入欄位需可鍵盤操作。
- icon 按鈕需有 aria-label。
- 狀態文字（processing/ready/error）不可只用顏色區分，需有文字標示。

## 10. 驗收要點

- Documents 頁可完成拖曳上傳與列表刷新。
- 預設為 account 全覽，不帶 workspaceId 也可見資料。
- 帶 workspaceId 後可正確篩選。
- RAG Query 與 RAG Reindex 流程可用。
- Console 無錯誤；關鍵操作有清楚回饋。
