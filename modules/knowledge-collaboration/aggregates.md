# Aggregates — knowledge-collaboration

---

## Comment（留言）— 聚合根

```typescript
interface Comment {
  id: string;
  contentId: string;                    // pageId or articleId (cross-BC reference)
  contentType: "page" | "article";      // which BC owns the content
  workspaceId: string;
  accountId: string;

  authorId: string;
  body: string;                         // Plain text or Markdown
  parentCommentId: string | null;       // null = root comment (thread start)

  resolvedAt: string | null;            // ISO — null = unresolved
  resolvedByUserId: string | null;

  createdAtISO: string;
  updatedAtISO: string;
}
```

### Comment 業務規則

- `parentCommentId` 只允許一層深度（回覆只在 root comment 下）。
- 刪除留言只清空 `body`（設為 `[deleted]`），不實際移除 ID。
- `resolvedAt` 設定後不可撤銷（由新留言繼續討論）。

---

## Permission（存取權限）— 聚合根

```typescript
type PermissionLevel = "view" | "comment" | "edit" | "full";
type PermissionSubjectType = "page" | "article" | "database";

interface Permission {
  id: string;
  subjectId: string;                    // contentId (pageId / articleId / databaseId)
  subjectType: PermissionSubjectType;
  workspaceId: string;
  accountId: string;

  principalId: string;                  // userId or teamId
  principalType: "user" | "team";
  level: PermissionLevel;               // view < comment < edit < full

  grantedByUserId: string;
  grantedAtISO: string;
  expiresAtISO: string | null;          // null = permanent
}
```

### Permission 業務規則

- 一個 (subjectId, principalId) 對只能有一個 Permission 記錄（upsert）。
- `full` 級別的使用者可以授予他人最多 `edit` 級別（不可超過自身）。
- 繼承：Workspace 級別的 Permission 可視為所有內容的隱式 Permission。

---

## Version（版本快照）— 聚合根

```typescript
interface Version {
  id: string;
  contentId: string;                    // pageId or articleId
  contentType: "page" | "article";
  workspaceId: string;
  accountId: string;

  snapshotBlocks: unknown[];            // JSON snapshot of all blocks at this point
  label: string | null;                 // Optional human-readable label ("v1.0", "Before redesign")
  description: string | null;

  createdByUserId: string;
  createdAtISO: string;
}
```

### Version 業務規則

- Version 建立後為 immutable（不可修改快照）。
- 最多保留 100 個版本，超出時 FIFO 刪除最舊版本。
- `label` 使版本成為「具名版本」（named version），系統不自動刪除。
