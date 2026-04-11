---
description: 'Notion subdomains structural rules: hexagonal shape per subdomain, content lifecycle ownership, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/notion/subdomains/**/*.{ts,tsx}'
---

# Notion Subdomains Layer (Local)

Use this file as execution guardrails for `modules/notion/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notion/subdomains.md`.

## Core Rules

- Every subdomain must maintain the full hexagonal shape: `api/`, `domain/`, `application/`, `infrastructure/`, `interfaces/`, `README.md`.
- Stub subdomains must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within notion goes through the **subdomain's own `api/`** — never import a sibling's `domain/`, `application/`, or `infrastructure/` internals.
- Content lifecycle ownership is fixed: `authoring` owns Article state machine; `knowledge` owns KnowledgePage and ContentBlock; `database` owns structured records and views; `collaboration` owns comments, permissions, and versions.
- `knowledge` subdomain is the canonical upstream for knowledge artifact references consumed by `notebooklm` — expose via `api/` only.
- Domain events use the discriminant format `notion.<subdomain>.<action>` (e.g. `notion.knowledge.page-published`).
- Dependency direction inside each subdomain: `interfaces → application → domain ← infrastructure`.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
