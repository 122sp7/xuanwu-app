# Workspace Module Agent Guide

## Purpose

`src/modules/workspace` 等價蒸餾 `modules/workspace` 的協作容器能力：
lifecycle（工作區建立/封存）、membership（成員角色）、task（任務生命週期）、issue（問題單追蹤）。

## Boundary Rules

- `domain/` 禁止依賴 Firestore SDK、React 或任何外部框架。
- `application/` 只依賴 `domain/` 的 repository + service 抽象。
- Firestore SDK 只能出現在 `adapters/outbound/firestore/`。
- 外部消費者只透過 `src/modules/workspace/index.ts`（具名匯出）存取。
- workspace 是 UI composition owner（notion、notebooklm panel 的組合者）；它傳 props，不讀他域 context。
- 所有 barrel 用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾規則

- 保留 lifecycle + membership + task + issue 4 個 core 子域概念。
- orchestration、settlement、approve、quality、feed、scheduling、audit 不進 src/modules/workspace（後補）。
- task-formation（AI 任務候選抽取）不在此模組，由 `modules/workspace` workspace-workflow + `src/modules/ai` 協作完成。
- Canonical workspace URL = `/{accountId}/{workspaceId}`；不用 `/{accountId}/workspace/{workspaceId}`。

## Route Here When

- 需要建立或封存工作區（`createWorkspace` / `archiveWorkspace`）。
- 需要新增或移除工作區成員、管理角色（`addMember` / `removeMember`）。
- 需要建立或更新任務（`createTask` / `updateTaskStatus`）。
- 需要建立或更新問題單（`createIssue` / `updateIssueStatus`）。
- 需要查詢 `ShareScope`、`MemberRole` 等協作規則。

## Route Elsewhere When

- 身份驗證、存取判定 → `src/modules/iam`。
- 帳號、組織 → `src/modules/platform`（workspace 消費 accountId，不擁有帳號邏輯）。
- 訂閱、配額 → `src/modules/billing`（workspace 消費 entitlement signal）。
- 正典知識內容 → `src/modules/notion`（workspace 引用，不擁有）。
- RAG 推理、synthesis → `src/modules/notebooklm`（workspace 引用，不擁有）。
- AI task 候選抽取 → `src/modules/ai`（workspace 消費 AI API）。

## Development Order

```
domain/entities/ + repositories/ → application/use-cases/ → adapters/outbound/ → adapters/inbound/ → 更新 barrel
```

## Delivery Style

- 優先實作 `createWorkspace` + `addMember`（其他功能依賴此 anchor）。
- `WorkspaceAccessService` 是 domain service，存取規則不要讓它漏入 application 或 UI。
- workspace 是 composition owner（next.js route 的 layout/slots 組合者），但 business logic 不屬於 route component。
- 奧卡姆剃刀：Task + Issue 的狀態機以 value-object enum 先實作，等複雜度增加再升級為 XState 狀態機。
- props-scoped 跨模組元件：传 `accountId`、`workspaceId`、`currentUserId`，不傳 context provider 引用。
