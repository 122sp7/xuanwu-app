# Subdomains

This page is the strategic classification entry point for Xuanwu's Module-Driven Domain Design model.

Xuanwu is a personal- and organization-oriented Knowledge Platform. Its product goal is to bring documents, notes, knowledge pages, knowledge-base articles, structured data, and external sources into one governable workspace system so knowledge can be preserved, verified, retrieved, reasoned over, and turned into executable work.

## Strategic Classification

### Core Domains

| Context | Why it differentiates Xuanwu | Detail |
|---|---|---|
| `knowledge` | Owns the Notion-like knowledge content lifecycle: pages, blocks, versions, approval, and collection-level content structure. | [modules/knowledge/README.md](../../modules/knowledge/README.md) |
| `knowledge-base` | Owns organizational wiki, SOP, and article-grade knowledge assets that are shareable, verifiable, and category-driven. | [modules/knowledge-base/README.md](../../modules/knowledge-base/README.md) |

### Supporting Subdomains

| Context | Role | Detail |
|---|---|---|
| `ai` | Ingestion orchestration, chunk preparation, and indexing handoff for downstream retrieval and reasoning. | [modules/ai/README.md](../../modules/ai/README.md) |
| `knowledge-collaboration` | Comments, permissions, and version snapshots for knowledge-centric collaboration. | [modules/knowledge-collaboration/README.md](../../modules/knowledge-collaboration/README.md) |
| `knowledge-database` | Structured database capability for schema, records, and multi-view exploration. | [modules/knowledge-database/README.md](../../modules/knowledge-database/README.md) |
| `notebook` | Research, ask/cite, summary, and knowledge-generation workflow over retrieved context. | [modules/notebook/README.md](../../modules/notebook/README.md) |
| `search` | Semantic retrieval and answer-context assembly with traceable citations. | [modules/search/README.md](../../modules/search/README.md) |
| `source` | External document and source ingestion entrypoint. | [modules/source/README.md](../../modules/source/README.md) |
| `workspace-audit` | Append-only audit trail for governability and traceability. | [modules/workspace-audit/README.md](../../modules/workspace-audit/README.md) |
| `workspace-feed` | Activity stream and social visibility layer for workspace collaboration. | [modules/workspace-feed/README.md](../../modules/workspace-feed/README.md) |
| `workspace-flow` | Task, issue, and invoice materialization from approved knowledge and workflow policy. | [modules/workspace-flow/README.md](../../modules/workspace-flow/README.md) |
| `workspace-scheduling` | Scheduling, time windows, and capacity coordination for work demands. | [modules/workspace-scheduling/README.md](../../modules/workspace-scheduling/README.md) |

### Generic Subdomains

| Context | Role | Detail |
|---|---|---|
| `identity` | Authentication and token lifecycle. | [modules/identity/README.md](../../modules/identity/README.md) |
| `account` | User profile, account policy, and personalization semantics. | [modules/account/README.md](../../modules/account/README.md) |
| `organization` | Tenant, team, member, and organization-level governance boundary. | [modules/organization/README.md](../../modules/organization/README.md) |
| `workspace` | Primary collaboration container for all knowledge, sources, activity, and workflow state. | [modules/workspace/README.md](../../modules/workspace/README.md) |
| `notification` | Notification delivery and preference-controlled signaling. | [modules/notification/README.md](../../modules/notification/README.md) |

### Shared Kernel

| Context | Role | Detail |
|---|---|---|
| `shared` | Shared domain primitives such as events, slugs, and common contracts used across bounded contexts. | [modules/shared/README.md](../../modules/shared/README.md) |

## External Integration Boundary

Xuanwu does not allow external system models to flow directly into the core domains. External files, document systems, storage events, and AI service contracts enter through source-facing workflows and per-context infrastructure adapters that act as anti-corruption boundaries.

## Historical Notes

- The historical `wiki` module was decomposed. Current responsibilities are distributed across `knowledge`, `knowledge-base`, `knowledge-collaboration`, `knowledge-database`, `search`, and `notebook` depending on ownership.
- The historical `event` and `namespace` modules were folded into `shared`.
- `modules/system.ts` is a composition root, not a bounded context.