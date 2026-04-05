# Repositories — knowledge-base

> Repository 介面定義於 `domain/repositories/`，實作置於 `infrastructure/firebase/`。

---

## IArticleRepository

```typescript
// modules/knowledge-base/domain/repositories/ArticleRepository.ts

export interface IArticleRepository {
  /** 取得單篇文章（不存在時 throw domain error） */
  getById(articleId: string): Promise<Article>;

  /** 列出 Workspace 下的文章（可依 categoryId / status 過濾） */
  list(params: {
    workspaceId: string;
    accountId: string;
    categoryId?: string;
    status?: ArticleStatus;
    limit?: number;
    cursor?: string;
  }): Promise<Article[]>;

  /** 全文搜尋（基本實作，詳細 RAG 搜尋由 search BC 處理） */
  search(params: {
    workspaceId: string;
    query: string;
    limit?: number;
  }): Promise<Article[]>;

  /** 儲存（建立或更新） */
  save(article: Article): Promise<void>;

  /** 批次取得（backlink 查詢用） */
  getByIds(articleIds: string[]): Promise<Article[]>;

  /** 查找引用特定 articleId 的所有文章（反向 backlink） */
  findByLinkedArticleId(articleId: string): Promise<Article[]>;

  /** 刪除（Firestore 物理刪除，通常用於測試） */
  delete(articleId: string): Promise<void>;
}
```

---

## ICategoryRepository

```typescript
// modules/knowledge-base/domain/repositories/CategoryRepository.ts

export interface ICategoryRepository {
  /** 取得單一分類 */
  getById(categoryId: string): Promise<Category>;

  /** 列出 Workspace 下的所有分類（樹狀） */
  listByWorkspace(workspaceId: string, accountId: string): Promise<Category[]>;

  /** 取得特定父節點的子分類 */
  listChildren(parentCategoryId: string): Promise<Category[]>;

  /** 儲存 */
  save(category: Category): Promise<void>;

  /** 刪除（前提：無子分類且無文章） */
  delete(categoryId: string): Promise<void>;

  /** 批次更新 articleIds（文章搬移時） */
  updateArticleIds(categoryId: string, articleIds: string[]): Promise<void>;
}
```

---

## Firestore Collection 設計

| Collection | Document ID | 說明 |
|---|---|---|
| `knowledge_base_articles` | `{articleId}` | Article documents |
| `knowledge_base_categories` | `{categoryId}` | Category documents |

### Index 需求（預計）

| Collection | Fields | Purpose |
|---|---|---|
| `knowledge_base_articles` | `workspaceId`, `status`, `categoryId` | Category article list |
| `knowledge_base_articles` | `workspaceId`, `status`, `verificationState` | Verification dashboard |
| `knowledge_base_articles` | `workspaceId`, `ownerId` | My articles |
