# Xuanwu Agents

This folder contains the active workspace custom agents for VS Code Copilot.

## Active Agent Set

Use these files for role-specific routing only; repository-wide policy belongs in [`../copilot-instructions.md`](../copilot-instructions.md).

- Architecture and boundaries: `domain-architect.agent.md`, `mddd-architect.agent.md`, `domain-lead.agent.md`
- Next.js and UI: `app-router.agent.md`, `server-action-writer.agent.md`, `frontend-lead.agent.md`, `shadcn-composer.agent.md`
- Data / Firebase / security: `firestore-schema.agent.md`, `security-rules.agent.md`, `schema-migration.agent.md`
- AI / RAG: `ai-genkit-lead.agent.md`, `genkit-flow.agent.md`, `rag-lead.agent.md`, `doc-ingest.agent.md`, `chunk-strategist.agent.md`, `embedding-writer.agent.md`
- Quality and docs: `quality-lead.agent.md`, `lint-rule-enforcer.agent.md`, `e2e-qa.agent.md`, `test-scenario-writer.agent.md`, `prompt-engineer.agent.md`, `kb-architect.agent.md`

## Supporting Indexes

- [`commands.md`](./commands.md) — build, lint, test, and deployment commands
- [`knowledge-base.md`](./knowledge-base.md) — module inventory, aliases, and boundary facts

## Maintenance Rules

- Keep agent names unique and role-scoped.
- Keep tools least-privilege and remove stale skill tags when the referenced skills are not installed.
- Keep module-specific guides in `modules/<context>/AGENT.md`, not in `.github/agents/`.
- Update repomix-generated skills after meaningful `.github/*` changes.
