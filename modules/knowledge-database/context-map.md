上游: `workspace`, `identity`, `knowledge-collaboration`(Permission), `knowledge`(KnowledgeCollection opaque ref / D1)
下游: `knowledge-base`(article-record link), `workspace-feed`, `notification`

> **D1 決策**：`knowledge-database` 完整擁有 `spaceType="database"` 的 Database/Record/View 聚合。`knowledge` 提供 `KnowledgeCollection.id` 作為 opaque reference，不參與結構化資料管理。

→ [`modules/knowledge-database/context-map.md`](../../modules/knowledge-database/context-map.md)
