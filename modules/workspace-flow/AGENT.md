# AGENT.md — workspace-flow BC

## 模組定位

`workspace-flow` 是工作流程狀態機支援域，管理 Task/Issue/Invoice 三條業務線，並透過 ContentToWorkflowMaterializer 訂閱 knowledge 事件。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Task` | TodoItem、WorkItem |
| `TaskStatus` | Status（單獨使用）、State |
| `Issue` | Bug、Ticket、Problem |
| `IssueStatus` | Status（單獨使用） |
| `Invoice` | Bill、Receipt、Payment |
| `InvoiceStatus` | Status（單獨使用） |
| `MaterializedTask` | ConvertedTask、AutoTask |
| `sourceReference` | Origin、Source（作為物化來源） |
| `ContentToWorkflowMaterializer` | ContentProcessor、PageConverter |

## 狀態機（必須嚴格遵守）

```
TaskStatus:    draft → in_progress → qa → acceptance → accepted → archived
IssueStatus:   open → investigating → fixing → retest → resolved → closed
InvoiceStatus: draft → submitted → finance_review → approved → paid → closed
```

## 邊界規則

### ✅ 允許
```typescript
import { workspaceFlowApi } from "@/modules/workspace-flow/api";
import { WorkspaceFlowTab } from "@/modules/workspace-flow/api";
```

### ❌ 禁止
```typescript
import { Task } from "@/modules/workspace-flow/domain/entities/Task";
```

## 驗證命令

```bash
npm run lint
npm run build
```
