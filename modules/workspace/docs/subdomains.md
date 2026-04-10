# Subdomains — workspace

本文件是 workspace 的正式子域 inventory。這份清單是 **closed by default** 的：後續開發必須先把能力映射到既有子域，而不是再新增新的子域名稱。

## Strategic Classification

`workspace` 是 **Generic Subdomain**，提供必要但非差異化的協作容器能力：

- 提供穩定的 `workspaceId` 範疇錨點給所有其他 bounded context 使用
- 管理工作區生命週期（`preparatory | active | stopped`）與可見性（`visible | hidden`）
- 非核心差異化能力，應維持簡單穩定的邊界

## Canonical Inventory

| 子域 | 核心問題 | 主要語言 |
|---|---|---|
| `audit` | 工作區操作稽核記錄如何被捕獲與查詢 | `AuditEntry`, `AuditAction`, `WorkspaceAuditView`, `AuditFilter` |
| `feed` | 工作區活動摘要如何被生成與推送 | `FeedItem`, `FeedEvent`, `ActivitySummary`, `FeedCursor` |
| `scheduling` | 工作區相關的排程與時間管理如何運作 | `Schedule`, `ScheduleSlot`, `RecurrenceRule`, `ScheduleEvent` |
| `workspace-workflow` | 工作區流程自動化如何被定義與觸發 | `Workflow`, `WorkflowStep`, `WorkflowTrigger`, `WorkflowRun` |

## Capability Groups

### 可觀察性

- `audit` — 稽核軌跡與操作記錄

### 活動與排程

- `feed` — 活動摘要與動態推送
- `scheduling` — 排程與時間管理

### 自動化

- `workspace-workflow` — 工作區流程自動化

## 子域 README

| 子域 | 文件 |
|---|---|
| `audit` | [subdomains/audit/README.md](../subdomains/audit/README.md) |
| `feed` | [subdomains/feed/README.md](../subdomains/feed/README.md) |
| `scheduling` | [subdomains/scheduling/README.md](../subdomains/scheduling/README.md) |
| `workspace-workflow` | [subdomains/workspace-workflow/README.md](../subdomains/workspace-workflow/README.md) |

> ⚠️ **Code Migration Required**
> - `subdomains/workflow/` → 已重命名為 `subdomains/workspace-workflow/` 以符合 `docs/contexts/workspace/subdomains.md` 規範，避免與 `platform.workflow` 名稱衝突。
>   受影響：`api/contracts.ts`、`api/facade.ts`、`api/ui.ts`（import 路徑 `../subdomains/workflow/api` → `../subdomains/workspace-workflow/api`）。

## Investment Posture

- 維持穩定邊界，避免引入核心業務邏輯
- 以 `workspaceId` 為中心的能力都應歸於此 context
- 不應包含組織治理（→ `platform`）或知識內容（→ `notion`）的邏輯
