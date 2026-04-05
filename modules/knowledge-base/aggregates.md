# Aggregates — knowledge-base

> 聚合根設計遵循 IDDD 規範：清晰邊界、一致性、最小耦合。

---

## Article（文章）— 聚合根

Article 是組織知識文章的主要聚合根，代表一篇完整的公開或內部知識文章、SOP 或 Wiki 頁面。

```typescript
type ArticleStatus = "draft" | "published" | "archived";
type VerificationState = "verified" | "needs_review" | "unverified";

interface Article {
  // Identity
  id: string;                           // Unique Article ID
  accountId: string;                    // Tenant (organization)
  workspaceId: string;                  // Workspace container
  categoryId: string | null;            // Parent Category (optional)

  // Content
  title: string;
  content: string;                      // Rich text / Markdown body
  tags: string[];                       // Classification labels

  // Lifecycle
  status: ArticleStatus;               // draft → published → archived
  version: number;                      // Optimistic locking version

  // Verification
  verificationState: VerificationState; // verified | needs_review | unverified
  ownerId: string | null;               // Article owner (responsible user)
  verifiedByUserId: string | null;
  verifiedAtISO: string | null;
  verificationExpiresAtISO: string | null;

  // Backlinks
  linkedArticleIds: string[];           // Outgoing [[wikilink]] references

  // Audit
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
```

### Article 業務規則

- Article 發布後（published），`content` 與 `title` 變更必須觸發 `knowledge-base.article_updated` 事件。
- `verificationState` 轉為 `verified` 需提供 `verifiedByUserId` 與 `verifiedAtISO`。
- 刪除改為 `archived`，不實際移除資料。
- `linkedArticleIds` 由 `BacklinkExtractorService` 從 `content` 自動解析。

---

## Category（分類目錄）— 聚合根

Category 是文章的層級分類容器，支援巢狀結構（最多 5 層）。

```typescript
interface Category {
  // Identity
  id: string;
  accountId: string;
  workspaceId: string;

  // Hierarchy
  name: string;
  slug: string;                         // URL-safe identifier
  parentCategoryId: string | null;      // null = root category
  depth: number;                        // 0 = root

  // Content
  articleIds: string[];                 // Articles directly under this category
  description: string | null;

  // Audit
  createdByUserId: string;
  createdAtISO: string;
  updatedAtISO: string;
}
```

### Category 業務規則

- `depth` 不可超過 5。
- 刪除 Category 前，所有子 Category 與 Article 必須先搬遷或刪除。
- `slug` 在同一 Workspace 下唯一。
