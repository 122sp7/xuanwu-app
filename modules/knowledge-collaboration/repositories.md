# Repositories — knowledge-collaboration

---

## ICommentRepository

```typescript
export interface ICommentRepository {
  getById(commentId: string): Promise<Comment>;
  listByContent(contentId: string, contentType: "page" | "article"): Promise<Comment[]>;
  save(comment: Comment): Promise<void>;
  softDelete(commentId: string): Promise<void>;
}
```

---

## IPermissionRepository

```typescript
export interface IPermissionRepository {
  get(subjectId: string, principalId: string): Promise<Permission | null>;
  listBySubject(subjectId: string, subjectType: string): Promise<Permission[]>;
  listByPrincipal(principalId: string, workspaceId: string): Promise<Permission[]>;
  save(permission: Permission): Promise<void>;
  revoke(subjectId: string, principalId: string): Promise<void>;
}
```

---

## IVersionRepository

```typescript
export interface IVersionRepository {
  getById(versionId: string): Promise<Version>;
  listByContent(
    contentId: string,
    contentType: "page" | "article",
    limit?: number
  ): Promise<Version[]>;
  save(version: Version): Promise<void>;
  deleteById(versionId: string): Promise<void>;
}
```

---

## Firestore Collection 設計

| Collection | Document ID | 說明 |
|---|---|---|
| `knowledge_comments` | `{commentId}` | Comment documents |
| `knowledge_permissions` | `{subjectId}_{principalId}` | Permission documents |
| `knowledge_versions` | `{versionId}` | Version snapshot documents |

### Index 需求（預計）

| Collection | Fields | Purpose |
|---|---|---|
| `knowledge_comments` | `contentId`, `contentType`, `createdAtISO` | Thread listing |
| `knowledge_permissions` | `subjectId`, `subjectType` | Permission dashboard |
| `knowledge_versions` | `contentId`, `contentType`, `createdAtISO` | Version history |
