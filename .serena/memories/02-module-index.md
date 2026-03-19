# Module Index

## Feature modules under modules/ (verified 2026-03-19 on branch copilot/redesign-scheduling-task-system)

- acceptance
- account
- ai
- audit
- billing
- daily
- file
- finance
- identity
- issue
- notification
- organization
- parser
- qa
- schedule
- task
- workspace

## Cross-cutting core modules under core/ (each follows full MDDD: domain/application/infrastructure/interfaces + index.ts)

- event-core
- knowledge-core
- namespace-core

## Modules in ARCHITECTURE.md "Fully Complete" list

- identity
- account
- workspace
- finance
- organization
- notification
- task

## Modules with confirmed MDDD scaffolding (application/domain/infrastructure/interfaces + ports/)

- account, ai, billing, identity, organization, workspace

## Module investigation checklist

- Read the module index.ts first.
- Confirm domain/application/infrastructure/interfaces folders exist.
- Verify whether Firebase repositories are real implementations or placeholders.
- Check whether actions and hooks are thin adapters or contain business logic.

## Previously recorded but NOT present in this workspace snapshot

- knowledge (lives in core/knowledge-core, not a standalone module/)
- retrieval (not present as standalone module in this branch)
- taxonomy (not present in this branch)
