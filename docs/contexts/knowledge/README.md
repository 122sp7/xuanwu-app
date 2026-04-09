# knowledge

> **Domain Type:** Core Domain  
> **Module:** `modules/knowledge/`  
> **Authoritative docs:** [`modules/knowledge/`](../../../modules/knowledge/)

## Boundary

- **Responsible for:**
  - `KnowledgePage` lifecycle — create, edit, version, archive, restore
  - `ContentBlock` management — add, update, delete blocks within a page
  - `ContentVersion` snapshots and manual publish
  - `KnowledgeCollection` — wiki space ownership (verification, ownership, review workflow)
  - `KnowledgeCollection` — database space opaque reference (ID only; structure owned by `knowledge-database` per D1)
  - Page approval workflow for AI-generated drafts (`approvalState`)
  - Page verification and review-request workflow (wiki space, `verificationState`)
  - D3 Promote: emitting `knowledge.page_promoted` to initiate Article creation in `knowledge-base`

- **Not responsible for:**
  - Database schema, records, views → `knowledge-database`
  - Article / Category lifecycle → `knowledge-base`
  - Organization member and team governance → `workspace` / `organization`
  - AI ingestion pipeline → `ai`
  - Semantic search and retrieval → `search`
  - Conversation / Q&A interface → `notebook`
  - Task and invoice materialization from approved pages → `workspace-flow`

## Published Language

- **Commands:**
  - `CreateKnowledgePage` (requires `workspaceId` on write path)
  - `ArchiveKnowledgePage` (cascades to child pages — D2)
  - `ApprovePage`
  - `VerifyPage` / `RequestPageReview`
  - `AssignPageOwner`
  - `PromotePage` (D3 Promote to Article)
  - `AddContentBlock` / `UpdateContentBlock` / `DeleteContentBlock`
  - `PublishContentVersion`

- **Queries:**
  - `GetKnowledgePage`
  - `ListKnowledgePages` (workspace-scoped by default; explicit summary mode for account/org overview)
  - `GetPageTree`

- **Events:**
  - `knowledge.page_created`
  - `knowledge.page_renamed`
  - `knowledge.page_moved`
  - `knowledge.page_archived`
  - `knowledge.page_approved` ← primary integration point (triggers `workspace-flow` + `ai`)
  - `knowledge.page_promoted`
  - `knowledge.page_verified`
  - `knowledge.page_review_requested`
  - `knowledge.page_owner_assigned`
  - `knowledge.block_added`
  - `knowledge.block_updated`
  - `knowledge.block_deleted`
  - `knowledge.version_published`

## Upstream / Downstream

- **Upstream:**
  - `identity` → knowledge — validates `createdByUserId` on page operations
  - `workspace` → knowledge — provides `workspaceId` container; workspace-first scope is the default; account-level summary requires explicit mode

- **Downstream:**
  - knowledge → `workspace-flow` — `knowledge.page_approved` drives Task and Invoice materialization (Published Language / Customer-Supplier)
  - knowledge → `ai` — `knowledge.page_approved` triggers RAG ingestion pipeline (Customer/Supplier via Events)
  - knowledge → `knowledge-database` — opaque `KnowledgeCollection.id` reference for database-type collections (Open Host Service)
  - knowledge → `knowledge-base` — `knowledge.page_promoted` initiates Article creation (Customer/Supplier — D3 Promote)

- **Relationship types:**
  - `identity → knowledge`: Customer/Supplier
  - `workspace → knowledge`: Customer/Supplier
  - `knowledge → workspace-flow`: Published Language (Events)
  - `knowledge → ai`: Customer/Supplier (Events)
  - `knowledge → knowledge-database`: Open Host Service
  - `knowledge → knowledge-base`: Customer/Supplier (Promote Events)

## Context Rules

1. Keep domain model isolated from external model leakage.
2. Expose only stable contracts via published language.
3. Record boundary changes in `docs/context-map.md` and ADRs.
4. `createKnowledgePage` write path **must** carry `workspaceId`; account-level summary is an explicit mode, not a default.
5. Do not add a `"trash"` status — `archived` is the canonical soft-delete state (ADR governs any change).
6. Database space collections are opaque references only; schema/record/view lifecycle belongs to `knowledge-database`.
