# AGENT.md — modules/workspace-feed

## 模組定位

`modules/workspace-feed` 是 Knowledge Platform 的**支援域（Supporting Domain）**，負責工作區活動動態流的聚合與查詢。是工作區事件的讀模型（Read Model）。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `FeedItem`（不是 Activity、Event、Post）
- `WorkspaceFeed`（不是 Feed、Stream、Timeline）
- `ActivityType`（不是 Type、Category、EventType）

## 核心原則

**WorkspaceFeed 是讀模型（Read Model），不是寫模型。**

```typescript
// ✅ 正確：只有查詢操作
const feed = await workspaceFeedApi.queryFeed({ workspaceId, limit: 20 });

// ❌ 禁止：Feed 不直接接受業務命令
await workspaceFeedApi.createFeedItem(data);  // 應透過領域事件自動建立
```

## 邊界規則

### ✅ 允許

```typescript
import { workspaceFeedApi } from "@/modules/workspace-feed/api";
import type { FeedItemDTO } from "@/modules/workspace-feed/api";
```

### ❌ 禁止

```typescript
import { FeedItem } from "@/modules/workspace-feed/domain/...";
```

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `workspace/api` | 被組合使用 | Feed tab 展示 |
| `knowledge/api` | 事件訂閱 | 知識更新活動 |
| `identity/api` | API 呼叫 | 顯示活動操作者資訊 |

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
