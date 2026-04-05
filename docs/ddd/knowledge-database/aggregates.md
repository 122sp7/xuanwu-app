**Database** — name + fields(Schema) + viewIds; Schema 是 invariant 邊界
**Record** — databaseId + properties(Map<fieldId, value>) + order
**View** — databaseId + type(table/board/list/calendar/timeline/gallery) + filters + sorts + groupBy

→ [`modules/knowledge-database/aggregates.md`](../../modules/knowledge-database/aggregates.md)
