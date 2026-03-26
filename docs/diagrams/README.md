# Diagrams

此資料夾放系統圖與流程圖（Mermaid、PNG、SVG）。

## 目前主要 Mermaid 圖

- `xuanwu_architecture.mermaid`
	- 合併系統總覽、模組層次、多工作區結構
- `rag-enterprise-e2e.mermaid`
	- 合併 RAG ingestion、query、API/data flow、core logic、**feedback loop**（`ragQueryFeedback` Firestore 集合）
- `workspace-interaction-flow.mermaid`
	- 合併 workspace 階層、App Router slices、互動流程、主要 Firestore 路徑
- `erd-model.mermaid`
	- 合併 Workspace 內部資料模型與 RAG 資料模型
- `state-machine.mermaid`
	- 合併 Auth、文件處理、KB ingestion 狀態機
- `event-bus-message-flow.mermaid`
	- 事件匯流排與 outbox/dispatch 流程
- `security-rules-decision-flow.mermaid`
	- Firestore 權限決策流程
- `agent-architecture-commander-subagents.mermaid`
	- 指揮代理與子代理協作拓樸
- `domain-id-api-boundary-template.mermaid`
	- Domain-ID 領域模板：各領域自有邊界、跨領域僅透過 `api/` 交互
- `onboarding-flow.mermaid`
	- **新增**：新組織 / 使用者從註冊到第一次 RAG 查詢的 onboarding sequence diagram

## 建議內容

- 架構圖
- 流程圖
- 狀態機圖
- ERD

## 命名建議

- `domain-purpose.mermaid`
- `system-overview.png`

