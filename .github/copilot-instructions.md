# Xuanwu Copilot Delivery Suite

Use this file as the Copilot-specific baseline for all work in this repository.

## Authoritative Sources

- Read [AGENTS.md](../AGENTS.md) for repository-wide operating rules.
- Read [CLAUDE.md](../CLAUDE.md) for cross-agent compatibility guidance.
- Read [agents/knowledge-base.md](../agents/knowledge-base.md) for module ownership, package aliases, and MDDD boundaries.
- Read [agents/commands.md](../agents/commands.md) for build, lint, and deployment commands.
- Read [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution and validation expectations.
- Read [docs/reference/development-contracts/overview.md](../docs/reference/development-contracts/overview.md) and [docs/explanation/development-contract-governance.md](../docs/explanation/development-contract-governance.md) when a workflow is contract-governed.

## Core Delivery Rules

- For cross-module, cross-runtime, or contract-governed work, plan before implementation.
- Start formal delivery work with the Planner agent or one of the planning prompts.
- Treat the implementation plan as the canonical execution contract for the current task.
- Persist approved plans explicitly when work must survive a chat reset or cross-session handoff.
- Keep implementation inside the approved scope, non-goals, and validation plan.
- Update documentation in the same change whenever runtime ownership, boundaries, acceptance gates, or public APIs change.

## Delivery Chain

Use the formal delivery chain for non-trivial work:

1. Planner
2. Implementer
3. Reviewer
4. QA

Use re-entry prompts when a session needs to restart or a stage must be rerun independently.

## Skill Routing

- Use [xuanwu-mddd-boundaries](skills/xuanwu-mddd-boundaries/SKILL.md) for module ownership, layer placement, and import-boundary questions.
- Use [xuanwu-development-contracts](skills/xuanwu-development-contracts/SKILL.md) for contract-first workflows and acceptance gates.
- Use [xuanwu-rag-runtime-boundary](skills/xuanwu-rag-runtime-boundary/SKILL.md) for RAG ownership across Next.js and `py_fn`.
- Use [vercel-react-best-practices](skills/vercel-react-best-practices/SKILL.md) when working in React or Next.js UI paths that need performance or rendering guidance.

## Validation

- Use the commands listed in [agents/commands.md](../agents/commands.md).
- At minimum, run the validation that matches the files changed.
- Use Chat customization diagnostics when a prompt, agent, or instruction does not appear to load or route correctly.
- Do not mark work complete if the plan's required validation or documentation updates are still pending.