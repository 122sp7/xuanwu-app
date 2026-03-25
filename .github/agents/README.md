# Agent Command Structure

Military-style operating map for `.github/agents`.

This file treats current agents as a command system with clear tiers, responsibilities, and retirement policy.

## Tier 0: Strategic Command (HQ)

| Agent | File | Role |
| --- | --- | --- |
| Serena Coding Agent | `serena.agent.md` | Primary execution backbone, symbolic workflow, MCP-aware routing |
| Commander | `commander.agent.md` | Multi-lane orchestration and MCP-first dispatch |

## Tier 1: Delivery Command Chain

| Stage | Agent | File | Role |
| --- | --- | --- | --- |
| Plan | Planner | `planner.agent.md` | Formal plan generation and scope locking |
| Implement | Implementer | `implementer.agent.md` | Plan execution and change delivery |
| Review | Reviewer | `reviewer.agent.md` | Risk-first correctness and boundary review |
| QA | QA | `qa.agent.md` | Evidence-driven verification and release recommendation |

## Tier 2: Domain Lead Lanes

| Domain | Agent | File | Role |
| --- | --- | --- | --- |
| App Composition | App Router Composer | `app-router-composer.agent.md` | App route slices and parallel-route composition |
| Module Lifecycle | Modules Architect | `modules-architect.agent.md` | Module create/refactor/split/merge/delete |
| Boundary Governance | Module Boundary Steward | `modules-boundary-steward.agent.md` | Ownership and dependency-direction enforcement |
| API Surface | Modules API Surface Steward | `modules-api-surface-steward.agent.md` | `modules/*/api` contracts, facades, safe exports |

## Tier 3: Specialist Feature Agents (MCP Lanes)

| Specialty | Agent | File | MCP focus |
| --- | --- | --- | --- |
| Next runtime | App Router Agent | `app-router.agent.md` | `io.github.vercel/next-devtools-mcp/*` |
| UI scaffolding | Component Agent | `component.agent.md` | `shadcn/*` |
| RAG ingest/retrieval | RAG Vector Agent | `rag-vector.agent.md` | `microsoft/markitdown/*`, `context7/*` |
| Browser acceptance | E2E QA Agent | `e2e-qa.agent.md` | `microsoft/playwright-mcp/*` |

## Tier 4: Support and Legacy Lanes

| Type | Agent | File | Policy |
| --- | --- | --- | --- |
| Docs planning variant | Planner Docs Flow | `planner-docs.agent.md` | Keep as optional extension for markdown-heavy work |
| Markdown optimization | md-writer | `md-writer.agent.md` | Keep as specialized post-plan optimizer |
| Customization authoring | Custom Agent Foundry | `custom-agent-foundry.agent.md` | Keep for agent/prompt/instruction authoring workflows |
| Repo bootstrap | Repo Architect Agent | `repo-architect.agent.md` | Keep as maintainer utility lane |
| Legacy QA persona | QA Legacy | `qa-legacy.agent.md` | Keep hidden; retire when no downstream dependency remains |

## Keep vs Retire Assessment

### Keep (core)

- `serena.agent.md`
- `commander.agent.md`
- `planner.agent.md`
- `implementer.agent.md`
- `reviewer.agent.md`
- `qa.agent.md`

### Keep (specialized)

- `app-router-composer.agent.md`
- `modules-architect.agent.md`
- `modules-boundary-steward.agent.md`
- `modules-api-surface-steward.agent.md`
- `app-router.agent.md`
- `component.agent.md`
- `rag-vector.agent.md`
- `e2e-qa.agent.md`

### Keep as optional support

- `planner-docs.agent.md`
- `md-writer.agent.md`
- `custom-agent-foundry.agent.md`
- `repo-architect.agent.md`

### Legacy / retirement candidate

- `qa-legacy.agent.md` (hidden lane; retain only for backward compatibility)

## Current File Tree

```text
.github/agents/
	app/
	app-router-composer.agent.md
	app-router.agent.md
	commander.agent.md
	component.agent.md
	custom-agent-foundry.agent.md
	e2e-qa.agent.md
	implementer.agent.md
	md-writer.agent.md
	modules/
	modules-api-surface-steward.agent.md
	modules-architect.agent.md
	modules-boundary-steward.agent.md
	planner-docs.agent.md
	planner.agent.md
	qa-legacy.agent.md
	qa.agent.md
	rag-vector.agent.md
	README.md
	repo-architect.agent.md
	reviewer.agent.md
	serena.agent.md
```

## Command Rules

1. Baseline mapping authority: `../mcp_to_agent_mapping.md` and `../mcp_to_agent_mapping.svg`.
2. New agents must justify a unique lane not already covered by Tier 1-3.
3. Keep handoff target names aligned to diagnostics-recognized visible agent names.
4. Keep tools least-privilege and MCP scopes explicit.
5. Do not move active top-level agents into nested folders unless diagnostics confirms discovery parity.
