# Domain Events — knowledge-base

> 所有事件採用 discriminated-union pattern：`type: "knowledge-base.<event>"` 頂層欄位，`occurredAtISO: string`，無 `payload` wrapper。

---

## Article 事件

### knowledge-base.article_created

```typescript
interface ArticleCreatedEvent {
  type: "knowledge-base.article_created";
  articleId: string;
  workspaceId: string;
  accountId: string;
  title: string;
  categoryId: string | null;
  createdByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-base.article_updated

```typescript
interface ArticleUpdatedEvent {
  type: "knowledge-base.article_updated";
  articleId: string;
  workspaceId: string;
  accountId: string;
  changedFields: string[];              // e.g. ["title", "content", "tags"]
  updatedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-base.article_published

```typescript
interface ArticlePublishedEvent {
  type: "knowledge-base.article_published";
  articleId: string;
  workspaceId: string;
  accountId: string;
  publishedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-base.article_archived

```typescript
interface ArticleArchivedEvent {
  type: "knowledge-base.article_archived";
  articleId: string;
  workspaceId: string;
  accountId: string;
  archivedByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-base.article_verified

```typescript
interface ArticleVerifiedEvent {
  type: "knowledge-base.article_verified";
  articleId: string;
  workspaceId: string;
  accountId: string;
  verifiedByUserId: string;
  verificationExpiresAtISO: string | null;
  occurredAtISO: string;
}
```

### knowledge-base.article_review_requested

```typescript
interface ArticleReviewRequestedEvent {
  type: "knowledge-base.article_review_requested";
  articleId: string;
  workspaceId: string;
  accountId: string;
  requestedByUserId: string;
  ownerId: string | null;
  occurredAtISO: string;
}
```

### knowledge-base.article_owner_assigned

```typescript
interface ArticleOwnerAssignedEvent {
  type: "knowledge-base.article_owner_assigned";
  articleId: string;
  workspaceId: string;
  accountId: string;
  ownerId: string;
  assignedByUserId: string;
  occurredAtISO: string;
}
```

---

## Category 事件

### knowledge-base.category_created

```typescript
interface CategoryCreatedEvent {
  type: "knowledge-base.category_created";
  categoryId: string;
  workspaceId: string;
  accountId: string;
  name: string;
  parentCategoryId: string | null;
  createdByUserId: string;
  occurredAtISO: string;
}
```

### knowledge-base.category_moved

```typescript
interface CategoryMovedEvent {
  type: "knowledge-base.category_moved";
  categoryId: string;
  workspaceId: string;
  accountId: string;
  fromParentCategoryId: string | null;
  toParentCategoryId: string | null;
  movedByUserId: string;
  occurredAtISO: string;
}
```
