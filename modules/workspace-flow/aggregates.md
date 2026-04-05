# Aggregates — workspace-flow

## 聚合根：Task

### 職責
可追蹤的工作單元，管理完整的任務生命週期狀態機。

### 生命週期狀態機
```
draft ──► in_progress ──► qa ──► acceptance ──► accepted ──► archived
```

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | Task 主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `title` | `string` | 任務標題 |
| `status` | `TaskStatus` | 當前狀態 |
| `assigneeId` | `string \| null` | 負責人帳戶 ID |
| `dueDate` | `string \| null` | 截止日期 ISO 8601 |
| `sourceReference` | `SourceReference \| null` | 物化來源（pageId, causationId） |
| `currentUserId` | `string` | 當前操作者 ID |

---

## 聚合根：Issue

### 生命週期狀態機
```
open ──► investigating ──► fixing ──► retest ──► resolved ──► closed
```

### 關鍵屬性

| 屬性 | 說明 |
|------|------|
| `id`, `workspaceId`, `title` | 基本屬性 |
| `status` | `IssueStatus` |
| `severity` | `IssueStatus` 嚴重程度 |
| `reporterId` | 報告者帳戶 ID |
| `assigneeId` | 負責人帳戶 ID（可選） |

---

## 聚合根：Invoice

### 生命週期狀態機
```
draft ──► submitted ──► finance_review ──► approved ──► paid ──► closed
```

### 關鍵屬性

| 屬性 | 說明 |
|------|------|
| `id`, `workspaceId` | 基本屬性 |
| `status` | `InvoiceStatus` |
| `amount` | `number` |
| `currency` | `string`（預設 "TWD"） |
| `sourceReference` | 物化來源（可選） |

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `TaskStatus` | `"draft" \| "in_progress" \| "qa" \| "acceptance" \| "accepted" \| "archived"` |
| `IssueStatus` | `"open" \| "investigating" \| "fixing" \| "retest" \| "resolved" \| "closed"` |
| `InvoiceStatus` | `"draft" \| "submitted" \| "finance_review" \| "approved" \| "paid" \| "closed"` |
| `SourceReference` | `{ pageId: string, causationId: string }` |

---

## Repository Interfaces

| 介面 | 說明 |
|------|------|
| `TaskRepository` | Task CRUD + 狀態查詢 |
| `IssueRepository` | Issue CRUD + 狀態查詢 |
| `InvoiceRepository` | Invoice CRUD + 狀態查詢 |

---

## Domain Services

| 服務 | 說明 |
|------|------|
| `ContentToWorkflowMaterializer` | Process Manager：訂閱 `knowledge.page_approved`，建立 MaterializedTask 和 Invoice |
