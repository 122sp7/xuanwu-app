# Delivery Workflow Agents

Custom agents for the Xuanwu formal delivery chain: Plan → Implement → Review → QA.

## Delivery Chain

| Stage | Agent | File | Purpose |
| --- | --- | --- | --- |
| Planning | Planner | `planner.agent.md` | Clarify scope, map ownership, produce formal implementation plans |
| Implementation | Implementer | `implementer.agent.md` | Execute approved plans, run validation, update documentation |
| Review | Reviewer | `reviewer.agent.md` | Evaluate correctness, architecture, risk, missing validation |
| QA | QA | `qa.agent.md` | Verify scenarios, collect evidence, assess release readiness |

## Specialized Agents

| Agent | File | Focus | Purpose |
| --- | --- | --- | --- |
| Modules Architect | `modules-architect.agent.md` | Module lifecycle | Create, refactor, split, merge, delete modules under MDDD rules |
| Module Boundary Steward | `modules-boundary-steward.agent.md` | Module work governance | Enforce ownership, layer placement, API boundaries, imports |
| Repo Architect | `repo-architect.agent.md` | Project bootstrap | Scaffold agentic project structures for VS Code or CLI workflows |
| QA Legacy | `qa-subagent.agent.md` | Legacy QA workflows | Historical test planning, edge-case analysis, verification |

## Quick Start

1. **For a feature**: Run `/plan-feature` → Planner produces plan → Use `Start Implementation` handoff to Implementer
2. **For a bug**: Run `/plan-bugfix` → Planner produces plan → Use `Start Implementation` handoff to Implementer
3. **After implementation**: Use `Review Implementation` handoff to Reviewer
4. **After review**: Use `Run QA` handoff to QA
5. **For module work**: Use `Modules Architect` for design, `Module Boundary Steward` for enforcement

## Related References

- [.github/README.md](../README.md) — Root entry for `.github/` navigation
- [../.github/skills/](../skills/) — Specialized capabilities and workflows
- [../.github/prompts/](../prompts/) — Slash-command entry points
- [../../AGENTS.md](../../AGENTS.md) — Repository-wide operating rules
