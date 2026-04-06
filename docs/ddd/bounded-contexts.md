# Bounded Contexts

This page is the canonical bounded-context map for Xuanwu.

Xuanwu is implemented as a modular monolith. Each context owns its own ubiquitous language, domain model, application logic, and infrastructure adapters. Cross-context collaboration happens through public API surfaces or published domain events.

## Current Inventory

| Domain Type | Context | Ownership | Reference |
|---|---|---|---|
| Core Domain | `knowledge` | Knowledge pages, content blocks, versions, approvals, and collection-level content lifecycle. | [modules/knowledge/README.md](../../modules/knowledge/README.md) |
| Core Domain | `knowledge-base` | Organizational articles, categories, wiki-grade publishing, verification, and shared knowledge assets. | [modules/knowledge-base/README.md](../../modules/knowledge-base/README.md) |
| Supporting Subdomain | `ai` | Ingestion jobs, parsing/chunking handoff, and indexing preparation. | [modules/ai/README.md](../../modules/ai/README.md) |
| Supporting Subdomain | `knowledge-collaboration` | Comments, permissions, and immutable version snapshots for knowledge content. | [modules/knowledge-collaboration/README.md](../../modules/knowledge-collaboration/README.md) |
| Supporting Subdomain | `knowledge-database` | Structured database schemas, records, views, and relation-oriented data work. | [modules/knowledge-database/README.md](../../modules/knowledge-database/README.md) |
| Supporting Subdomain | `notebook` | Workspace-scoped research, ask/cite, summary, and knowledge-generation flows. | [modules/notebook/README.md](../../modules/notebook/README.md) |
| Supporting Subdomain | `search` | Retrieval, ranking, citation context, and semantic query support. | [modules/search/README.md](../../modules/search/README.md) |
| Supporting Subdomain | `source` | External files, source collections, ingestion handoff, and source governance. | [modules/source/README.md](../../modules/source/README.md) |
| Supporting Subdomain | `workspace-audit` | Audit logging and governance traceability. | [modules/workspace-audit/README.md](../../modules/workspace-audit/README.md) |
| Supporting Subdomain | `workspace-feed` | Activity stream, replies, reactions, and collaboration visibility. | [modules/workspace-feed/README.md](../../modules/workspace-feed/README.md) |
| Supporting Subdomain | `workspace-flow` | Task, issue, and invoice workflow state machines derived from knowledge and operational policy. | [modules/workspace-flow/README.md](../../modules/workspace-flow/README.md) |
| Supporting Subdomain | `workspace-scheduling` | Scheduling windows, work demands, and capacity allocation. | [modules/workspace-scheduling/README.md](../../modules/workspace-scheduling/README.md) |
| Generic Subdomain | `identity` | Authentication and verified user identity. | [modules/identity/README.md](../../modules/identity/README.md) |
| Generic Subdomain | `account` | User account semantics, policy, profile, and personalization. | [modules/account/README.md](../../modules/account/README.md) |
| Generic Subdomain | `organization` | Multi-tenant organization governance, teams, and member relationships. | [modules/organization/README.md](../../modules/organization/README.md) |
| Generic Subdomain | `workspace` | Workspace container, workspace membership, and workspace-scoped composition. | [modules/workspace/README.md](../../modules/workspace/README.md) |
| Generic Subdomain | `notification` | Notification preferences and outbound signals. | [modules/notification/README.md](../../modules/notification/README.md) |
| Shared Kernel | `shared` | Shared events, slug utilities, and cross-context domain primitives. | [modules/shared/README.md](../../modules/shared/README.md) |

## Communication Model

- Synchronous collaboration must go through the target context's public `api/` surface.
- Asynchronous collaboration must go through published domain events or other explicit contracts.
- External models must be translated at the edge through anti-corruption adapters instead of entering the domain layer unchanged.

## Product-Level Reading Path

1. Read [subdomains.md](./subdomains.md) for strategic classification.
2. Use this page to find context ownership.
3. Read the corresponding `modules/<context>/README.md` and companion markdown files for ubiquitous language, aggregates, events, repositories, and context maps.

## Historical Notes

- `wiki` is no longer a standalone bounded context.
- `knowledge-graph`, `retrieval`, `agent`, `content`, and `asset` should only appear as historical migration context unless a document explicitly states otherwise.
- `modules/system.ts` remains a composition root and is excluded from the bounded-context inventory.