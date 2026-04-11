---
description: 'Notion application layer rules: use-case orchestration, content lifecycle commands, event publishing order, and DTO contracts.'
applyTo: 'modules/notion/application/**/*.{ts,tsx}'
---

# Notion Application Layer (Local)

Use this file as execution guardrails for `modules/notion/application/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/notion/*`.

## Core Rules

- Context-wide `application/` is reserved for cross-subdomain orchestration; subdomain-specific use cases belong inside `subdomains/<name>/application/`.
- Use cases orchestrate flow only; content validation, backlink extraction, and publication rules stay in `domain/services/`.
- After persisting, call `pullDomainEvents()` and publish — never publish before persistence.
- DTOs are application-layer contracts; never expose domain aggregates (`Article`, `KnowledgePage`, `Database`) across the layer boundary.
- Pure reads (page trees, block queries, collection views) belong in **query handlers**, not use cases.
- Content lifecycle stages (draft → verified → published) must each correspond to a discrete use case with explicit precondition checks.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
