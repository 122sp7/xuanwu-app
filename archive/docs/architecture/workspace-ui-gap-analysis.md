# Workspace UI Gap Analysis

<!-- change: Prioritize content→workspace-flow confirmation flow in Tasks Tab UI steps; PR-NUM -->

**Date:** 2026-03-26  
**Scope:** Features that have complete backend implementation but are not yet exposed in the workspace UI.

---

## 審計結果摘要

在工作區（`WorkspaceDetailScreen`）中，許多後端已完整實作的功能沒有對應的 UI 頁籤或介面。以下為詳細清單。

---

## 🔴 嚴重缺口：後端完整，UI 完全缺失

### workspace-flow — Tasks / Issues / Invoices

**位置：** `modules/workspace-flow/`

| 子功能 | 後端狀態 | UI 元件 | WorkspaceDetailScreen 頁籤 |
|--------|---------|---------|---------------------------|
| Tasks（任務） | ✅ 7 個 Use Case | ❌ 無 | ❌ 無（`Projects` 僅 🚧 placeholder） |
| Issues（議題） | ✅ 8 個 Use Case | ❌ 無 | ❌ 無 |
| Invoices（發票） | ✅ 8 個 Use Case | ❌ 無 | ❌ 無 |

**已完整實作的後端清單：**

Tasks（7 個）:
- `create-task.use-case.ts`
- `assign-task.use-case.ts`
- `submit-task-to-qa.use-case.ts`
- `pass-task-qa.use-case.ts`
- `approve-task-acceptance.use-case.ts`
- `archive-task.use-case.ts`
- `update-task.use-case.ts`

Issues（8 個）:
- `open-issue.use-case.ts`
- `start-issue.use-case.ts`
- `fix-issue.use-case.ts`
- `resolve-issue.use-case.ts`
- `close-issue.use-case.ts`
- `submit-issue-retest.use-case.ts`
- `pass-issue-retest.use-case.ts`
- `fail-issue-retest.use-case.ts`

Invoices（8 個）:
- `create-invoice.use-case.ts`
- `add-invoice-item.use-case.ts`
- `update-invoice-item.use-case.ts`
- `remove-invoice-item.use-case.ts`
- `submit-invoice.use-case.ts`
- `review-invoice.use-case.ts`
- `approve-invoice.use-case.ts`
- `pay-invoice.use-case.ts`

**Query Functions（已存在）：**
- `getWorkspaceFlowTasks`
- `getWorkspaceFlowTask`
- `getWorkspaceFlowIssues`
- `getWorkspaceFlowInvoices`
- `getWorkspaceFlowInvoiceItems`

**Domain 完整度：** ✅ Firebase repositories、state machine guards、value objects（TaskStatus、IssueStatus、InvoiceStatus）全部就位。

**UI 缺口：**
- `WorkspaceDetailScreen` 的 `renderTabContent` 中，`Projects` 案例走向 `renderWorkspacePlaceholderTab`
- `modules/workspace-flow/interfaces/components/` 目錄**不存在**
- `workspace-tabs.ts` 中沒有獨立的 Tasks / Issues / Invoices 頁籤

---

## 🟡 中度缺口：後端完整，UI 部分整合

### workspace-feed — Social Feed / Posts

**位置：** `modules/workspace-feed/`

| 子功能 | 後端狀態 | UI 元件 | WorkspaceDetailScreen 頁籤 |
|--------|---------|---------|---------------------------|
| Feed Posts（動態） | ✅ 9 個 Use Case | ✅ `WorkspaceFeedWorkspaceView` | ⚠️ 僅嵌入 Daily 頁籤，非獨立頁籤 |

**已實作的 Use Cases：**
- CreateWorkspaceFeedPostUseCase
- ReplyWorkspaceFeedPostUseCase
- RepostWorkspaceFeedPostUseCase
- LikeWorkspaceFeedPostUseCase
- BookmarkWorkspaceFeedPostUseCase
- ViewWorkspaceFeedPostUseCase
- ShareWorkspaceFeedPostUseCase
- GetWorkspaceFeedPostUseCase
- ListWorkspaceFeedUseCase
- ListAccountWorkspaceFeedUseCase

**狀態：** UI 元件存在但只在 `WorkspaceDailyTab` 內使用，沒有獨立的 Feed 頁籤。

---

## ✅ 已正確整合（無缺口）

| 功能 | 模組 | 頁籤 | 狀態 |
|------|------|------|------|
| 工作區概覽 | `workspace` | Overview | 🏗️（部分） |
| 成員管理 | `workspace` | Members | ✅ |
| 檔案管理 | `asset` | Files | ✅ |
| Wiki（Beta） | `content` + `workspace` | Wiki | 🏗️（部分） |
| 排程 | `workspace-scheduling` | Schedule | ✅ |
| 稽核日誌 | `workspace-audit` | Audit | ✅ |
| 每日動態 | `workspace-feed` | Daily | ✅ |

---

## 建議實作順序

### Phase 0 — content → workspace-flow 確認流程（最高優先，v1.1 新增）

依據 [ADR-001](./adr/ADR-001-content-to-workflow-boundary.md)，在實作 Tasks Tab 之前，須先確保 content 層有「審閱 → 批准 → 實體化」的 UI 入口。

1. 在 `content` 的 Wiki 頁面介面新增「核准此頁面（Approve Page）」按鈕
   - 位置：`modules/content/interfaces/components/ContentPageToolbar.tsx`（或 WikiPage 頭部操作列）
   - 呼叫：`approveContentPageAction(pageId, { extractedTasks, extractedInvoices, actorId })`
2. 實作 `approveContentPageAction` Server Action
   - 位置：`modules/content/interfaces/_actions/content.actions.ts`
   - 委派：`ApproveContentPageUseCase`
3. 實作 `ApproveContentPageUseCase`（觸發 `content.page_approved` 事件）
4. 實作 `contentToWorkflowMaterializer` Process Manager（或 Cloud Function Trigger）
5. Tasks Tab 顯示由 content 派生的任務（帶 sourceReference 標記）

### Phase 1 — Tasks 頁籤（後端完整，只差 UI）
工作流核心，後端 100% 完整，只差 UI。

1. 建立 `modules/workspace-flow/interfaces/components/WorkspaceTasksTab.tsx`
   - 展示任務列表，標記來源（若 `task.sourceReference` 存在，顯示「來自合約：{ContentPage title}」）
2. 建立 `modules/workspace-flow/interfaces/components/WorkspaceIssuesTab.tsx`
3. 在 `modules/workspace-flow/api/index.ts` 匯出上述元件
4. 在 `WorkspaceDetailScreen` 加入 `case "Projects":` 實際渲染
5. 更新 `workspace-tabs.ts`：Projects 改為 `🏗️`

### Phase 2 — Feed 獨立頁籤
1. 在 `workspace-tabs.ts` 新增 `Feed` 頁籤
2. 在 `WorkspaceDetailScreen` 加入 `case "Feed":` → `<WorkspaceFeedWorkspaceView />`

---

## 受影響的檔案

| 檔案 | 需要的變更 |
|------|---------|
| `modules/workspace-flow/interfaces/components/WorkspaceTasksTab.tsx` | **新建** |
| `modules/workspace-flow/interfaces/components/WorkspaceIssuesTab.tsx` | **新建** |
| `modules/workspace-flow/api/index.ts` | 匯出新元件 |
| `modules/workspace/interfaces/components/WorkspaceDetailScreen.tsx` | 新增 case "Projects" 實作 |
| `modules/workspace/interfaces/workspace-tabs.ts` | Projects: 🚧→🏗️；新增 Tasks/Issues/Invoices 定義 |
