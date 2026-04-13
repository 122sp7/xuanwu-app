# 4302 Semantic Drift — Notion & NotebookLM Event Discriminant Format (snake_case → kebab-case)

- Status: Resolved
- Date: 2026-04-13
- Category: Maintainability Smells > Semantic Drift
- Extends: ADR 3201 (Duplication — Domain Event Discriminant Format)

## Context

ADR 3201 resolved event discriminant format inconsistency for **platform** events,
migrating 21 constants from `underscore_case` to `kebab-case`.

However, **notion** and **notebooklm** event discriminants were not included in
that migration and still use `snake_case`:

### Notion events (40 discriminants)

```
notion.knowledge.page_created     → should be notion.knowledge.page-created
notion.knowledge.block_updated    → should be notion.knowledge.block-updated
notion.knowledge.collection_created → should be notion.knowledge.collection-created
notion.authoring.article_published → should be notion.authoring.article-published
notion.collaboration.comment_created → should be notion.collaboration.comment-created
notion.database.database_created  → should be notion.database.database-created
notion.relations.relation_created → should be notion.relations.relation-created
notion.taxonomy.node_created      → should be notion.taxonomy.node-created
... (and more)
```

### NotebookLM events (18 discriminants)

```
notebooklm.conversation.thread_created → should be notebooklm.conversation.thread-created
notebooklm.source.file_uploaded   → should be notebooklm.source.file-uploaded
notebooklm.synthesis.completed    → (no underscore, already compliant)
notebooklm.retrieval.completed    → (no underscore, already compliant)
... (and more)
```

### Inconsistency scope

- Platform: ✅ kebab-case (resolved by ADR 3201)
- Workspace: ✅ kebab-case (workspace-flow uses hyphens in actions)
- Notion: ❌ snake_case
- NotebookLM: ❌ snake_case (partial — single-word actions are fine)

### Runtime references

Notion aggregate files emit events with hardcoded snake_case discriminants:
- `KnowledgePage.ts:68` → `"notion.knowledge.page_created"`
- `KnowledgePage.ts:159` → `"notion.knowledge.page_approved"`
- `ContentBlock.ts:69` → `"notion.knowledge.block_updated"`
- `review-knowledge-page.use-cases.ts:64` → `"knowledge.page_approved"` (inconsistent prefix too)

## Decision

1. Migrate all notion event discriminants from `snake_case` to `kebab-case`.
2. Migrate all notebooklm event discriminants from `snake_case` to `kebab-case`.
3. Update aggregate/use-case files that emit these events.
4. Fix `review-knowledge-page.use-cases.ts` to use full canonical prefix.

## Consequences

Positive:
- All four main domains use consistent `kebab-case` event discriminant format.
- Reduces cognitive load when working across domain boundaries.

Cost:
- Must update all event type literals across notion and notebooklm.
- Any runtime event subscribers matching on old discriminants must be updated.

## Related ADRs

- **ADR 3201** (Resolved): Platform event discriminant format migration
- **ADR 0006**: Domain Event Discriminant Format convention
