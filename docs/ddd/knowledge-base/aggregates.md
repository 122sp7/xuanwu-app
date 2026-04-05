# knowledge-base — 聚合根摘要

> 詳細設計見 [`modules/knowledge-base/aggregates.md`](../../modules/knowledge-base/aggregates.md)

## Article（聚合根）

| 欄位 | 說明 |
|---|---|
| `id` | 唯一識別碼 |
| `title`, `content` | 文章標題與主體 |
| `status` | `draft` / `published` / `archived` |
| `verificationState` | `verified` / `needs_review` / `unverified` |
| `ownerId` | 文章負責人（ArticleOwner） |
| `linkedArticleIds` | Backlink 引用列表 |
| `categoryId` | 所屬分類 |
| `tags` | 標籤列表 |

## Category（聚合根）

| 欄位 | 說明 |
|---|---|
| `id` | 唯一識別碼 |
| `name`, `slug` | 分類名稱與 URL 識別碼 |  
| `parentCategoryId` | 父分類（null = 根節點） |
| `depth` | 層級深度（最大 5）|
| `articleIds` | 直屬文章 ID 列表 |
