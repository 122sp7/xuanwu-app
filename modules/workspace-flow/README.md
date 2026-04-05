# workspace-flow — Workspace Flow & State Machine Layer

> **開發狀態**：🏗️ Midway — 開發部分完成
> **Domain Type**：Supporting Domain（支援域）

`modules/workspace-flow` 負責工作區內的**業務流程狀態機管理**，包含任務（Task）、問題（Issue）與發票（Invoice）三條業務線的狀態轉換、守衛規則與事件發布。對應 Notion 的 Database / Board 功能，是純邏輯模組，不負責產品 UI 組裝。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- UI 組裝由外部頁面或 `workspace` 模組負責
- 禁止直接 import `domain/`、`application/`、`infrastructure/`、`interfaces/`

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| Task 狀態機 | 管理 Task 從 `draft` 到 `accepted` 的完整生命週期 |
| Issue 狀態機 | 管理 Issue 從 `open` 到 `closed` 的問題處理流程 |
| Invoice 狀態機 | 管理 Invoice 從 `draft` 到 `paid/closed` 的財務流程 |
| 守衛規則 | 執行狀態轉換的業務守衛（task-guards、invoice-guards） |
| 流程物化 | 從知識內容物化生成 Task 清單（materialize-tasks-from-content） |
| 事件發布 | 狀態轉換後發布 TaskEvent、IssueEvent、InvoiceEvent |

---

## 聚合根（Aggregate Roots）

| Aggregate | 說明 |
|-----------|------|
| `Task` | 任務聚合根，含 status、assignee、workspaceId |
| `Issue` | 問題聚合根，含 status、severity、stage |
| `Invoice` | 發票聚合根，含 status、InvoiceItem 列表、金額 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 任務 | Task | 工作項目，有 7 個狀態的完整生命週期 |
| 任務狀態 | TaskStatus | `draft \| in_progress \| qa \| acceptance \| accepted \| archived` |
| 問題 | Issue | 異常或缺陷記錄，有 6 個狀態的處理流程 |
| 問題狀態 | IssueStatus | `open \| investigating \| fixing \| retest \| resolved \| closed` |
| 發票 | Invoice | 財務文件，有 6 個狀態的審批流程 |
| 發票狀態 | InvoiceStatus | `draft \| submitted \| finance_review \| approved \| paid \| closed` |
| 發票項目 | InvoiceItem | 發票中的明細項目 |
| 問題階段 | IssueStage | 問題處理的目前階段（細分於 IssueStatus） |
| 來源參考 | SourceReference | Task / Issue 來源的外部參考（知識頁面 ID 等） |
| 流程物化 | WorkflowMaterialization | 從知識內容自動生成 Task 的流程 |

---

## 狀態機（State Machines）

### TaskStatus
```
draft → in_progress → qa → acceptance → accepted
任何狀態 → archived（soft delete）
```

### IssueStatus
```
open → investigating → fixing → retest
retest → resolved（pass）
retest → fixing（fail）
resolved → closed
```

### InvoiceStatus
```
draft → submitted → finance_review → approved → paid → closed
approved → rejected（退回）
```

---

## 領域事件（Domain Events）

| 事件 | 觸發條件 |
|------|----------|
| `workspace-flow.task_created` | Task 建立時 |
| `workspace-flow.task_status_changed` | Task 狀態轉換時 |
| `workspace-flow.issue_opened` | Issue 開立時 |
| `workspace-flow.issue_resolved` | Issue 解決時 |
| `workspace-flow.invoice_approved` | Invoice 審批通過時 |
| `workspace-flow.invoice_paid` | Invoice 付款完成時 |

---

## 依賴關係

- **上游（依賴）**：`identity/api`（操作者身分）、`workspace/api`（工作區範圍）
- **下游（被依賴）**：`workspace/api`（Tasks tab）、`workspace-scheduling/api`（截止日期同步）

---

## 目錄結構

```
modules/workspace-flow/
├── api/                      # 公開 API 邊界
│   ├── contracts.ts          # 公開 DTO / 合約型別
│   ├── facade.ts             # WorkspaceFlowFacade
│   ├── index.ts              # barrel（含 WorkspaceFlowTab 等）
│   └── listeners.ts          # 事件監聽器
├── application/              # Use Cases & DTOs
│   ├── dto/                  # create-task、open-issue、invoice-query 等
│   ├── ports/                # TaskService、IssueService、InvoiceService
│   ├── process-managers/     # content-to-workflow-materializer.ts
│   └── use-cases/            # 完整的 CRUD + 狀態機轉換用例
├── domain/                   # Aggregates, Events, Repositories, Services
│   ├── entities/
│   │   ├── Task.ts
│   │   ├── Issue.ts
│   │   ├── Invoice.ts
│   │   └── InvoiceItem.ts
│   ├── events/
│   │   ├── TaskEvent.ts
│   │   ├── IssueEvent.ts
│   │   └── InvoiceEvent.ts
│   ├── repositories/
│   │   ├── TaskRepository.ts
│   │   ├── IssueRepository.ts
│   │   └── InvoiceRepository.ts
│   ├── services/             # 轉換守衛與政策
│   │   ├── task-guards.ts
│   │   ├── task-transition-policy.ts
│   │   ├── issue-transition-policy.ts
│   │   ├── invoice-guards.ts
│   │   └── invoice-transition-policy.ts
│   └── value-objects/
│       ├── TaskId.ts / TaskStatus.ts
│       ├── IssueId.ts / IssueStatus.ts / IssueStage.ts
│       ├── InvoiceId.ts / InvoiceItemId.ts / InvoiceStatus.ts
│       ├── SourceReference.ts
│       └── UserId.ts
├── interfaces/               # UI 元件、actions、queries
│   ├── _actions/
│   ├── components/           # WorkspaceFlowTab
│   ├── contracts/
│   └── queries/
└── index.ts
```

---

## 架構參考

- 系統設計文件：`docs/architecture/domain-model.md`
- 通用語言：`docs/architecture/ubiquitous-language.md`
