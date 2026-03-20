---
title: Wiki development contract
description: Implementation contract for the Wiki module — modern knowledge hub with sidebar organization/workspace knowledge, wiki pages, and RAG pipeline integration.
---

# Wiki development contract

## Purpose

This contract defines the Wiki module as the **現代型知識中樞** for xuanwu-app:

- a sidebar-driven knowledge hub surfacing organization-level and workspace-level knowledge
- the migration target for existing `OrganizationKnowledgeTab` and `WorkspaceKnowledgeTab`
- the UI entry point for the full-stack RAG pipeline (ingestion + query)

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Wiki page stub UI | `app/(shell)/wiki/page.tsx` |
| Organization knowledge tab | `modules/knowledge/interfaces/components/OrganizationKnowledgeTab.tsx` |
| Workspace knowledge tab | `modules/knowledge/interfaces/components/WorkspaceKnowledgeTab.tsx` |
| Knowledge read-side summary | `modules/knowledge` |
| Document metadata + lifecycle | `modules/knowledge` (target: `modules/wiki`) |
| File upload registration | `modules/file` |
| Ingestion worker | `lib/firebase/functions-python` |
| Chunk persistence + vector index | `modules/knowledge` infrastructure |
| RAG query flow | `modules/ai` (Genkit) |

## Bounded contexts

| Context | Responsibility |
| --- | --- |
| Wiki Page Context | create, read, update, archive wiki pages with scope (organization / workspace / private) |
| Knowledge Sidebar Context | surface organization knowledge nodes and workspace knowledge nodes in wiki sidebar |
| Ingestion Context | register documents, trigger worker, track status lifecycle |
| Retrieval Context | embed query, vector search, context assembly, LLM answer generation |
| Governance Context | access control, archive, version rollback, audit log |

## Wiki page entity

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `pageId` | `string` | yes | UUID v4 |
| `organizationId` | `string` | yes | Organization boundary |
| `workspaceId` | `string` | no | null = organization-scoped |
| `title` | `string` | yes | Display title |
| `content` | `string` | no | Markdown body |
| `scope` | `"organization" \| "workspace" \| "private"` | yes | Knowledge visibility tier |
| `parentPageId` | `string` | no | Hierarchical nesting |
| `order` | `number` | yes | Sidebar sort order |
| `isArchived` | `boolean` | yes | Archive flag |
| `createdBy` | `string` | yes | accountId of creator |
| `createdAtISO` | `string` | yes | ISO-8601 |
| `updatedAtISO` | `string` | yes | ISO-8601 |

## Knowledge node entity (sidebar)

A knowledge node is a lightweight sidebar entry pointing at an existing knowledge document or wiki page.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `nodeId` | `string` | yes | UUID v4 |
| `organizationId` | `string` | yes | Org boundary |
| `workspaceId` | `string` | no | null = organization-level node |
| `type` | `"wiki-page" \| "knowledge-doc" \| "folder"` | yes | Node kind |
| `refId` | `string` | no | pageId or documentId being referenced |
| `label` | `string` | yes | Sidebar display label |
| `icon` | `string` | no | Lucide icon name |
| `order` | `number` | yes | Sidebar sort order |
| `parentNodeId` | `string` | no | Parent folder node |

## Sidebar contract

The wiki sidebar must always surface:

1. **組織知識庫** (organization knowledge) — cross-workspace knowledge documents with taxonomy browse and RAG search entry point
2. **工作區知識** (workspace knowledge) — per-workspace document list grouped by workspace
3. **Wiki 頁面** — organization-scoped and workspace-scoped wiki pages
4. **私人** — private pages owned by the authenticated user
5. **封存** — archived pages (collapsed by default)

The sidebar node list is the canonical navigation for all knowledge surfaces. The existing `OrganizationKnowledgeTab` and `WorkspaceKnowledgeTab` components are migration sources; their content will progressively move to the wiki sidebar.

## RAG pipeline contract

### Ingestion entry points

| Step | Owner | Input | Output |
| --- | --- | --- | --- |
| File upload | `modules/file` | binary + metadata | `storage_path`, `fileId`, Firestore `documents` record (`status: uploaded`) |
| Ingestion trigger | Cloud Functions (Python) | Firestore document created event | starts processing pipeline |
| Parsing | Cloud Functions | raw file | normalized text |
| Chunking | Cloud Functions | normalized text | `chunks[]` with `chunkIndex`, `page`, `taxonomy` |
| Embedding | Cloud Functions | chunk text | `vector` (float[]) |
| Chunk persistence | Cloud Functions | chunk + vector | Firestore `chunks/{chunkId}` |
| Status update | Cloud Functions | completion | `documents/{documentId}.status = "ready"` |

### Query entry points

| Step | Owner | Input | Output |
| --- | --- | --- | --- |
| User query | `app/(shell)/wiki` → Server Action | `query: string`, `organizationId`, `workspaceId?` | streaming answer |
| Query preprocess | Genkit Flow | raw query | normalized query + intent |
| Query embedding | Genkit / embedding model | normalized query | `queryVector: float[]` |
| Vector search | Firestore Vector Search | `queryVector`, filters | `TopKChunk[]` |
| Context assembly | Genkit Flow | `TopKChunk[]` | `promptContext: string` |
| LLM generation | Genkit LLM | `promptContext` + `query` | streamed answer text |

### Required query filters

All RAG queries **must** include:

| Filter | Reason |
| --- | --- |
| `organizationId` | tenant isolation |
| `isLatest: true` | exclude stale document versions |
| `accessControl in userRoles` | RBAC enforcement |

Optional filters: `workspaceId`, `taxonomy`, `department`, `language`.

## State machine

### Wiki page lifecycle

```
draft → published → archived
  ↑                    ↓
  └────── restored ────┘
```

| State | Trigger | Allowed next states |
| --- | --- | --- |
| `draft` | page created | `published`, `archived` |
| `published` | user publishes | `archived` |
| `archived` | user archives | `published` (restore) |

### Knowledge document lifecycle (inherited from knowledge module)

```
uploaded → processing → ready
                ↓          ↓
             failed      archived
                ↓
           processing  (retry)
```

See `docs/reference/development-contracts/knowledge-contract.md` for full detail.

## Module structure contract

When `modules/wiki/` is created, it must follow the MDDD layering:

```
modules/wiki/
├── domain/          ← entities, ports, value objects only
├── application/     ← use-cases, orchestration only
├── infrastructure/  ← Firestore adapters only
└── interfaces/      ← Server Actions, queries, React components
```

Dependency direction: `interfaces → application → domain ← infrastructure`

## UI/UX delivery contract (wiki sidebar)

### Required sidebar states

| State | Trigger | Required behavior |
| --- | --- | --- |
| `loading` | sidebar nodes query in-flight | skeleton placeholder, no stale content |
| `loaded` | nodes query succeeds | render organization knowledge + workspace knowledge + wiki pages |
| `error` | nodes query fails | show fallback message, keep section headings visible |
| `empty` | no nodes in a section | show empty state CTA (e.g. "新增頁面" button) |

### Required sidebar behaviors

1. Sidebar must always show the three knowledge tiers (organization / workspace / private) even when empty.
2. Organization knowledge section shows cross-workspace document count and a RAG search entry.
3. Workspace knowledge section groups nodes by workspace; each workspace shows its document count and status badge.
4. Clicking a knowledge-doc node navigates to the wiki page view for that document or opens a document detail drawer.
5. RAG search input in the sidebar (or wiki page header) must forward to the query pipeline entry point.

## Invariants

1. `modules/wiki` owns wiki page aggregates; it does not own knowledge document write-side or ingestion lifecycle.
2. Knowledge document ownership remains in `modules/knowledge` and `modules/file` until an explicit ownership transfer is defined.
3. The wiki sidebar is a read surface; it does not hold mutable business state.
4. All RAG queries must pass `organizationId`, `isLatest`, and `accessControl` filters.
5. Wiki pages and knowledge documents share the same sidebar tree but maintain separate Firestore collections.

## Acceptance gates

Before expanding beyond the current stub page:

1. `modules/wiki/domain` defines `WikiPage` entity and `KnowledgeNode` entity with TypeScript types.
2. `WikiSidebar` component renders organization knowledge nodes and workspace knowledge nodes from query results.
3. At least one Server Action (`createWikiPage`) and one query (`listWikiSidebar`) are implemented and tested.
4. Organization knowledge and workspace knowledge are visible in the wiki sidebar (migrated from tabs).
5. RAG search entry point in the sidebar forwards user queries to a Genkit flow stub.

## Shipped UI surface (current stub)

| Surface | Location |
| --- | --- |
| Wiki page stub | `app/(shell)/wiki/page.tsx` |
| Organization knowledge tab | `modules/knowledge/interfaces/components/OrganizationKnowledgeTab.tsx` |
| Workspace knowledge tab | `modules/knowledge/interfaces/components/WorkspaceKnowledgeTab.tsx` |

These are the migration source components. Their functionality will progressively move to `modules/wiki/interfaces/components/WikiSidebar.tsx` as the wiki knowledge hub is built out.
