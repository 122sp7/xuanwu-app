# knowledge-base ??DDD Reference

> **Domain Type:** Core Domain
> **Module:** `modules/knowledge-base/`
> **閰喟敦璅∠??辣:** [`modules/knowledge-base/`](../../modules/knowledge-base/)

## ?啁摰?

`knowledge-base` ??Xuanwu ?洵鈭敹?嚗? `knowledge` 銝血?嚗???蝯?蝝?霅澈?賢???雿輻霅像?啣??犖蝑??脣??箇?蝜?曹澈?撽??蝯????亥?蝬脰楝??

## Bounded Context ??

- **??嚗?* Article嚗?蝡??ategory嚗?憿?
- **銝???** ?犖 Page嚗? `knowledge`嚗??祆風?莎???`knowledge-collaboration`嚗?瑽?鞈?嚗? `knowledge-database`嚗?

## ?詨???

閰唾? [aggregates.md](../../modules/knowledge-base/aggregates.md)

- **Article** ??蝯??亥???嚗OP / Wiki嚗??瑕? VerificationState ??ArticleOwner
- **Category** ??撅斤????桅?嚗?憭?5 撅歹?

## 銝餉???鈭辣

閰唾? [domain-events.md](../../modules/knowledge-base/domain-events.md)

- `knowledge-base.article_created`
- `knowledge-base.article_published`
- `knowledge-base.article_verified`
- `knowledge-base.article_review_requested`
- `knowledge-base.category_created`

## ?隤?

閰唾? [ubiquitous-language.md](../../modules/knowledge-base/ubiquitous-language.md)

- **Article** ??Page嚗犖蝑?嚗? Document嚗???
- **VerificationState** ??ApprovalState嚗nowledge ?祟?賂?
- **Backlink** = `[[Article Title]]` wikilink 閫??蝯?

## 銝???靽?

閰唾? [context-map.md](../../modules/knowledge-base/context-map.md)

| ?? | BC | 憿? |
|---|---|---|
| 銝虜 | `workspace`, `identity`, `organization` | Conformist |
| 銝虜 | `knowledge-collaboration` | Customer/Supplier |
| 銝虜 | `knowledge` (promote) | Customer/Supplier |
| 銝虜 | `notification`, `workspace-feed` | Published Language |
