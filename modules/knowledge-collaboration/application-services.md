# Application Services — knowledge-collaboration

---

## Comment Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateCommentUseCase` | contentId, contentType, authorId, body, parentCommentId? | `CommandResult<CommentId>` | 建立留言或回覆 |
| `UpdateCommentUseCase` | commentId, body | `CommandResult` | 編輯留言內容 |
| `DeleteCommentUseCase` | commentId, deletedByUserId | `CommandResult` | 軟刪除（清空 body） |
| `ResolveCommentUseCase` | commentId, resolvedByUserId | `CommandResult` | 標記留言為已解決 |
| `ListCommentsUseCase` | contentId, contentType | `CommandResult<Comment[]>` | 取得內容的所有留言 |

## Permission Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `GrantPermissionUseCase` | subjectId, subjectType, principalId, principalType, level | `CommandResult` | 授予或更新存取權限 |
| `RevokePermissionUseCase` | subjectId, principalId | `CommandResult` | 移除存取權限 |
| `CheckPermissionUseCase` | subjectId, userId | `CommandResult<PermissionLevel>` | 查詢使用者對某內容的最高權限 |
| `ListPermissionsUseCase` | subjectId, subjectType | `CommandResult<Permission[]>` | 列出某內容的所有授權 |

## Version Use Cases

| Use Case | 輸入 | 輸出 | 說明 |
|---|---|---|---|
| `CreateVersionUseCase` | contentId, contentType, snapshotBlocks, label? | `CommandResult<VersionId>` | 建立版本快照 |
| `RestoreVersionUseCase` | versionId, restoredByUserId | `CommandResult` | 還原到特定版本（觸發 version_restored 事件） |
| `ListVersionsUseCase` | contentId, contentType | `CommandResult<Version[]>` | 列出版本歷史 |
| `LabelVersionUseCase` | versionId, label | `CommandResult` | 為版本設定具名標籤 |
