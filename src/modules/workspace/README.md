# Workspace Module

`src/modules/workspace` 是蒸餾自 `modules/workspace` 的精簡等價版，以 `src/modules/template` 骨架為基線。
保留 4 個 **core** 子域：**lifecycle**（工作區容器建立/封存）、**membership**（成員角色）、**task**（任務生命週期）、**issue**（問題單追蹤）。orchestration、settlement、approve、quality 等為 secondary subdomains，可後補。

## 蒸餾來源

`modules/workspace`（13 個子域）→ `src/modules/workspace`（4 core 精簡骨架）

## 目錄結構

```
src/modules/workspace/
  index.ts                                    ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts
    entities/
      Workspace.ts                            ← aggregate root（協作容器）
      Membership.ts                           ← 工作區成員 + 角色
      Task.ts                                 ← aggregate root（任務）
      Issue.ts                                ← aggregate root（問題單）
    value-objects/
      WorkspaceId.ts
      MembershipId.ts
      TaskId.ts
      IssueId.ts
      WorkspaceStatus.ts                      ← "active" | "archived"
      MemberRole.ts                           ← "owner" | "editor" | "viewer"
      TaskStatus.ts                           ← "todo" | "in-progress" | "done"
      IssueStatus.ts                          ← "open" | "in-review" | "closed"
      ShareScope.ts                           ← "private" | "workspace" | "public"
    services/
      WorkspaceAccessService.ts               ← 工作區存取規則（domain service）
    repositories/
      WorkspaceRepository.ts                  ← domain port
      MembershipRepository.ts                 ← domain port
      TaskRepository.ts                       ← domain port
      IssueRepository.ts                      ← domain port
    events/
      WorkspaceCreated.ts
      WorkspaceArchived.ts
      MemberAdded.ts
      MemberRemoved.ts
      TaskCreated.ts
      TaskStatusChanged.ts
      IssueCreated.ts
      IssueStatusChanged.ts
  application/
    index.ts
    use-cases/
      create-workspace.use-case.ts
      archive-workspace.use-case.ts
      add-member.use-case.ts
      remove-member.use-case.ts
      create-task.use-case.ts
      update-task-status.use-case.ts
      create-issue.use-case.ts
      update-issue-status.use-case.ts
    dto/
      WorkspaceDTO.ts
      MembershipDTO.ts
      TaskDTO.ts
      IssueDTO.ts
  adapters/
    inbound/
      index.ts
      http/                                   ← workspace HTTP endpoints
      rpc/                                    ← tRPC routers
    outbound/
      index.ts
      firestore/
        FirestoreWorkspaceAdapter.ts
        FirestoreMembershipAdapter.ts
        FirestoreTaskAdapter.ts
        FirestoreIssueAdapter.ts
```

## Barrel 結構

| Barrel | 覆蓋範圍 |
|---|---|
| `index.ts` | domain + application 的公開符號 |
| `domain/index.ts` | entities, value-objects, services, repositories, events |
| `application/index.ts` | use-cases + dto |
| `adapters/inbound/index.ts` | http, rpc |
| `adapters/outbound/index.ts` | firestore/ |

所有 barrel 使用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾範圍

| src 概念 | 蒸餾自 modules/workspace | 狀態 |
|---|---|---|
| Workspace aggregate | subdomains/lifecycle + workspace-workflow（root aggregate） | ✅ 保留 |
| Membership entity | subdomains/workspace-workflow / membership | ✅ 保留 |
| Task aggregate | subdomains/task/domain/ | ✅ 保留 |
| Issue aggregate | subdomains/issue/domain/ | ✅ 保留 |
| ShareScope value-object | subdomains/workspace-workflow / sharing | ✅ 保留 |
| orchestration, task-formation | workspace-workflow 偏重 | ❌ 跳過（後補） |
| settlement, approve, quality | 財務/審批流程 | ❌ 跳過（後補） |
| feed, scheduling, audit | secondary subdomains | ❌ 跳過（後補） |

## Route Contract

Canonical Workspace URL：`/{accountId}/{workspaceId}`
（`/{accountId}/workspace/{workspaceId}` 為 legacy redirect，非新工作的 canonical contract）

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

`domain/` 絕對不依賴 Firestore SDK、React 或任何外部框架。

## 外部消費方式

```ts
// types
import type { WorkspaceDTO, TaskDTO, MemberRole } from "@/src/modules/workspace";

// server-only
import { createWorkspace, createTask } from "@/src/modules/workspace";
```

原始 API 合約參考：`modules/workspace/api/index.ts`。
