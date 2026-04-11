---
description: 'Platform infrastructure layer rules: Firebase adapters, QStash messaging, event routing, persistence mapping, and cache strategy.'
applyTo: 'modules/platform/infrastructure/**/*.{ts,tsx}'
---

# Platform Infrastructure Layer (Local)

Use this file as execution guardrails for `modules/platform/infrastructure/*`.
For full reference, align with `.github/instructions/firestore-schema.instructions.md` and `docs/contexts/platform/*`.

## Core Rules

- Implement only **port interfaces** declared in `domain/ports/output/`; never invent new contracts here.
- Keep Firestore collection ownership explicit per bounded context — do not read or write another module's collections.
- Persistence mappers (`mapXxxToPersistenceRecord`) are the only place to translate between domain objects and storage records.
- Cached repositories (`cache/`) must delegate to the underlying repository and never bypass domain validation.
- QStash adapters (`messaging/`) must implement `DomainEventPublisher`, `JobQueuePort`, or `WorkflowDispatcherPort` — no ad-hoc fire-and-forget.
- Event routing (`events/routing/`) must use `resolveEventHandler` as the single dispatch table; do not hardcode handler selection in consumers.
- Version breaking schema transitions with migration steps before deploying; update `firestore.indexes.json` with query-shape changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
#use skill xuanwu-development-contracts
