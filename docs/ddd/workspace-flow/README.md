# workspace-flow — 工作流程上下文

> **Domain Type:** Supporting Subdomain（支援域）
> **模組路徑:** `modules/workspace-flow/`
> **開發狀態:** 🏗️ Midway

## 定位

`workspace-flow` 管理工作區的**業務流程狀態機**：Task（任務）、Issue（問題追蹤）、Invoice（發票）三條業務線。它是 `knowledge.page_approved` 事件的主要消費者——透過 ContentToWorkflowMaterializer Process Manager 自動從審批頁面物化出 Task 和 Invoice。

## 職責

| 能力 | 說明 |
|------|------|
| Task 管理 | Task CRUD + 狀態機（draft → in_progress → qa → acceptance → accepted → archived） |
| Issue 管理 | Issue CRUD + 狀態機（open → investigating → fixing → retest → resolved → closed） |
| Invoice 管理 | Invoice CRUD + 狀態機（draft → submitted → finance_review → approved → paid → closed） |
| ContentToWorkflow 物化 | 監聽 `knowledge.page_approved`，自動建立 Task/Invoice |
| 守衛與政策 | 狀態轉換的業務守衛規則（guards / policies） |

## 核心聚合根

- **`Task`** — 任務聚合根
- **`Issue`** — 問題追蹤聚合根
- **`Invoice`** — 發票聚合根

## 詳細文件

| 文件 | 說明 |
|------|------|
| [ubiquitous-language.md](./ubiquitous-language.md) | 此 BC 通用語言 |
| [aggregates.md](./aggregates.md) | Task/Issue/Invoice 聚合根設計 |
| [domain-events.md](./domain-events.md) | 領域事件 |
| [context-map.md](./context-map.md) | 與其他 BC 的整合關係 |
