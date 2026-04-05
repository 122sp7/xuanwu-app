# AGENT.md ??workspace BC

## 璅∠?摰?

`workspace` ?臬?雿捆?冽???銝?嚗?鞎砍極雿???望????∠恣?? Wiki ?批捆璅嫘 WorkspaceDetailScreen 銝剔?????workspace-* 摮芋蝯? UI tab??

## ?隤?嚗biquitous Language嚗?

| 甇?Ⅱ銵? | 蝳迫雿輻 |
|----------|----------|
| `Workspace` | Project?pace?oom |
| `WorkspaceMember` | Member?articipant |
| `WikiContentTree` | PageTree?ontentHierarchy |
| `workspaceId` | projectId?paceId |
| `accountId` | ownerId嚗 Workspace 銝??葉嚗?|

## ??閬?

### ???迂
```typescript
import { workspaceApi } from "@/modules/workspace/api";
import type { WorkspaceDTO } from "@/modules/workspace/api";
```

### ??蝳迫
```typescript
// workspace/infrastructure 蝳迫 import workspace/api嚗儐?唬?鞈湛?
import { workspaceApi } from "@/modules/workspace/api"; // ??infrastructure 撅?
```

## 敺芰靘陷摰?

`FirebaseWikiWorkspaceRepository` 雿輻?詨?頝臬? import `FirebaseWorkspaceRepository`嚗?撠??賣??`@/modules/workspace/api`??

## 撽??賭誘

```bash
npm run lint
npm run build
```
