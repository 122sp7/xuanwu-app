---
description: 'NotebookLM application layer rules: use-case orchestration, RAG pipeline coordination, event publishing order, and DTO contracts.'
applyTo: 'modules/notebooklm/application/**/*.{ts,tsx}'
---

# NotebookLM Application Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/application/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notebooklm/*`.

## Core Rules

- Context-wide `application/` is reserved for cross-subdomain orchestration; subdomain-specific use cases belong inside `subdomains/<name>/application/`.
- Use cases orchestrate flow only; RAG scoring, citation building, and prompt construction stay in `domain/services/`.
- After persisting, call `pullDomainEvents()` and publish — never publish before persistence.
- DTOs are application-layer contracts; never expose domain entities across the layer boundary.
- Pure reads (retrieval results, conversation history) belong in **query handlers**, not use cases.
- RAG pipeline steps (retrieve → ground → generate → evaluate) must be individually use-case-addressable to allow partial retry.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill rag-architecture
