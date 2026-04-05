# Aggregates — workspace-feed

## 聚合根：WorkspaceFeedPost

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 貼文主鍵 |
| `workspaceId` | `string` | 所屬工作區 |
| `authorAccountId` | `string` | 作者帳戶 ID |
| `type` | `WorkspaceFeedPostType` | `post \| reply \| repost` |
| `content` | `string` | 貼文內容 |
| `replyToPostId` | `string \| null` | 回覆目標 |
| `repostOfPostId` | `string \| null` | 轉貼目標 |
| `likeCount` | `number` | 按讚數 |
| `viewCount` | `number` | 瀏覽數 |

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `WorkspaceFeedRepository` | `save()`, `findById()`, `listByWorkspace()` |
