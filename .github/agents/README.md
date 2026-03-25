# Delivery Workflow Agents

Custom agents for the Xuanwu formal delivery chain: Plan → Implement → Review → QA.

## Mapping Baseline

- MCP routing baseline: [../mcp_to_agent_mapping.md](../mcp_to_agent_mapping.md)
- Visual routing map: [../mcp_to_agent_mapping.svg](../mcp_to_agent_mapping.svg)
- Existing delivery and module agents are extension lanes on top of this baseline.

## Delivery Chain

| Stage | Agent | File | Purpose |
| --- | --- | --- | --- |
| Planning | Planner | `planner.agent.md` | Clarify scope, map ownership, produce formal implementation plans |
| Planning (Docs Variant) | Planner Docs Flow | `planner-docs.agent.md` | Plan delivery and offer post-approval markdown optimization handoff |
| Implementation | Implementer | `implementer.agent.md` | Execute approved plans, run validation, update documentation |
| Review | Reviewer | `reviewer.agent.md` | Evaluate correctness, architecture, risk, missing validation |
| QA | QA | `qa.agent.md` | Verify scenarios, collect evidence, assess release readiness |

## Specialized Agents

| Agent | File | Focus | Purpose |
| --- | --- | --- | --- |
| Modules Architect | `modules-architect.agent.md` | Module lifecycle | Create, refactor, split, merge, delete modules under MDDD rules |
| Module Boundary Steward | `modules-boundary-steward.agent.md` | Module work governance | Enforce ownership, layer placement, API boundaries, imports |
| App Router Composer | `app-router-composer.agent.md` | App composition | Build `app/` route slices and parallel-route blocks that consume module APIs only |
| Modules API Surface Steward | `modules-api-surface-steward.agent.md` | Module public surface | Build `api/contracts.ts`, `api/facade.ts`, safe `interfaces/` usage, and clean `index.ts` exports |
| Repo Architect | `repo-architect.agent.md` | Project bootstrap | Scaffold agentic project structures for VS Code or CLI workflows |
| Serena Coding Agent | `serena.agent.md` | Serena-first execution | Activate project context, prefer symbol search, and keep edits localized |
| QA Legacy | `qa-legacy.agent.md` | Legacy QA workflows | Historical test planning, edge-case analysis, verification |
| Commander | `commander.agent.md` | MCP-aware orchestration | Route complex work with Serena-first discovery and Context7 confirmation |
| App Router Agent | `app-router.agent.md` | Runtime route diagnostics | Use Next DevTools MCP for app-router troubleshooting and fixes |
| Component Agent | `component.agent.md` | UI composition | Use shadcn MCP for component-focused implementation |
| RAG Vector Agent | `rag-vector.agent.md` | Ingest + retrieval prep | Use MarkItDown MCP and docs-backed decisions for RAG pipelines |
| E2E QA Agent | `e2e-qa.agent.md` | Browser verification | Use Playwright MCP to collect acceptance evidence |

## Quick Start

1. **For a feature**: Run `/plan-feature` → Planner produces plan → Use `Start Implementation` handoff to Implementer
2. **For a bug**: Run `/plan-bugfix` → Planner produces plan → Use `Start Implementation` handoff to Implementer
3. **For docs-heavy planning**: Use `Planner Docs Flow` when the task explicitly needs markdown optimization handoff
4. **After implementation**: Use `Review Implementation` handoff to Reviewer
5. **After review**: Use `Run QA` handoff to QA
6. **For module work**: Use `Modules Architect` for design, `Module Boundary Steward` for enforcement

## Related References

- [.github/README.md](../README.md) — Root entry for `.github/` navigation
- [../.github/skills/](../skills/) — Specialized capabilities and workflows
- [../.github/prompts/](../prompts/) — Slash-command entry points
- [../../AGENTS.md](../../AGENTS.md) — Repository-wide operating rules

## Maintenance Notes

- Keep handoff target names aligned with the visible custom agent names shown by VS Code diagnostics.
- Prefer least-privilege `tools` lists and avoid unsupported tool aliases.
- Use the Chat customization diagnostics view when an agent does not appear or a handoff fails to resolve.
- Keep app/modules-specialized agents at the top level when diagnostics show nested agent discovery is unavailable in the current workspace behavior.
