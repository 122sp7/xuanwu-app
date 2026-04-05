# knowledge-base — Domain Services

> 詳細實作見 [`modules/knowledge-base/domain-services.md`](../../modules/knowledge-base/domain-services.md)

- `BacklinkExtractorService` — 從 article content 解析 `[[wikilink]]` 標題
- `ArticleSlugService` — title → URL-safe slug 轉換
- `CategoryDepthValidator` — 驗證分類層級不超過 5 層
