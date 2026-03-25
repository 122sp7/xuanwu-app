# Agents Decomposition Map

This folder contains the active decomposed agent set. Legacy sources from `.github/agents/xx` have been semantically consolidated and retired.

## Source-to-target mapping

| Source in xx | Decomposed targets |
| --- | --- |
| `serena.agent.md` | `serena-strategist.agent.md` |
| `commander.agent.md` | `tool-caller.agent.md`, `support-architect.agent.md` |
| `modules-architect.agent.md` | `mddd-architect.agent.md`, `billing-architect.agent.md` |
| `modules-boundary-steward.agent.md` | `domain-lead.agent.md` |
| `modules-api-surface-steward.agent.md` | `ts-interface-writer.agent.md`, `firestore-schema.agent.md` |
| `app-router.agent.md` | `app-router.agent.md`, `server-action-writer.agent.md` |
| `app-router-composer.agent.md` | `parallel-routes.agent.md`, `frontend-lead.agent.md` |
| `component.agent.md` | `shadcn-composer.agent.md` |
| `rag-vector.agent.md` | `rag-lead.agent.md`, `doc-ingest.agent.md`, `chunk-strategist.agent.md`, `embedding-writer.agent.md`, `genkit-flow.agent.md`, `ai-genkit-lead.agent.md` |
| `e2e-qa.agent.md` | `e2e-qa.agent.md`, `test-scenario-writer.agent.md` |
| `reviewer.agent.md` + `qa.agent.md` | `quality-lead.agent.md`, `lint-rule-enforcer.agent.md` |
| `planner-docs.agent.md` + `md-writer.agent.md` | `kb-architect.agent.md`, `prompt-engineer.agent.md` |
| `repo-architect.agent.md` | `cicd-deploy.agent.md`, `schema-migration.agent.md` |

## Target set

- `ai-genkit-lead.agent.md`
- `app-router.agent.md`
- `billing-architect.agent.md`
- `chunk-strategist.agent.md`
- `cicd-deploy.agent.md`
- `doc-ingest.agent.md`
- `domain-lead.agent.md`
- `e2e-qa.agent.md`
- `embedding-writer.agent.md`
- `firestore-schema.agent.md`
- `frontend-lead.agent.md`
- `genkit-flow.agent.md`
- `kb-architect.agent.md`
- `lint-rule-enforcer.agent.md`
- `mddd-architect.agent.md`
- `parallel-routes.agent.md`
- `prompt-engineer.agent.md`
- `quality-lead.agent.md`
- `rag-lead.agent.md`
- `schema-migration.agent.md`
- `security-rules.agent.md`
- `serena-strategist.agent.md`
- `server-action-writer.agent.md`
- `shadcn-composer.agent.md`
- `support-architect.agent.md`
- `test-scenario-writer.agent.md`
- `tool-caller.agent.md`
- `ts-interface-writer.agent.md`

## Migration Status

- Legacy source folder `xx/` was used as migration input only.
- Semantic value was merged into the target agents listed above.
- Keep future updates on target agents only; do not reintroduce `xx/` mirrors.

Tags: #use skill context7 #use skill .serena-mcp #use skill xuanwu-app-skill 
