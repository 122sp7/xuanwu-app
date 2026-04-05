# AGENT.md — workspace BC

## 模組定位

`workspace` 是協作容器有界上下文，負責工作區生命週期、成員管理與 Wiki 內容樹。在 WorkspaceDetailScreen 中組合多個 workspace-* 子模組的 UI tab。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Workspace` | Project、Space、Room |
| `WorkspaceMember` | Member、Participant |
| `WikiContentTree` | PageTree、ContentHierarchy |
| `workspaceId` | projectId、spaceId |
| `accountId` | ownerId（在 Workspace 上下文中） |

## 邊界規則

### ✅ 允許
```typescript
import { workspaceApi } from "@/modules/workspace/api";
import type { WorkspaceDTO } from "@/modules/workspace/api";
```

### ❌ 禁止
```typescript
// workspace/infrastructure 禁止 import workspace/api（循環依賴）
import { workspaceApi } from "@/modules/workspace/api"; // 在 infrastructure 層
```

## 循環依賴守衛

`FirebaseWikiBetaWorkspaceRepository` 使用相對路徑 import `FirebaseWorkspaceRepository`，絕對不能改為 `@/modules/workspace/api`。

## 驗證命令

```bash
npm run lint
npm run build
```
