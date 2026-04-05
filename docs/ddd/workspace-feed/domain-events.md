# Domain Events — workspace-feed

## 發出事件

| 事件 | 觸發條件 |
|------|---------|
| `WorkspaceFeedPostCreated` | 新貼文發布 |
| `WorkspaceFeedReplyCreated` | 回覆發布 |
| `WorkspaceFeedRepostCreated` | 轉貼發布 |
| `WorkspaceFeedPostLiked` | 按讚 |
| `WorkspaceFeedPostViewed` | 瀏覽 |
| `WorkspaceFeedPostBookmarked` | 收藏 |
| `WorkspaceFeedPostShared` | 分享 |

所有事件繼承 `WorkspaceFeedBaseEvent`（`accountId`, `workspaceId`, `postId`, `actorAccountId`, `occurredAtISO`）。

## 訂閱事件

`workspace-feed` 不訂閱其他 BC 的事件。
