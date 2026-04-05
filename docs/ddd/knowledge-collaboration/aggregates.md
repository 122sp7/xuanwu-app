**Comment** — contentId + authorId + body，支援 parentCommentId（一層 thread）
**Permission** — subjectId + principalId + level（view/comment/edit/full），upsert 語意
**Version** — contentId + snapshotBlocks，immutable，最多 100 筆（具名版本除外）

→ 詳細設計: [`modules/knowledge-collaboration/aggregates.md`](../../modules/knowledge-collaboration/aggregates.md)
