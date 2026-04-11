---
description: 'Notion bounded context rules: knowledge content lifecycle ownership, downstream dependency position, and subdomain routing.'
applyTo: 'modules/notion/**/*.{ts,tsx,md}'
---

# Notion Bounded Context (Local)

Use this file as execution guardrails for `modules/notion/`.
For full reference, align with `.github/instructions/architecture-core.instructions.md`, `docs/contexts/notion/README.md`, and `docs/bounded-contexts.md`.

## Core Rules

- `notion` is **downstream** of `platform`; never import from platform internals — use `modules/platform/api` only.
- `notion` is **upstream** of `notebooklm`; expose stable knowledge artifact references via `modules/notion/api`, never raw aggregates.
- Cross-module consumers import from `modules/notion/api` only.
- Use ubiquitous language: `KnowledgeArtifact` not `Wiki`/`Doc`, `KnowledgePage` not `Page` (when referring to canonical knowledge), `Article` for authored editorial content.

## Route to Subdomain When

| Concern | Subdomain |
|---|---|
| Article and category lifecycle, publication, verification | `authoring` |
| Knowledge pages, content blocks, collections, backlinks | `knowledge` |
| Structured database records, views, automation | `database` |
| Comments, permissions, version history | `collaboration` |
| File and media attachments | `attachments` |
| Content publishing and distribution | `publishing` |
| Content relations and cross-references | `relations` |
| Tag and taxonomy management | `taxonomy` |
| Page and block templates | `templates` |
| Knowledge analytics and metrics | `knowledge-analytics` |
| External knowledge integration | `knowledge-integration` |
| Knowledge version management | `knowledge-versioning` |
| Personal notes | `notes` |
| Workflow automation on content | `automation` |

## Route Elsewhere When

- Identity, entitlements, credentials, organization → `platform`
- Workspace lifecycle, membership, presence → `workspace`
- Notebook, conversation, retrieval, synthesis → `notebooklm`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
