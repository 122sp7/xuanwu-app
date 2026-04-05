# Domain Events — knowledge-collaboration

> 事件採用 discriminated-union pattern，頂層欄位，無 payload wrapper。

---

## Comment 事件

### knowledge-collaboration.comment_created

```typescript
interface CommentCreatedEvent {
  type: "knowledge-collaboration.comment_created";
  commentId: string;
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  accountId: string;
  authorId: string;
  parentCommentId: string | null;
  occurredAtISO: string;
}
```

### knowledge-collaboration.comment_resolved

```typescript
interface CommentResolvedEvent {
  type: "knowledge-collaboration.comment_resolved";
  commentId: string;
  contentId: string;
  workspaceId: string;
  resolvedByUserId: string;
  occurredAtISO: string;
}
```

---

## Permission 事件

### knowledge-collaboration.permission_granted

```typescript
interface PermissionGrantedEvent {
  type: "knowledge-collaboration.permission_granted";
  permissionId: string;
  subjectId: string;
  subjectType: string;
  workspaceId: string;
  accountId: string;
  principalId: string;
  principalType: "user" | "team";
  level: "view" | "comment" | "edit" | "full";
  grantedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-collaboration.permission_revoked

```typescript
interface PermissionRevokedEvent {
  type: "knowledge-collaboration.permission_revoked";
  subjectId: string;
  workspaceId: string;
  principalId: string;
  revokedByUserId: string;
  occurredAtISO: string;
}
```

---

## Version 事件

### knowledge-collaboration.version_created

```typescript
interface VersionCreatedEvent {
  type: "knowledge-collaboration.version_created";
  versionId: string;
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  accountId: string;
  label: string | null;
  createdByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-collaboration.version_restored

```typescript
interface VersionRestoredEvent {
  type: "knowledge-collaboration.version_restored";
  versionId: string;
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  restoredByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-collaboration.page_locked

```typescript
interface PageLockedEvent {
  type: "knowledge-collaboration.page_locked";
  contentId: string;
  contentType: "page" | "article";
  workspaceId: string;
  lockedByUserId: string;
  lockExpiresAtISO: string;
  occurredAtISO: string;
}
```
