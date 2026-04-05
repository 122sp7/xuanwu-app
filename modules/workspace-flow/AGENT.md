# AGENT.md — modules/workspace-flow

## 模組定位

`modules/workspace-flow` 是 Knowledge Platform 的**支援域（Supporting Domain）**，負責工作區內的任務（Task）、問題（Issue）與發票（Invoice）流程管理。對應 Notion 的 Database / Board 功能。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語與狀態：

### 任務狀態（TaskStatus）
```
draft → in_progress → qa → acceptance → accepted → archived
```

### 問題狀態（IssueStatus）
```
open → investigating → fixing → retest → resolved → closed
```

### 發票狀態（InvoiceStatus）
```
draft → submitted → finance_review → approved → paid → closed
```

## 邊界規則

### ✅ 允許

```typescript
import { WorkspaceFlowTab } from "@/modules/workspace-flow/api";
import type { TaskDTO, IssueDTO } from "@/modules/workspace-flow/api";
```

### ❌ 禁止

```typescript
import { Task } from "@/modules/workspace-flow/domain/...";
```

## WorkspaceFlowTab 整合規則

```typescript
// WorkspaceFlowTab 接受 optional currentUserId prop
// WorkspaceDetailScreen 傳入 accountId ?? "anonymous"
<WorkspaceFlowTab currentUserId={accountId ?? "anonymous"} />
```

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `workspace/api` | 被組合使用 | Tasks tab 在 WorkspaceDetailScreen 中 |
| `identity/api` | API 呼叫 | 驗證操作者身分 |

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
