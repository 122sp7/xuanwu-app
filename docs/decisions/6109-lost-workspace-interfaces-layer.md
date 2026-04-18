# 6109 Migration Gap — workspace interfaces 層


> ⚠️ **本文件為「僅記錄」文件 — 不執行實施**
> 此 ADR 的唯一目的是記錄遷移缺口，作為未來蒸餾工作的基線參考。
> **任何 agent 或開發者不得依據本文件直接新增、修改或刪除任何程式碼。**

- Status: ⛔ 僅記錄 — 不實施（Record Only — Do Not Implement）
- Date: 2026-04-17
- Category: Migration Gap > workspace

## Context

`xuanwu-app-skill` 快照的 `modules/workspace/` 包含約 60 個 interfaces 層文件（screens、tabs、dialogs、facades、hooks）。

對應的 `src/modules/workspace/` 只有 adapters（inbound/outbound Firebase），**interfaces 層完全缺失**，損失率 67%（8,750 → 2,869 lines）。

### 遺失的 Screens（interfaces/web/components/screens/）

```
WorkspaceDetailScreen.tsx      (47 lines) — 工作區詳情主畫面
WorkspaceHubScreen.tsx         (45 lines) — 工作區 Hub 總覽畫面
AccountDashboardScreen.tsx     (57 lines) — 帳號 Dashboard 總覽畫面
```

### 遺失的 Tabs（interfaces/web/components/tabs/）

```
WorkspaceFilesManagementTab.tsx    (81 lines) — 文件管理標籤頁（最複雜的 tab）
WorkspaceDetailTabContent.tsx      (44 lines) — 工作區詳情內容標籤
WorkspaceMemberInviteDialog.tsx    (31 lines) — 成員邀請對話框
TaskCandidateConfirmDialog.tsx     (31 lines) — Task Candidate 確認對話框
```

### 遺失的 Dialogs（interfaces/web/components/dialogs/）

```
CreateWorkspaceDialog.tsx          (25 lines) — 建立工作區對話框
WorkspaceSettingsDialog.tsx        (40 lines) — 工作區設定對話框
CustomizeNavigationDialog.tsx      (71 lines) — 導航客製化對話框（含拖拉排序）
```

### 遺失的 Facades（interfaces/web/facades/）

```
workspace-file.facade.ts           (114 lines) — 工作區文件操作 facade
  ← uploadFile(), deleteFile(), getFileUrl(), listFiles()
  ← 協調 FileAPI（platform）+ workspace domain use cases
  ← 是 interfaces 層與 platform Service API 的橋接點
```

### 遺失的 Hooks（interfaces/web/hooks/）

```
useWorkspaceDetail.ts              (21 lines) — 工作區詳情 TanStack Query hook
useWorkspaceHub.ts                 (19 lines) — 工作區列表 TanStack Query hook
useWorkspaceOrchestrationContext.ts (28 lines) — 工作區 Orchestration 上下文 hook
```

### 遺失的 Stores（interfaces/web/stores/）

```
workspace-navigation.store.ts      — 工作區導航狀態 Zustand store
workspace-selection.store.ts       — 已選工作區狀態 store
```

## Decision

**不實施**。僅記錄缺口。

`workspace-file.facade.ts`（114 lines）是最高優先順序，因為它是 workspace 與 platform FileAPI 的唯一橋接點，缺失後文件上傳功能無法正常工作。

## Consequences

- workspace 功能路由（`/workspace`）無任何可掛載的 Screen 元件。
- `WorkspaceFilesManagementTab`（81 lines）缺失導致文件管理 UI 無法顯示。
- `workspace-file.facade.ts` 缺失導致文件 upload/delete 操作無 facade 協調。

## 關聯 ADR

- **6108** platform API contracts：`workspace-file.facade.ts` 依賴 `FileAPI` 合約。
- **6119** workspace 新子域：activity、api-key 等新子域的 interfaces 層同樣需要補充。
