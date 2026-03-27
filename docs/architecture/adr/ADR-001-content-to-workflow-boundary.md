# ADR-001: 內容模組與工作流模組的邊界與事件驅動整合
*(Content to Workflow Boundary & Event-Driven Integration)*

## 決策背景
系統導入 AI 合約解析與攝入管線時，面臨「非結構化內容（如合約 PDF）」如何轉換為「強結構化業務實體（如 Task、Invoice）」的挑戰。若 AI 解析後直接寫入 `workspace-flow`，會因缺乏人工審閱機制而導致高風險的業務錯誤（例如：錯誤的發票金額、不合理的任務排程），且會丟失原始合約的上下文脈絡。

## 決策內容
1. **確立緩衝區機制 (Buffer Zone)**：AI 解析結果必須先落地於 `content` 模組，生成 `ContentPage` 與動態的 Database Blocks，作為「草稿與人工審閱視圖」。
2. **事件驅動的實體化 (Materialization via Events)**：使用者在 `content` 介面確認無誤並「核准（Approve）」後，由 `content` 模組派發領域事件（例如 `content.page_approved`）。
3. **單向依賴與溯源**：`workspace-flow` 模組（或負責協調的 Process Manager）監聽該事件，進而生成 `Task` 與 `Invoice`，且生成的業務實體必須透過 `sourceReference` 指回原始的 `ContentPage` ID 以保留上下文。
4. **動態視圖參照**：`content` 模組內的 Database 未來可擴充 `workflow-ref` 區塊，透過唯讀查詢（Read Model）嵌入並展示 `workspace-flow` 中的任務最新狀態，但不允許直接覆寫其狀態機。

## 取捨與影響
- **優點**：確保強結構業務（工作流/帳務）的絕對正確性；保留完整的人機協作（Human-in-the-loop）審閱流程；解耦 AI 攝入與核心業務邏輯。
- **缺點**：系統需實作事件總線（Event Bus）的非同步處理；前端需處理兩階段的 UI 流程（審閱 → 轉換）。

## 後續行動
- 擴充 `content` 模組領域事件，新增 `content.page_approved`。
- 在 `workspace-flow` 實作對應的事件監聽器或 Saga/Process Manager。
- 更新 `context-map.md` 確立這兩者的 Customer/Supplier 與 Event-driven 關係。
