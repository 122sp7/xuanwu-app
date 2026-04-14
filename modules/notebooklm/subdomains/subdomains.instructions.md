---
description: 'NotebookLM subdomains structural rules: hexagonal shape per subdomain, derived-output ownership, RAG pipeline boundaries, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/notebooklm/subdomains/**/*.{ts,tsx}'
---

# NotebookLM Subdomains Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notebooklm/subdomains.md`.

## Core Rules

- Every subdomain must maintain the core-first default shape: `api/`, `domain/`, `application/`, optional `ports/`, and `README.md`.
- `infrastructure/` and `interfaces/` belong at the bounded-context root by default and should be grouped by subdomain there unless the mini-module gate is explicitly justified.
- Stub subdomains (`domain/index.ts` only) must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within notebooklm goes through the **subdomain's own `api/`** — never import a sibling subdomain's `domain/`, `application/`, `infrastructure/`, or `interfaces/` internals.
- Each subdomain owns its Firestore collection(s); no subdomain reads or writes another subdomain's data directly.
- Domain events emitted by a subdomain must use the discriminant format `notebooklm.<subdomain>.<action>` (e.g. `notebooklm.conversation.thread-created`, `notebooklm.source.ingestion-completed`, `notebooklm.synthesis.answer-generated`).
- Dependency direction inside each subdomain mirrors the module-level rule: `interfaces → application → domain ← infrastructure`.
- notebooklm only owns **derived reasoning outputs** — it must never directly modify canonical content belonging to `notion`.
- `conversation` owns Thread and Message lifecycle; it must not own source ingestion or RAG pipeline logic.
- `notebook` owns the aggregate container combining conversation, source, and derived notes; GenKit response generation is scoped here.
- `source` owns the ingestion lifecycle, RagDocument state machine, WikiLibrary, and SourceRetentionPolicy — it must not own retrieval ranking or generation.
- `synthesis` owns the complete RAG pipeline (retrieval → grounding → generation → evaluation) as internal facets; do not split these facets into separate subdomains unless an explicit split trigger is documented in an ADR.
- Retrieval is upstream of generation; grounding aligns output to source evidence — do not reverse this dependency.
- `evaluation` describes output quality and grounding confidence; it must not emit billing signals or usage metrics.
- Shared AI provider capability (model routing, quota, safety) is supplied by `platform.ai` — do not replicate provider policy inside notebooklm subdomains.
- Use `organizationId` only as an internal storage scope identifier derived after boundary translation; do not treat it as a shell route parameter.
- Use `Conversation` (not `Chat` or `Session`) and `Ingestion` (not `File Import` or `Upload`) in all subdomain published language.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
