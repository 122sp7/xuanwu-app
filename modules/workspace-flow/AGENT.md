# AGENT.md — modules/workspace-flow

## 模組定位

`modules/workspace-flow` 是 Knowledge Platform 的**支援域（Supporting Domain）**，負責工作區業務流程狀態機——Task（任務）、Issue（問題）、Invoice（發票）三條業務線的狀態轉換與守衛規則。是純邏輯模組，不負責產品 UI 組裝。

---

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語，不可替換：

| 正確術語 | 禁止使用 |
|----------|----------|
| `Task` | Todo、WorkItem、Ticket |
| `TaskStatus` | TaskState、Status |
| `Issue` | Bug、Problem、Defect |
| `IssueStatus` | IssueState、BugStatus |
| `Invoice` | Bill、Receipt、Payment |
| `InvoiceStatus` | InvoiceState、PaymentStatus |
| `InvoiceItem` | LineItem、BillItem |
| `SourceReference` | Source、Origin、Reference |

### 狀態值（必須完全一致）

```typescript
// TaskStatus — 7 個值
type TaskStatus = "draft" | "in_progress" | "qa" | "acceptance" | "accepted" | "archived";

// IssueStatus — 6 個值
type IssueStatus = "open" | "investigating" | "fixing" | "retest" | "resolved" | "closed";

// InvoiceStatus — 6 個值
type InvoiceStatus = "draft" | "submitted" | "finance_review" | "approved" | "paid" | "closed";
```

---

## 邊界規則

### ✅ 允許

```typescript
// 其他模組透過 api/ 存取
import { WorkspaceFlowTab } from "@/modules/workspace-flow/api";
import type { TaskDTO, IssueDTO, InvoiceDTO } from "@/modules/workspace-flow/api";
import { workspaceFlowFacade } from "@/modules/workspace-flow/api";
```

### ❌ 禁止

```typescript
// 禁止直接 import 內部層
import { Task } from "@/modules/workspace-flow/domain/entities/Task";
import { CreateTaskUseCase } from "@/modules/workspace-flow/application/use-cases/create-task.use-case";
import { taskGuards } from "@/modules/workspace-flow/domain/services/task-guards";
```

---

## 依賴方向

```
interfaces/ → application/ → domain/ ← infrastructure/
```

- `domain/services/` 中的守衛（guards）和轉換政策（transition-policy）是純函數，禁止 import 外部模組
- `domain/` 禁止 import Firebase SDK、React、HTTP clients

---

## WorkspaceFlowTab 整合規則

```typescript
// WorkspaceFlowTab 接受 optional currentUserId prop
// WorkspaceDetailScreen 中的用法：
<WorkspaceFlowTab currentUserId={accountId ?? "anonymous"} />
```

- `WorkspaceFlowTab` 從 `api/index.ts` 匯出（✅ 已包含 UI 元件）
- `workspace` 模組在 `WorkspaceDetailScreen` 的 Tasks tab 組合使用

---

## 狀態轉換守衛規則

- 所有狀態轉換必須先通過 `domain/services/*-guards.ts` 守衛驗證
- 守衛違規時拋出帶有業務說明的 `Error`，不允許靜默失敗
- `task-transition-policy.ts` 和 `invoice-transition-policy.ts` 定義合法的轉換路徑

---

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `workspace/api` | 被組合使用 | Tasks tab 在 WorkspaceDetailScreen（`case "Tasks"`）中 |
| `identity/api` | API 呼叫 | 驗證操作者身分 |
| `workspace-scheduling/api` | 事件發布 | Task 狀態變更後同步截止日期 |

---

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
