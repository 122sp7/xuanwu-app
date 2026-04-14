---
description: 'Notion subdomains structural rules: hexagonal shape per subdomain, canonical content ownership, knowledge vs authoring separation, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/notion/subdomains/**/*.{ts,tsx}'
---

# Notion Subdomains Layer (Local)

Use this file as execution guardrails for `modules/notion/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notion/subdomains.md`.

## Core Rules

- Every subdomain must maintain the core-first default shape: `api/`, `domain/`, `application/`, optional `ports/`, and `README.md`.
- `infrastructure/` and `interfaces/` belong at the bounded-context root by default and should be grouped by subdomain there unless the mini-module gate is explicitly justified.
- Stub subdomains (`domain/index.ts` only) must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within notion goes through the **subdomain's own `api/`** — never import a sibling subdomain's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Each subdomain owns its Firestore collection(s); no subdomain reads or writes another subdomain's data directly.
- Domain events emitted by a subdomain must use the discriminant format `notion.<subdomain>.<action>` (e.g. `notion.knowledge.page-published`, `notion.authoring.article-approved`, `notion.collaboration.comment-created`).
- Dependency direction inside each subdomain mirrors the module-level rule: `interfaces → application → domain ← infrastructure`.
- notion owns **canonical content state** — notebooklm may only consume knowledge artifact references; any notebooklm output that should become canonical content must be explicitly absorbed by notion.
- `knowledge` owns KnowledgePage, ContentBlock, KnowledgeCollection, and BacklinkIndex (block-based free-form wiki pages).
- `authoring` owns Article and Category (structured knowledge-base articles with authoring workflow) — do not conflate KnowledgePage (knowledge) with Article (authoring).
- `collaboration` owns Comment, Permission, and Version (per-change edit history snapshots) — it must not own global checkpoint policy.
- `database` owns Database, DatabaseView, DatabaseRecord, and DatabaseAutomation — do not duplicate structured data or view logic in other subdomains.
- `BacklinkIndex` (automatic reverse-link index) and `Relation` (explicit typed semantic graph) are distinct — do not conflate them.
- `collaboration.Version` (per-edit snapshot) and `knowledge-versioning` (workspace-level checkpoint policy) are distinct concerns — do not merge them.
- `taxonomy` is the global semantic organisation network; `authoring.Category` is article-local classification — they are separate and must not replace each other.
- Premature stubs (automation, knowledge-analytics, knowledge-integration, notes, templates) must not be expanded without an ADR documenting why the active subdomains cannot absorb the need.
- Do not place identity, tenant, AI provider policy, or workspace lifecycle logic inside notion subdomains.
- Use `KnowledgeArtifact` (not `Wiki` or `Doc`), `KnowledgePage` (not `Page`), and `Article` (not `Post` or `Content`) in all subdomain published language.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
