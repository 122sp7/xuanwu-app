# Use Case Specifications

本文件描述「Notion × Wiki × NotebookLM」融合架構下的關鍵使用者案例。

---

## UC-01: 智能寫作與即時連結 (Writing with Auto-Linking)

### 簡述
當用戶在編輯器中寫作時，系統自動識別關鍵字並建議建立 Wiki 連結，或將內容轉為向量索引。

- **Actor**: Content Creator
- **Primary Module**: `modules/content`
- **Supporting Modules**: `modules/knowledge`, `modules/agent`

### Main Flow
1. 用戶在 `Page` 中輸入文字 (e.g., "關於 [[專案X]] 的進度...")。
2. `BlockEditor` 偵測到 `[[` 觸發符。
3. **[Knowledge]** 搜尋現有 `GraphNode` 並回傳建議列表。
4. 用戶選擇目標頁面，系統插入 `PageLink` Block。
5. 用戶完成一段文字並失焦 (OnBlur)。
6. **[System]** 發送 `ContentBlockUpdated` 事件。
7. **[Intelligence]** (Async) 接收事件，將該 Block 文字轉為 Vector 並存入 Upstash。

---

## UC-02: 上下文感知問答 (Context-Aware Chat / RAG)

### 簡述
用戶針對當前頁面或選定的知識範圍提問，AI 引用具體 Block 進行回答。

- **Actor**: Knowledge Worker
- **Primary Module**: `modules/agent`
- **Supporting Modules**: `modules/retrieval`, `modules/content`

### Main Flow
1. 用戶開啟右側 `Assistant Panel`。
2. 系統自動鎖定當前 `PageId` 作為 Context。
3. 用戶提問：「這份文件的核心結論是什麼？」
4. **[Intelligence]** 將問題轉為向量，並結合 `PageId` 過濾條件查詢 `VectorStore`。
5. **[Search]** 回傳 Top-K 相關的 `Block` 內容。
6. **[Intelligence]** 組裝 Prompt (包含原始 Block 內容) 發送給 LLM。
7. **[UI]** 串流顯示答案，並在答案中標註引用來源 (Citation)。
8. 用戶點擊引用來源，左側編輯器自動捲動到對應 Block。

---

## UC-03: 圖譜導航與關聯發現 (Graph Navigation)

### 簡述
用戶通過視覺化圖譜探索知識邊界，發現未直接連結但語義相關的內容。

- **Actor**: Researcher
- **Primary Module**: `modules/graph`
- **Supporting Modules**: `modules/knowledge`

### Main Flow
1. 用戶切換至 `Graph View`。
2. **[Knowledge]** 聚合所有 `Page` 與 `Link` 數據回傳。
3. **[Graph]** 渲染力導向圖 (Force-Directed Graph)。
4. 節點大小根據 `Backlinks` 數量動態調整。
5. 用戶點擊節點 A。
6. **[UI]** 開啟側邊預覽 (Preview Card)，顯示節點 A 的摘要與直接關聯。
7. **[System]** 高亮顯示與節點 A 有「潛在語義關聯」(由 AI 計算) 的節點 B、C。