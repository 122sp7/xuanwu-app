# AGENT.md — workspace-feed BC

## 通用語言

| 正確術語 | 禁止使用 |
|----------|----------|
| `WorkspaceFeedPost` | Post、Tweet、Message |
| `WorkspaceFeedPostType` | Type、PostType |
| `authorAccountId` | authorId、userId |

## 邊界規則

```typescript
// ✅
import { workspaceFeedApi } from "@/modules/workspace-feed/api";
// ❌
import { WorkspaceFeedPost } from "@/modules/workspace-feed/domain/entities/WorkspaceFeedPost";
```
