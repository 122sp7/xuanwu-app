# Wiki-Beta Naming Alignment (Notion Capability Mapping)

## Purpose

Provide one canonical naming dictionary for product, domain, and implementation terms.
Keep capability-first alignment with Notion while preserving Xuanwu module boundaries.

Consistent naming reduces cognitive load for users, reviewers, and engineers:
a developer reading `WikiBetaLibrary` in code and `Libraries` in the UI immediately knows they refer to the same thing.

---

## Canonical Terms

| Capability | Notion Term | Xuanwu UI Term | Xuanwu Domain Term | Rationale |
|---|---|---|---|---|
| Hierarchical documents | Page tree | **Pages** | `WikiBetaPage` | "Pages" is shorter and universally understood; matches Notion's end-user vocabulary |
| Page content | Blocks | **Page Blocks** | `WikiBetaPageBlock` *(planned)* | Preserves Notion's block model while namespacing it to the wiki-beta domain |
| Structured data table | Database / Data source | **Libraries** | `WikiBetaLibrary` | "Library" conveys curated, structured knowledge rather than a raw database—closer to the product intent |
| Table columns | Properties | **Fields** | `WikiBetaLibraryField` | "Fields" maps to standard data-modeling vocabulary; avoids Notion-specific "Properties" leaking into our schema |
| Table rows | Pages in database | **Records** | `WikiBetaLibraryRow` | "Records" matches standard CRUD language and aligns with the `row` domain type without over-specifying |
| Cross-reference | Relation | **Relation** | `relation` field type | Relation is already neutral; keep parity with Notion and standard relational-data terminology |
| Metadata around page | Page properties | **Page Metadata** | page metadata fields | Distinguishes structural page meta (title/icon/cover/status) from user-defined Library Fields |
| Change signals | Webhooks / Events | **Sync Signals** | Domain Events | Signals are fire-and-forget; consumers fetch latest state—makes the eventual-consistency model explicit |

---

## Scope and Ownership

| Owner | Responsibility |
|---|---|
| Next.js runtime | Pages and Libraries UI flows, routing |
| `modules/wiki-beta` | Orchestration, domain types, and data contracts for Pages and Libraries |
| `modules/namespace` | Canonical slug policy; wiki-beta delegates slug generation here |
| `modules/event` | Canonical domain-event publishing; wiki-beta emits, event module routes |

---

## Correct Usage Examples

```typescript
// ✅ Domain code — always use WikiBeta* prefix
const page: WikiBetaPage = await createWikiBetaPage({ ... });
const lib: WikiBetaLibrary = await createWikiBetaLibrary({ ... });
const field: WikiBetaLibraryField = { key: "status", type: "select", ... };
const row: WikiBetaLibraryRow = { libraryId: lib.id, values: { status: "active" } };

// ❌ Never use raw Notion terms in runtime identifiers
const database = ...;   // Wrong — use WikiBetaLibrary
const property = ...;   // Wrong — use WikiBetaLibraryField
```

```tsx
{/* ✅ UI copy — always Pages / Libraries */}
<Button>新增頁面</Button>
<Button>新增資料庫</Button>  {/* "新增資料庫" is acceptable shorthand for "新增 Library" in UI */}
<NavItem>Pages</NavItem>
<NavItem>Libraries</NavItem>

{/* ❌ Never mix Notion labels directly into UI copy */}
<Button>新增 Notion Database</Button>  {/* Wrong */}
<NavItem>Databases</NavItem>           {/* Wrong — use Libraries */}
```

---

## Do / Avoid

| Do | Avoid |
|---|---|
| Use `Pages` and `Libraries` in all user-facing text and nav items | Mixing `database`, `table`, `collection`, and `library` in the same feature copy |
| Use `WikiBetaPage*` and `WikiBetaLibrary*` in all domain code identifiers | Using `Notion` as a prefix in any runtime code or type name |
| Use `Fields` when describing columns in a Library | Using `Properties` or `Columns` in domain or UI code |
| Use `Records` when describing rows in a Library | Using `Pages in database`, `rows`, or `entries` interchangeably without picking one |
| Use `Page Metadata` for page-level structural attributes | Using `Page properties` (Notion term) in product copy |
| Explain Notion semantics in **docs only** when describing external compatibility | Exposing `Notion` vocabulary in router paths, function names, or Firestore collection names |

---

## Migration Rule

- Any existing doc or UI that mentions **"Database"** → migrate to **"Library"**, unless the context is explicitly explaining Notion API compatibility.
- Any existing doc or UI that mentions **"Page property"** → migrate to **"Page Metadata"** for product copy.
- API integration notes may keep original Notion wording when explaining external API compatibility.

> **⚠️ Infrastructure vs. Application Layer Rule**
>
> Firestore storage path `databases/{databaseId}` is acceptable at the **infrastructure layer only** (Firebase repository implementations).
> The **application and UI layers** must always use `Libraries` / `WikiBetaLibrary*`.
> Never expose the `databases` path in use-cases, Server Actions, or UI components.
