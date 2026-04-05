# knowledge-base — DDD Reference

> **Domain Type:** Core Domain
> **Module:** `modules/knowledge-base/`
> **詳細模組文件:** [`modules/knowledge-base/`](../../modules/knowledge-base/)

## 戰略定位

`knowledge-base` 是 Xuanwu 的第二核心域（與 `knowledge` 並列），提供組織級公開知識庫能力。它使知識平台從個人筆記進化為組織可共享、可驗證、可結構化的知識網路。

## Bounded Context 邊界

- **擁有：** Article（文章）、Category（分類）
- **不擁有：** 個人 Page（→ `knowledge`）、版本歷史（→ `knowledge-collaboration`）、結構化資料（→ `knowledge-database`）

## 核心聚合

詳見 [aggregates.md](../../modules/knowledge-base/aggregates.md)

- **Article** — 組織知識文章（SOP / Wiki），具備 VerificationState 與 ArticleOwner
- **Category** — 層級分類目錄（最多 5 層）

## 主要領域事件

詳見 [domain-events.md](../../modules/knowledge-base/domain-events.md)

- `knowledge-base.article_created`
- `knowledge-base.article_published`
- `knowledge-base.article_verified`
- `knowledge-base.article_review_requested`
- `knowledge-base.category_created`

## 通用語言

詳見 [ubiquitous-language.md](../../modules/knowledge-base/ubiquitous-language.md)

- **Article** ≠ Page（個人筆記）≠ Document（泛型）
- **VerificationState** ≠ ApprovalState（knowledge 的審核）
- **Backlink** = `[[Article Title]]` wikilink 解析結果

## 上下文關係

詳見 [context-map.md](../../modules/knowledge-base/context-map.md)

| 關係 | BC | 類型 |
|---|---|---|
| 上游 | `workspace`, `identity`, `organization` | Conformist |
| 上游 | `knowledge-collaboration` | Customer/Supplier |
| 下游 | `knowledge` (promote) | Customer/Supplier |
| 下游 | `notification`, `workspace-feed` | Published Language |
