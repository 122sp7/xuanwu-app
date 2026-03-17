# Module Index

Feature modules currently present under modules/:
- account
- ai
- audit
- billing
- finance
- identity
- knowledge
- notification
- organization
- retrieval
- task
- taxonomy
- workspace

Modules explicitly described in ARCHITECTURE.md as implemented:
- identity
- account
- workspace
- finance
- organization
- notification
- task

Module investigation checklist:
- Read the module index.ts first.
- Confirm domain/application/infrastructure/interfaces folders exist.
- Verify whether Firebase repositories are real implementations or placeholders.
- Check whether actions and hooks are thin adapters or contain business logic.
