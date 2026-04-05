# knowledge-base ?????寞?閬?

> 閰喟敦閮剛?閬?[`modules/knowledge-base/aggregates.md`](../../modules/knowledge-base/aggregates.md)

## Article嚗??嚗?

| 甈? | 隤芣? |
|---|---|
| `id` | ?臭?霅蝣?|
| `title`, `content` | ??璅??蜓擃?|
| `status` | `draft` / `published` / `archived` |
| `verificationState` | `verified` / `needs_review` / `unverified` |
| `ownerId` | ??鞎痊鈭綽?ArticleOwner嚗?|
| `linkedArticleIds` | Backlink 撘?” |
| `categoryId` | ?撅砍?憿?|
| `tags` | 璅惜?” |

## Category嚗??嚗?

| 甈? | 隤芣? |
|---|---|
| `id` | ?臭?霅蝣?|
| `name`, `slug` | ???迂??URL 霅蝣?|  
| `parentCategoryId` | ?嗅?憿?null = ?寧?暺? |
| `depth` | 撅斤?瘛勗漲嚗?憭?5嚗
| `articleIds` | ?游惇?? ID ?” |
