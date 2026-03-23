# Wiki-Beta UI/UX 設計規格

> **單一真實來源**：[docs/wiki-beta/wiki-beta-runtime-flow.mermaid](docs/wiki-beta/wiki-beta-runtime-flow.mermaid)
> 若畫面設計、流程描述或資料來源與 runtime-flow 不一致，以 runtime-flow 為準修正本文件。

---

## 1. 設計目標

| 代號 | 目標 | 出發點 |
|---|---|---|
| UX1 | 操作可見：使用者在任何時刻都知道系統正在做什麼 | The Design of Everyday Things — 回饋原則 |
| UX2 | 降低認知負擔：核心操作集中在一個頁面完成 | Don't Make Me Think — 最少點擊數 |
| UX3 | 錯誤可修復：出錯時顯示原因與建議行動 | The Design of Everyday Things — 錯誤處理 |
| UX4 | 資料不遺失的預設視角：預設顯示 account 全覽，不因工作區切換讓文件「消失」 | Lean UX — 用戶痛點驅動 |
| UX5 | 可近用性：所有互動可由鍵盤完整操作 | Designing Interfaces — 可近用性 |

### 1.1 現況校正（2026-03）

- 目前畫面以 Documents 為主操作頁，包含 Upload File 卡與 Documents 檢視卡。
- 側邊欄已移除 Workspace Context 下拉區塊。
- 本文件後續設計以目前畫面為基準，增量加入「Documents 右側 + 快捷建立」。

---

## 2. 資訊架構（IA）

Wiki-Beta 左側導覽：

```
Wiki-Beta
├── 知識總覽          ← 入口概覽
├── RAG Query         ← AI 問答
├── RAG Reindex       ← 手動重整
├── Documents     [+] ← 主操作頁（+ 快捷建立）
└── Workspaces        ← 摺疊工作區列表
```

**不在 UI 暴露**（背景能力）：

- Namespace：路由與 slug 背景機制，無獨立入口
- Workspace Context 下拉：已移除，改用 URL 參數篩選

---

## 3. 關鍵使用者任務

### 任務 A：上傳並確認入庫

**目標**：使用者知道文件已成功進入系統並開始處理。

1. 進入 Documents。
2. 拖曳或選擇檔案至 Drop Zone。
3. 點擊「上傳並啟動解析」。
4. ✅ **成功訊號**：文件出現在列表，`status` 顯示 `processing`，頁面無需重新整理。

**錯誤恢復**：若按鈕為灰色 → 確認已選擇檔案且帳號有效。

### 任務 B：跨工作區檢查文件

**目標**：使用者快速確認文件是否存在，不因工作區切換而困惑。

1. 進入 Documents（預設 account 全覽）。
2. 確認列表包含目標文件。
3. 若需縮小範圍，在 URL 加入 `?workspaceId=<id>` 篩選。

**設計原則**：預設全覽 = 使用者不需要先「猜」文件在哪個 workspace。

### 任務 C：RAG 問答驗證

**目標**：使用者得到 AI 回答並理解引用來源。

1. 進入 RAG Query。
2. 輸入 query，設定 top_k（預設即可）。
3. 點擊送出。
4. ✅ **成功訊號**：Answer 區顯示回答，Citations 列出引用片段與文件來源。

**錯誤恢復**：若無 Citations → 確認相關文件 `rag status` 為 `indexed`；若非，先執行手動重整。

### 任務 D：快速建立頁面 / 資料庫（Notion-like 入口）

1. 在側邊欄找到 Documents 項目。
2. 點擊 Documents 右側的 **`+`** 圖示（hover 才顯示）。
3. 選擇「新增頁面」或「新增資料庫」。
4. ✅ **成功訊號**：toast 通知 + 導向新建項目頁面。

**設計原則**：`+` 為次要操作，不遮蔽 Documents 主入口；選單可 Esc 關閉。

### 任務 E：任務門檻資料庫治理（planned）

使用「新增資料庫」建立任務治理資料庫，定義任務、依賴、技能與門檻欄位，透過規則進行任務分類與可執行性判斷。

---

## 4. 頁面規格

### 4.1 /wiki-beta（知識總覽）

**目的**：入口與能力總覽，讓使用者知道 Wiki-Beta 能做什麼。

| 區塊 | 內容 | 備註 |
|---|---|---|
| 頁首 | 標題 + 一句說明 | 「你的知識管理中心」 |
| 快捷入口 | Documents、RAG Query、RAG Reindex | 圖示 + 描述性文字 |
| Account Topology 摘要 | 文件數、ready 比例、workspace 數 | 讓使用者快速了解全貌 |

### 4.2 /wiki-beta/documents（主操作頁）

**目的**：上傳、列表、重整、狀態觀測，一頁完成。

#### 元件清單與狀態

| 元件 | 狀態 | 顯示內容 |
|---|---|---|
| Upload 卡 / Drop Zone | idle | 「點擊或拖曳上傳」+ 支援格式說明 |
| Upload 卡 / Drop Zone | drag-over | 高亮邊框 + 「放開以上傳」 |
| Upload 卡 / Drop Zone | uploading | 進度 spinner + 禁用其他操作 |
| Upload 卡 / Drop Zone | error | 紅色邊框 + 錯誤原因 + 「重試」按鈕 |
| 上傳按鈕 | idle（有檔案） | 可點擊，「上傳並啟動解析」 |
| 上傳按鈕 | disabled（無檔案或無帳號） | 灰色不可按，hover 顯示原因 tooltip |
| 上傳按鈕 | loading | spinner + 文字「上傳中...」 |
| Documents 列表 | loading | skeleton rows |
| Documents 列表 | empty | 「目前沒有文件，試著上傳第一份檔案」+ 指引箭頭指向 Upload 卡 |
| Documents 列表 | populated | 表格顯示（見欄位說明） |
| Documents 列表 | workspace-filtered | 標題欄顯示「workspace: {id}」篩選提示，`×` 可清除篩選（回到全覽） |
| 手動重整按鈕 | available | 可按，「手動重整」 |
| 手動重整按鈕 | disabled（無 json_gcs_uri） | 灰色 + tooltip「文件尚未完成解析」 |
| 手動重整按鈕 | loading | 該列 spinner，其他列不受影響 |

### 4.3 /wiki-beta/rag-query

**目的**：執行 RAG 問答並理解回答與引用。

| 元件 | 狀態 | 顯示內容 |
|---|---|---|
| 查詢輸入 | idle | placeholder「請輸入你的問題...」 |
| 查詢輸入 | error（空送出） | 紅色提示「請輸入問題後送出」 |
| 送出按鈕 | loading | spinner + 「查詢中...」 |
| Answer 卡 | 空（初始） | 不顯示，等待第一次查詢 |
| Answer 卡 | 有內容 | 回答文字 + chips（cache / scope / vector hits / search hits） |
| Citations 區 | 無引用 | 「目前查詢無相關引用，請確認文件已完成 RAG 索引」 |
| Citations 區 | 有引用 | 引用列表（provider、filename/doc_id、snippet） |

### 4.4 /wiki-beta/rag-reindex

**目的**：對指定文件手動觸發 RAG 重整。

| 元件 | 狀態 | 顯示內容 |
|---|---|---|
| 文件列表 | loading | skeleton rows |
| 文件列表 | empty | 「無可重整文件」 |
| 重整按鈕 | available | 「手動重整」 |
| 重整按鈕 | loading | spinner（單筆，不阻斷其他列） |
| 重整按鈕 | success | 短暫顯示「✓ 重整已觸發」+ 恢復可用 |

### 4.5 Documents 右側 `+`（快捷建立）

- **位置**：側邊欄 `Documents` 導航項右側，hover 才顯示 `+` 圖示。
- **互動**：點擊後開啟 popover 選單。
- **選單項目**：
  - 新增頁面
  - 新增資料庫
  - *(planned)* 新增任務資料庫
- **行為**：
  - 建立時帶入目前 account 範圍。
  - 若目前有 workspace 視角，帶入該 workspace；無則建立在 account 層。
  - 建立成功後：toast 通知 + 導向新建項目。
  - 建立失敗後：顯示錯誤 toast，不可靜默失敗。
- **可近用性**：
  - `+` 圖示有 `aria-label="快捷建立頁面或資料庫"`。
  - 選單可 Esc 關閉，支援 ↑↓ 選擇與 Enter 觸發。

---

## 5. 互動規則

| 互動 | 行為 |
|---|---|
| 拖曳檔案進入 Drop Zone | 高亮邊框 + 文字提示「放開以上傳」 |
| 拖曳檔案放開 | 立即做 MIME 驗證；格式不符則顯示紅色提示並重設 |
| 點擊「上傳並啟動解析」 | 按鈕進入 loading；完成後文件出現在列表，以 toast 確認 |
| 點擊「手動重整」 | 該列進入 loading，其他列保持互動；完成後以 toast 確認 |
| 點擊「送出查詢」（空輸入） | 不送出，提示「請輸入問題後送出」 |
| 點擊 Documents `+` | 顯示 popover 選單 |
| Esc（選單開啟中） | 關閉選單，焦點回到 `+` 按鈕 |

---

## 6. 線框圖（Wireframe）

### 6.1 Desktop：/wiki-beta/documents

```text
+-----------------------------------------------------------------------------------+
| App Rail | Secondary Nav (Wiki Beta) | Header: Wiki Beta · Documents             |
|          | - 知識總覽                 | [搜尋] [語言] [主題] [通知] [用戶]           |
|          | - RAG Query                +-------------------------------------------+
|          | - RAG Reindex              | Wiki Beta                                 |
|          | - Documents (active)   [+] | Documents                                 |
|          | - Workspaces (expand)      | account 全覽 / workspace: {id} ×          |
+---------------------------------------+-------------------------------------------+
| [← 返回 Wiki Beta]  [↺ 刷新文件]                                                  |
+-----------------------------------------------------------------------------------+
| 卡片：Upload File                                                                 |
| 說明：將檔案拖入或點擊選取。支援 .pdf .tiff .png .jpg/.jpeg                        |
|                                                                                   |
|   +-- Drop Zone (idle) --+    +-- Drop Zone (drag-over) --+                      |
|   | 點擊或拖曳上傳        |    |  ✦ 放開以上傳             |                      |
|   | .pdf .tiff .png .jpg  |    |  高亮邊框                 |                      |
|   +-----------------------+    +---------------------------+                      |
|                                                                                   |
|   [上傳並啟動解析 ↑]  [✕ 清除]                                                   |
+-----------------------------------------------------------------------------------+
| 卡片：Documents（帳號全覽）                                                       |
| account: {activeAccountId}  ·  文件數: N  ·  RAG ready: M  ·  error: E           |
|                                                                                   |
| filename        | status      | rag        | pages | uploadedAt | 操作           |
|-----------------|-------------|------------|-------|------------|----------------|
| report.pdf      | ✓ ready     | ✓ indexed  | 12    | 2026-03-20 | [手動重整]      |
| scan.tiff       | ⏳ processing| ⏳ pending  | —     | 2026-03-21 | [— 解析中 —]   |
| doc.pdf         | ✗ error     | —          | —     | 2026-03-22 | [重新上傳]      |
+-----------------------------------------------------------------------------------+

Documents 右側 [+] 展開後（Popover）：
+---------------------------+
| ＋ 新增頁面               |
| ＋ 新增資料庫             |
+---------------------------+
```

### 6.2 Mobile：/wiki-beta/documents

```text
+----------------------------------+
| Header: Wiki Beta · Documents    |
+----------------------------------+
| [← 返回]            [↺ 刷新]    |
+----------------------------------+
| Upload File                      |
| .pdf .tiff .png .jpg             |
| +------- Drop Zone --------+    |
| |    點擊或拖曳上傳          |    |
| +----------------------------+   |
| [上傳並啟動解析] [清除]          |
+----------------------------------+
| Documents (N 筆)                 |
|                                  |
| report.pdf                       |
|  ✓ ready · ✓ indexed · 12 頁    |
|  [手動重整]                      |
|                                  |
| scan.tiff                        |
|  ⏳ processing · ⏳ pending      |
|  [— 解析中 —]                   |
+----------------------------------+
```

### 6.3 Desktop：/wiki-beta/rag-query

```text
+-----------------------------------------------------------------------------------+
| Header: Wiki Beta · RAG Query                                                     |
+-----------------------------------------------------------------------------------+
| [← 返回 Wiki Beta]                                                                 |
+-----------------------------------------------------------------------------------+
| 卡片：RAG Query                                                                    |
| +----- 查詢輸入 ---------------------------------------------------------+         |
| |  請輸入你的問題...                                               ↵送出 |         |
| +-------------------------------------------------------------------------+        |
| top_k: [5 ▼]   [送出查詢]                                                          |
|                                                                                     |
| Answer                                                                              |
| ┌─────────────────────────────────────────────────────────────────────────┐        |
| │ AI 回答文字...                                                           │        |
| │                                                                         │        |
| │ [cache: hit]  [scope: account]  [vector: 5]  [search: 3]               │        |
| └─────────────────────────────────────────────────────────────────────────┘        |
|                                                                                     |
| Citations（3 筆）                                                                   |
| ┌──────────────────────────────────────────────────────────────────────────┐       |
| │ 1. report.pdf — 第 5 頁  [provider: openai]                              │       |
| │    "...引用片段文字..."                                                   │       |
| │ 2. ...                                                                   │       |
| └──────────────────────────────────────────────────────────────────────────┘       |
+-----------------------------------------------------------------------------------+
```

---

## 7. 視覺與文案規格

### 視覺層次

| 層次 | 代表元素 | 說明 |
|---|---|---|
| 第一層 | 頁面目的標題 | Documents / RAG Query（最大） |
| 第二層 | 可操作區 | Upload 卡、Query 輸入卡（次大、有邊框） |
| 第三層 | 結果區 | 列表、Answer、Citations（標準大小） |

### 文案原則

- **動作動詞一致**：上傳、刷新、手動重整、送出查詢
- **狀態文字顯性化**：`✓ ready`、`⏳ processing`、`✗ error`（不只用顏色，需有文字）
- **Scope 文案顯性化**：「account 全覽」vs「workspace: {id}」需在頁面中可見
- **錯誤訊息包含行動建議**：「格式不支援，請上傳 .pdf、.tiff、.png 或 .jpg」

---

## 8. 狀態與錯誤設計

### 全域錯誤 Toast 規則

| 情境 | Toast 類型 | 訊息格式 |
|---|---|---|
| 上傳失敗（格式不符） | error | 「格式不支援。支援 .pdf .tiff .png .jpg」 |
| 上傳失敗（網路/服務） | error | 「上傳失敗，請稍後重試或檢查網路連線」 |
| 手動重整成功 | success | 「已觸發重整，稍後觀察 rag status 更新」 |
| 手動重整失敗 | error | 「重整失敗：{錯誤原因}」 |
| 建立頁面 / 資料庫成功 | success | 「已建立 {名稱}」 |
| 建立頁面 / 資料庫失敗 | error | 「建立失敗：{錯誤原因}」 |

### 初始化保護

- 進入頁面時若 `accountId` 尚未就緒，顯示 loading skeleton，不可拋出「accountId required」類型的錯誤至 console。
- 所有 toast 錯誤均應可被 Playwright MCP 捕捉並驗證。

---

## 9. 可近用性 (Accessibility / A11y)

| 元件 | 要求 |
|---|---|
| Drop Zone | 可 Tab 聚焦；按 Enter/Space 觸發選檔；`aria-label` 描述功能 |
| 按鈕（上傳、重整、送出） | disabled 時有 `aria-disabled` 與 tooltip；不可只依賴顏色 |
| 狀態標籤（processing/ready/error） | 必須有文字，不可只用顏色圖示 |
| Documents `+` 選單 | Tab / Arrow 導航；Enter 觸發；Esc 關閉；焦點管理（開啟後焦點移入選單，關閉後回到 `+`） |
| 錯誤 Toast | 使用 `role="alert"` 確保螢幕閱讀器即時朗讀 |

---

## 10. 驗收要點

| 代號 | 驗收條件 |
|---|---|
| AC1 | Documents 頁可完成拖曳上傳，Drop Zone 在 drag-over 有明顯視覺反饋 |
| AC2 | 上傳後不需手動刷新，文件即時出現在列表 |
| AC3 | 預設為 account 全覽，不帶 workspaceId 也可見資料 |
| AC4 | 帶 workspaceId 後列表正確篩選，且頁面顯示篩選提示 |
| AC5 | RAG Query 流程可用，有 Answer 與 Citations 或明確的空狀態提示 |
| AC6 | RAG Reindex 可對單筆文件觸發，loading 狀態不阻斷其他列 |
| AC7 | Documents `+` 可開啟選單、建立頁面 / 資料庫，成功 / 失敗均有回饋 |
| AC8 | Console 無初始化錯誤；關鍵操作均有 toast 回饋 |
| AC9 | 所有互動可純鍵盤完成 |
