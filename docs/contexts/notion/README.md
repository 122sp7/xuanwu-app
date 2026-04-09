# notion

> **Domain Type:** Core Domain
> **Module:** `modules/notion/`
> **Authoritative docs:** [`modules/notion/docs/`](../../../modules/notion/docs/)

## Boundary

- **Responsible for:**
  - `KnowledgePage` lifecycle — create, edit, version, archive, restore（`knowledge` 子域）
  - `Article` and `Category` lifecycle — authoring, verification, classification（`authoring` 子域）
  - Collaborative comments, fine-grained permissions, version snapshots（`collaboration` 子域）
  - Structured data with multi-view management — `Database`, `Field`, `Record`, `View`（`database` 子域）
  - AI-assisted page generation and summarization integration（`ai` 子域）
  - Knowledge usage behavior measurement（`analytics` 子域）
  - Attachment and media association storage（`attachments` 子域）
  - Event-driven automation rules（`automation` 子域）
  - Bidirectional external system integration（`integration` 子域）
  - Personal lightweight notes collaborating with formal knowledge（`notes` 子域）
  - Page template management and application（`templates` 子域）
  - Global version snapshot policy management（`versioning` 子域）

- **Not responsible for:**
  - Workspace container identity and lifecycle → `workspace`
  - Platform identity, account, or subscription governance → `platform`
  - AI conversation threads and RAG synthesis → `notebooklm`
  - Raw document ingestion pipeline → `py_fn`

## Subdomain Inventory

| 子域 | 核心語言 | 前身模組 |
|---|---|---|
| `knowledge` | `KnowledgePage`, `ContentBlock`, `ContentVersion`, `KnowledgeCollection` | `modules/knowledge/` |
| `authoring` | `Article`, `Category`, `VerificationState`, `ArticleOwner`, `Backlink` | `modules/knowledge-base/` |
| `collaboration` | `Comment`, `Permission`, `PermissionLevel`, `Version`, `NamedVersion` | `modules/knowledge-collaboration/` |
| `database` | `Database`, `Field`, `Record`, `Property`, `View`, `ViewType` | `modules/knowledge-database/` |
| `ai` | `AiDraftRequest`, `IngestionSignal` | — |
| `analytics` | `PageViewEvent`, `KnowledgeMetric` | — |
| `attachments` | `Attachment`, `MediaRef` | — |
| `automation` | `AutomationRule`, `TriggerCondition` | — |
| `integration` | `IntegrationSource`, `SyncPolicy` | — |
| `notes` | `Note`, `NoteRef` | — |
| `templates` | `PageTemplate`, `TemplateApplication` | — |
| `versioning` | `VersionPolicy`, `RetentionRule` | — |

## Published Language

- **Commands (representative):**
  - `CreateKnowledgePage` / `ArchiveKnowledgePage` / `PromotePage`
  - `CreateArticle` / `VerifyArticle`
  - `AddComment` / `GrantPermission`
  - `CreateDatabase` / `AddRecord`

- **Queries (representative):**
  - `GetKnowledgePage` / `ListKnowledgePages`
  - `GetPageTree`
  - `ListArticles` / `GetArticle`
  - `QueryDatabase`

- **Events (representative):**
  - `notion.page_created` / `notion.page_archived` / `notion.page_promoted`
  - `notion.article_created` / `notion.article_verified`
  - `notion.comment_added`
  - `notion.database_record_updated`
  - See [`modules/notion/docs/domain-events.md`](../../../modules/notion/docs/domain-events.md) for full inventory.

## Upstream / Downstream

- **Upstream:**
  - `platform` → notion — identity validation, account ownership, subscription entitlement (Published Language)
  - `workspace` → notion — `workspaceId` scoping for all content operations (Published Language)

- **Downstream:**
  - notion → `notebooklm` — indexed content chunks provided via `search` subdomain for RAG generation (Customer/Supplier)
  - notion → `py_fn` — `page_approved` triggers RAG ingestion pipeline (Customer/Supplier via Events)

- **Relationship types:**
  - `platform → notion`: Published Language / Conformist
  - `workspace → notion`: Published Language
  - `notion → notebooklm`: Customer/Supplier (via search index)
  - `notion → py_fn`: Customer/Supplier (Events)

## Migration Notes

The following legacy modules are planned to be absorbed into the corresponding notion subdomains:

| 前身模組 | 目標子域 | 狀態 |
|---|---|---|
| `modules/knowledge/` | `notion/subdomains/knowledge` | Migration-Pending |
| `modules/knowledge-base/` | `notion/subdomains/authoring` | Migration-Pending |
| `modules/knowledge-collaboration/` | `notion/subdomains/collaboration` | Migration-Pending |
| `modules/knowledge-database/` | `notion/subdomains/database` | Migration-Pending |

## Context Rules

1. Keep domain model isolated from external model leakage.
2. Expose only stable contracts via published language.
3. Record boundary changes in `docs/context-map.md` and ADRs.
4. Cross-module access must use `modules/notion/api` only — never import internal layers directly.
5. Subdomain inventory is **closed by default** — see [`modules/notion/docs/subdomains.md`](../../../modules/notion/docs/subdomains.md) for freeze rules.
6. `workspace`-scoped write paths must carry `workspaceId`.
