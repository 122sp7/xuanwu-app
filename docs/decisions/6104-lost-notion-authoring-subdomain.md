# 6104 Migration Gap — notion `authoring` 子域

- Status: Recorded — Pending Implementation
- Date: 2026-04-17
- Category: Migration Gap > notion

## Context

`xuanwu-app-skill` 快照的 `modules/notion/subdomains/authoring/` 包含完整的文章撰寫子域。

對應的 `src/modules/notion/subdomains/` 沒有 authoring 子域。notion 整體損失 88% 的實作行數（5,728 → 682）。

### 遺失的 Domain Aggregates（domain/aggregates/）

```
authoring/domain/aggregates/
  Article.ts       (68 lines) — 文章聚合根
    create(), publish(), archive(), updateContent()
    _domainEvents: ArticleCreated, ArticlePublished, ArticleArchived

  Category.ts      (51 lines) — 分類聚合根
    create(), rename(), delete()
    _domainEvents: CategoryCreated, CategoryRenamed
```

### 遺失的 Domain Events（domain/events/）

```
authoring/domain/events/
  ArticleCreated.ts
  ArticlePublished.ts
  ArticleArchived.ts
  ArticleUpdated.ts
  CategoryCreated.ts
  CategoryRenamed.ts
  CategoryDeleted.ts
```

### 遺失的 Domain Repositories（domain/repositories/）

```
authoring/domain/repositories/
  ArticleRepository.ts    — 文章倉儲介面
  CategoryRepository.ts   — 分類倉儲介面
```

### 遺失的 Application Use Cases（application/use-cases/）

```
authoring/application/use-cases/
  create-article.use-case.ts
  publish-article.use-case.ts
  archive-article.use-case.ts
  update-article-content.use-case.ts
  create-category.use-case.ts
  rename-category.use-case.ts
  delete-category.use-case.ts
```

### 遺失的 Interfaces（interfaces/web/）

```
components/
  ArticleDetailPanel.tsx       (60 lines) — 文章詳情 + 編輯面板
  ArticleDialog.tsx            (49 lines) — 新建/編輯文章對話框
  KnowledgeBaseArticlesPanel.tsx (29 lines) — 文章清單面板（含分類篩選）

actions/
  article.actions.ts           (45 lines) — 文章 CRUD Server Actions
  category.actions.ts          (29 lines) — 分類 CRUD Server Actions

queries/
  article.query.ts             (24 lines) — TanStack Query hooks（useArticle, useArticleList）
```

## Decision

**不實施**。僅記錄缺口。

`Article` 與 `Category` 是 notion 最核心的創作業務實體，應優先於其他 notion 子域補回。

## Consequences

- 知識庫文章功能（`/knowledge-base/articles`）在 `src/modules/notion/` 下無對應業務邏輯支撐。
- `ArticleDetailPanel.tsx` 缺失導致文章詳情頁面無法渲染。

## 關聯 ADR

- **6105** notion knowledge-database 子域：分類可能與 Database 的 Tag/Label 有語意重疊，需語意對齊。
- **6106** notion knowledge 子域：KnowledgePage 與 Article 的邊界需在實作前明確。
