---
description: 'NotebookLM subdomains structural rules: hexagonal shape per subdomain, RAG pipeline ownership, cross-subdomain collaboration, and stub promotion criteria.'
applyTo: 'modules/notebooklm/subdomains/**/*.{ts,tsx}'
---

# NotebookLM Subdomains Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/subdomains/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notebooklm/subdomains.md`.

## Core Rules

- Every subdomain must maintain the full hexagonal shape: `api/`, `domain/`, `application/`, `infrastructure/`, `interfaces/`, `README.md`.
- Stub subdomains must not be promoted to Active without a corresponding ADR and `README.md` update.
- Cross-subdomain collaboration within notebooklm goes through the **subdomain's own `api/`** — never import a sibling's internals directly.
- RAG pipeline ownership is fixed: `source` → ingestion boundary; `ai` → generation and scoring; `grounding` → citation alignment; `retrieval` → recall and ranking; `synthesis` → summarisation output.
- Domain events use the discriminant format `notebooklm.<subdomain>.<action>` (e.g. `notebooklm.source.document-registered`).
- `source` subdomain may read `notion` knowledge artifacts via ACL adapter — never import notion domain types directly.
- Dependency direction inside each subdomain: `interfaces → application → domain ← infrastructure`.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill rag-architecture
