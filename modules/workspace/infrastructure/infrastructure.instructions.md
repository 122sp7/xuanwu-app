---
description: 'Workspace infrastructure layer rules: Firebase adapters, event publisher, repository implementations, and Firestore collection ownership.'
applyTo: 'modules/workspace/infrastructure/**/*.{ts,tsx}'
---

# Workspace Infrastructure Layer (Local)

Use this file as execution guardrails for `modules/workspace/infrastructure/*`.
For full reference, align with `.github/instructions/firestore-schema.instructions.md` and `docs/contexts/workspace/*`.

## Core Rules

- Implement only **port interfaces** declared in `domain/ports/output/` — never invent new contracts here.
- `SharedWorkspaceDomainEventPublisher` is the canonical event publisher; do not create alternative publish paths.
- Each Firebase repository (`FirebaseWorkspaceRepository`, `FirebaseWorkspaceQueryRepository`, `FirebaseWikiWorkspaceRepository`) owns its Firestore collection(s) — do not cross-read between them without an explicit port.
- `FirebaseWorkspaceQueryRepository` serves read-model queries; `FirebaseWorkspaceRepository` serves aggregate persistence — keep their responsibilities separate.
- Version breaking schema transitions with migration steps; update `firestore.indexes.json` with query-shape changes.
- Subdomain-specific adapters belong inside `subdomains/<name>/infrastructure/` — do not place them in the context-wide infrastructure.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill xuanwu-development-contracts
