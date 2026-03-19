# .github Copilot Configuration Map

This document records the active and scaffolded VS Code Copilot customization layout in this repository.

## Official path mapping

| Mechanism | Official path pattern | Trigger mode |
| --- | --- | --- |
| Always-on instructions | `.github/copilot-instructions.md` and root `AGENTS.md` | automatic |
| File-based instructions | `.github/instructions/*.instructions.md` | `applyTo` glob match |
| Prompt files | `.github/prompts/*.prompt.md` | manual slash command |
| Custom agents | `.github/agents/*.agent.md` | agent picker, handoff, or subagent |
| Hooks | `.github/hooks/*.json` | agent lifecycle event |
| Skills | `.github/skills/<name>/SKILL.md` | on-demand or automatic load |
| GitHub issue forms | `.github/ISSUE_TEMPLATE/*.yml` | new issue chooser |
| GitHub workflows | `.github/workflows/*.yml` | GitHub Actions |

## Current inventory

### Always-on instructions
- `.github/copilot-instructions.md`
- `AGENTS.md`

### File-based instructions
- `.github/instructions/context-engineering.instructions.md`
- `.github/instructions/copilot-config.instructions.md`
- `.github/instructions/performance-optimization.instructions.md`
- `.github/instructions/mddd-migration.instructions.md`
- `.github/instructions/nextjs-ui.instructions.md`
- `.github/instructions/nextjs-tailwind.instructions.md`
- `.github/instructions/typescript.instructions.md`
- `.github/instructions/nextjs-app-router.instructions.md`
- `.github/instructions/react-components.instructions.md`
- `.github/instructions/genkit-flows.instructions.md`
- `.github/instructions/firestore.instructions.md`
- `.github/instructions/state-machine.instructions.md`
- `.github/instructions/billing.instructions.md`
- `.github/instructions/cloud-functions.instructions.md`

### Prompt files
- `.github/prompts/implement-vsa-mddd.prompt.md`
- `.github/prompts/plan-file-module-mddd.prompt.md`
- `.github/prompts/plan-vsa-mddd.prompt.md`
- `.github/prompts/refresh-migration-context.prompt.md`
- `.github/prompts/scaffold-feature.prompt.md`
- `.github/prompts/scaffold-genkit-flow.prompt.md`
- `.github/prompts/scaffold-wbs-task.prompt.md`
- `.github/prompts/scaffold-billing-cycle.prompt.md`
- `.github/prompts/scaffold-ticket.prompt.md`
- `.github/prompts/ingest-knowledge.prompt.md`
- `.github/prompts/review-security-rules.prompt.md`
- `.github/prompts/analyze-codebase.prompt.md`
- `.github/prompts/add-shadcn-component.prompt.md`
- `.github/prompts/write-tests.prompt.md`

### Custom agents
- `.github/agents/vsa-mddd-implementer.agent.md`
- `.github/agents/vsa-mddd-planner.agent.md`
- `.github/agents/planner.agent.md`
- `.github/agents/implementer.agent.md`
- `.github/agents/reviewer.agent.md`
- `.github/agents/rag-architect.agent.md`
- `.github/agents/firestore-guard.agent.md`
- `.github/agents/billing-auditor.agent.md`

### Skills
- `.github/skills/awesome-rag-skill/SKILL.md`
- `.github/skills/chatbot-ui-skill/SKILL.md`
- `.github/skills/docmost-skill/SKILL.md`
- `.github/skills/google-cloud-skills-boost-skill/SKILL.md`
- `.github/skills/langchain-ai-skill/SKILL.md`
- `.github/skills/ragflow-skill/SKILL.md`
- `.github/skills/vsa-mddd-migration/SKILL.md`
- `.github/skills/vscode-docs-skill/SKILL.md`
- `.github/skills/xuanwu-skill/SKILL.md`
- `.github/skills/rag-pipeline/SKILL.md`
- `.github/skills/wbs-state-machine/SKILL.md`
- `.github/skills/billing-lifecycle/SKILL.md`
- `.github/skills/multitenancy/SKILL.md`

### Hooks
- `.github/hooks/README.md`
- `.github/hooks/format.json`
- `.github/hooks/session.json`

The current hook files are scaffold placeholders with empty hook arrays. They reserve official locations without enabling command execution yet.

### Issue and PR templates
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/bug.yml`
- `.github/ISSUE_TEMPLATE/feature.yml`
- `.github/ISSUE_TEMPLATE/task-wbs.yml`
- `.github/ISSUE_TEMPLATE/ticket-support.yml`
- `.github/ISSUE_TEMPLATE/billing-issue.yml`
- `.github/pull_request_template.md`

### Workflows
- `.github/workflows/copilot-setup-steps.yml`
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-preview.yml`
- `.github/workflows/deploy-production.yml`
- `.github/workflows/functions-deploy.yml`
- `.github/workflows/genkit-flow-test.yml`
- `.github/workflows/firestore-rules-test.yml`
- `.github/workflows/rag-index-sync.yml`

## Notes on scaffolded files

- `ci.yml` is an active baseline workflow that runs `npm run lint` and `npm run build`.
- `copilot-setup-steps.yml` remains the special GitHub Copilot coding-agent bootstrap workflow and still contains a single `copilot-setup-steps` job.
- Active GitHub Copilot coding-agent MCP servers assumed by this repository are `filesystem`, `memory`, `repomix`, `next-devtools`, and `shadcn`.
- Deployment and rule-test workflows are intentionally scaffold-level. They are valid workflow files, but they still need environment secrets, deployment targets, and stronger test commands before they should be treated as enforcement.

## Reference docs used for this scaffold

- VS Code custom instructions: `https://code.visualstudio.com/docs/copilot/customization/custom-instructions`
- VS Code prompt files: `https://code.visualstudio.com/docs/copilot/customization/prompt-files`
- VS Code custom agents: `https://code.visualstudio.com/docs/copilot/customization/custom-agents`
- VS Code agent skills: `https://code.visualstudio.com/docs/copilot/customization/agent-skills`
- VS Code hooks: `https://code.visualstudio.com/docs/copilot/customization/hooks`

## Maintenance rules

- Keep official suffixes and folders unchanged.
- Keep `SKILL.md` `name` values identical to their parent folder names.
- Prefer updating existing customizations before creating near-duplicate variants.
- Replace scaffold placeholders with real automation only when ownership, rollback, and validation are defined.
- Update this map whenever files are added, renamed, or removed.
