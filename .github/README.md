# .github Copilot Configuration Map

This document records the active and scaffolded VS Code Copilot customization layout in this repository.

## Recommended entrypoint

- Start with `.github/agents/commander.agent.md` for most repository tasks.
- Use direct agent entry only when the workflow is already obvious:
  - `planner` for plan-only work
  - `implementer` for code changes
  - `reviewer` for findings-first review
  - `vsa-mddd-planner` / `vsa-mddd-implementer` for explicit migration work
- Let `commander` route to hidden specialist agents when billing, Firestore, or RAG expertise is needed.

## Official path mapping

| Mechanism | Official path pattern | Trigger mode |
| --- | --- | --- |
| Always-on instructions | `.github/copilot-instructions.md` and root `AGENTS.md` | automatic |
| File-based instructions | `.github/instructions/*.instructions.md` | `applyTo` glob match |
| Prompt files | `.github/prompts/*.prompt.md` | manual slash command |
| Custom agents | `.github/agents/*.agent.md` | agent picker, handoff, or subagent |
| Hooks | `.github/hooks/*.json` | agent lifecycle event |
| Skills | `.github/skills/<name>/SKILL.md` | on-demand or automatic load |
| Browser coding-agent MCP templates | `.github/copilot/*` | manual copy into GitHub repository settings |
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
- `.github/instructions/skill-usage.instructions.md`

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
- `.github/agents/commander.agent.md`
- `.github/agents/vsa-mddd-implementer.agent.md`
- `.github/agents/vsa-mddd-planner.agent.md`
- `.github/agents/planner.agent.md`
- `.github/agents/implementer.agent.md`
- `.github/agents/reviewer.agent.md`
- `.github/agents/rag-architect.agent.md`
- `.github/agents/firestore-guard.agent.md`
- `.github/agents/billing-auditor.agent.md`

The agent workflow is now commander-first:

- `commander` is the recommended entrypoint. It loads repo context, routes work to the right agent, and keeps users from having to choose the best specialist up front.
- `planner`, `implementer`, and `reviewer` remain the visible general-purpose workflow for direct access when the route is already obvious.
- `vsa-mddd-planner` and `vsa-mddd-implementer` remain visible for architecture migration work and explicit handoff-based flows.
- `billing-auditor`, `firestore-guard`, and `rag-architect` are hidden specialist subagents (`user-invocable: false`, `disable-model-invocation: true`) so they can still be routed by `commander` without crowding the picker or being selected accidentally.
- `disable-model-invocation: true` blocks those specialists from general subagent selection. `commander` can still dispatch them because it explicitly allowlists them in its `agents:` frontmatter.
- All custom agents now pin `model: 'Claude Sonnet 4.5'` for more consistent VS Code behavior across planning, implementation, and review flows.

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

### Browser coding-agent MCP templates
- `.github/copilot/serena-coding-agent-mcp.json`
- `.github/copilot/serena-browser-setup.md`

### Hooks
- `.github/hooks/README.md`
- `.github/hooks/guardrails.json`

The active hook set is intentionally minimal. This repository enables one guardrail hook that intercepts obviously destructive terminal commands and asks for explicit human review before they run.

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
- `commander.agent.md` is the repo entrypoint for agent routing. It relies on VS Code custom-agent `agents` + `agent` tool support to dispatch planner / implementer / reviewer / specialist work.
- `.github/instructions/skill-usage.instructions.md` documents when to use explicit `Use skill: ...` references so agent bodies, prompts, and README guidance stay consistent.
- Active GitHub Copilot coding-agent MCP servers assumed by this repository are `filesystem`, `memory`, `repomix`, `next-devtools`, `shadcn`, and `serena`.
- Browser coding-agent MCP is configured in repository settings on GitHub.com. Files in `.github/copilot/` are source-of-truth templates and runbooks for that settings payload.
- Deployment and rule-test workflows are intentionally scaffold-level. They are valid workflow files, but they still need environment secrets, deployment targets, and stronger test commands before they should be treated as enforcement.
- Plugin packaging and agentic workflow markdown files are not added yet. For this repository, workspace-level instructions, agents, skills, and a single safety hook currently provide higher value than introducing another distribution layer or `gh aw` compilation flow.

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
