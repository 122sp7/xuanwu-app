---
description: 'NotebookLM bounded context rules: conversation/source/retrieval/synthesis ownership, downstream dependency position, and subdomain routing.'
applyTo: 'modules/notebooklm/**/*.{ts,tsx,md}'
---

# NotebookLM Bounded Context (Local)

Use this file as execution guardrails for `modules/notebooklm/`.
For full reference, align with `.github/instructions/architecture-core.instructions.md`, `docs/contexts/notebooklm/README.md`, and `docs/bounded-contexts.md`.

## Core Rules

- `notebooklm` is **downstream** of `platform`, `workspace`, and `notion`; never import from their internals — use `modules/<context>/api` only.
- Cross-module consumers import from `modules/notebooklm/api` only.
- AI provider, model policy, quota, and safety guardrails belong to `platform.ai` — do not reimplement governance here.
- Do not add new dependencies on `subdomains/ai`; treat it as legacy transition surface pending removal.
- Route new RAG capabilities to `subdomains/retrieval`, `subdomains/grounding`, `subdomains/synthesis`, and `subdomains/evaluation`.
- Notebook session orchestration lives in `subdomains/notebook`; source lifecycle lives in `subdomains/source`.
- Use ubiquitous language: `Conversation` not `Chat`, `Source` not `Document` (when referring to RAG input), `Notebook` not `Project`.

## Route to Subdomain When

| Concern | Subdomain |
|---|---|
| Legacy RAG query surface (transition only, do not expand) | `ai` |
| Conversation threads, messages | `conversation` |
| Notebook session orchestration, agent generation | `notebook` |
| Source file lifecycle, RAG document registration | `source` |
| Conversation history versioning | `conversation-versioning` |
| Output grounding and citation alignment | `grounding` |
| Source ingestion pipeline | `ingestion` |
| Inline notes from synthesis output | `note` |
| Retrieval ranking and recall | `retrieval` |
| Synthesis and summarisation | `synthesis` |
| Response quality evaluation | `evaluation` |

## Route Elsewhere When

- Canonical knowledge pages, article publishing → `notion`
- Identity, entitlements, credentials → `platform`
- Workspace lifecycle, membership, presence → `workspace`

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
