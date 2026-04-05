# AGENT.md — modules/workspace

## 模組定位

`modules/workspace` 是 Knowledge Platform 的**通用域（Generic Domain）**，負責工作區管理、成員協作與知識結構樹。是知識內容的協作容器，連接 identity、organization 與各知識域。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `Workspace`（不是 Space、Room、Project）
- `Member`（不是 User、Participant）
- `Role`（不是 Permission、Access）
- `WikiContentTree`（不是 Tree、PageTree、ContentTree）
- `WorkspaceTab`（不是 Tab、Section、Panel）

## 最重要邊界規則：循環依賴

```typescript
// ❌ 禁止：FirebaseWikiBetaWorkspaceRepository 不能 import workspace/api
import { workspaceApi } from "@/modules/workspace/api"; // 循環依賴！

// ✅ 正確：使用相對路徑直接 import
import { FirebaseWorkspaceRepository } from "../FirebaseWorkspaceRepository";
```

## WorkspaceDetailScreen 整合規則

```typescript
// WorkspaceDetailScreen 的 Tasks tab 使用 WorkspaceFlowTab
// WorkspaceFlowTab 接受 currentUserId prop
<WorkspaceFlowTab currentUserId={accountId ?? "anonymous"} />

// tabs 設定在 workspace-tabs.ts — "Tasks" 狀態為 🏗️ Midway
```

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `identity/api` | API 呼叫 | 驗證使用者身分 |
| `organization/api` | API 呼叫 | 驗證組織範圍 |
| `knowledge/api` | 提供範圍 | 知識頁面的工作區範圍 |
| `workspace-flow/api` | 組合使用 | Tasks tab（WorkspaceFlowTab） |
| `workspace-audit/api` | 組合使用 | Audit 查詢 |

## 導航規則

- `/dashboard` → 重定向到 `/workspace`
- `/settings` → 重定向到 `/workspace`
- MVP 導航以 workspace 為主

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
