# Wiki-Beta Naming Alignment (Notion Capability Mapping)

## Purpose

- Provide one canonical naming dictionary for product, domain, and implementation terms.
- Keep capability-first alignment with Notion while preserving Xuanwu module boundaries.

## Canonical Terms

| Capability | Notion Term | Xuanwu UI Term | Xuanwu Domain Term | Notes |
|---|---|---|---|---|
| Hierarchical documents | Page tree | Pages | WikiBetaPage | Root/child/sibling tree with account scope |
| Page content | Blocks | Page Blocks | WikiBetaPageBlock (planned) | Rich text and block hierarchy |
| Structured data table | Database / Data source | Libraries | WikiBetaLibrary | MVP treats one library as one table-like source |
| Table columns | Properties | Fields | WikiBetaLibraryField | Type-safe schema for row values |
| Table rows | Pages in database | Records | WikiBetaLibraryRow | Library entries |
| Cross-reference | Relation | Relation | relation field type | Links page/library record IDs |
| Metadata around page | Page properties | Page Metadata | page metadata fields | Title/icon/cover/status |
| Change signals | Webhooks / Events | Sync Signals | Domain Events | Signal-first, fetch latest content afterwards |

## Scope and Ownership

- Next.js runtime owns Pages and Libraries UI flows.
- `modules/wiki-beta` owns orchestration and data contracts for Pages and Libraries.
- `modules/namespace` remains canonical slug policy owner.
- `modules/event` remains canonical domain-event owner.

## Do / Avoid

- Do use `Pages` and `Libraries` consistently in user-facing text.
- Do use `WikiBetaPage*` and `WikiBetaLibrary*` consistently in domain code.
- Avoid mixing `database`, `table`, `collection`, and `library` in the same feature copy.
- Avoid introducing `Notion` labels directly in runtime code identifiers.

## Migration Rule

- Existing docs or UI that mention "Database" should migrate to "Library" unless explicitly discussing Notion API semantics.
- Existing docs or UI that mention "Page property" should migrate to "Page Metadata" for product copy.
- API notes may keep original Notion wording when explaining external compatibility.
