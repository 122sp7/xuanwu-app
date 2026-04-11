---
description: 'Notion infrastructure layer rules: Firebase adapters, repository implementations, Firestore collection ownership, and persistence mapping.'
applyTo: 'modules/notion/infrastructure/**/*.{ts,tsx}'
---

# Notion Infrastructure Layer (Local)

Use this file as execution guardrails for `modules/notion/infrastructure/*`.
For full reference, align with `.github/instructions/firestore-schema.instructions.md` and `docs/contexts/notion/*`.

## Core Rules

- Implement only **port interfaces** declared in subdomain `domain/ports/` — never invent new contracts here.
- Context-wide `infrastructure/` is for shared adapters that span multiple subdomains; subdomain-specific adapters belong inside `subdomains/<name>/infrastructure/`.
- Each subdomain's Firebase adapter owns its Firestore collection(s); do not read or write sibling subdomain or cross-module collections directly.
- Persistence mappers translate between domain objects and Firestore records — keep them in infrastructure, never in domain.
- Version breaking schema transitions with migration steps; update `firestore.indexes.json` with query-shape changes.
- Content block storage must preserve ordering metadata for consistent tree reconstruction.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill xuanwu-development-contracts
