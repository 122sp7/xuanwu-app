# Aggregates ??workspace-feed

## ???對?WorkspaceFeedPost

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | 鞎潭?銝駁 |
| `workspaceId` | `string` | ?撅砍極雿? |
| `authorAccountId` | `string` | 雿董??ID |
| `type` | `WorkspaceFeedPostType` | `post \| reply \| repost` |
| `content` | `string` | 鞎潭??批捆 |
| `replyToPostId` | `string \| null` | ???格? |
| `repostOfPostId` | `string \| null` | 頧票?格? |
| `likeCount` | `number` | ????|
| `viewCount` | `number` | ?汗??|

## Repository Interfaces

| 隞 | 銝餉??寞? |
|------|---------|
| `WorkspaceFeedRepository` | `save()`, `findById()`, `listByWorkspace()` |
