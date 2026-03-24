---
title: AI customizations index
description: Reference index for the Xuanwu Copilot Delivery Suite, including authoritative files, workflow agents, prompts, skills, and legacy assets.
---

# AI customizations index

This page is the reference inventory for the Xuanwu Copilot Delivery Suite. Use it to understand which customizations are authoritative, which ones are operational entry points, and which older assets are being phased out.

## Scope boundary

This page is the docs-side mirror and explanation layer for AI customization assets.

- Use `.github/` files as the operative source of truth for active behavior.
- Use this docs page to explain routing, ownership, maintenance policy, and lifecycle status.
- Do not restate full agent, prompt, instruction, or skill bodies here unless the explanation itself is the point.
- If docs and `.github/` disagree, `.github/` wins for runtime behavior and this page must be updated.

## Authoritative baseline

| Asset | Type | Responsibility | Notes |
| --- | --- | --- | --- |
| [.github/README.md](../../../../.github/README.md) | Directory index | Root inventory for `.github/` folders, canonical entries, and link policy | Start here when routing inside `.github/` |
| [AGENTS.md](../../../../AGENTS.md) | Always-on instructions | Repository-wide operating rules shared across agents | Primary repository contract |
| [CLAUDE.md](../../../../CLAUDE.md) | Always-on instructions | Claude-compatible repository instructions | Keep aligned with `AGENTS.md` |
| [.github/copilot-instructions.md](../../../../.github/copilot-instructions.md) | Always-on Copilot baseline | Copilot-specific delivery baseline and workflow routing | Primary Copilot entry point |
| [agents/knowledge-base.md](../../../../agents/knowledge-base.md) | Reference knowledge | MDDD structure, ownership, import boundaries | Canonical architecture summary |
| [agents/commands.md](../../../../agents/commands.md) | Command reference | Validation and runtime commands | Canonical command source |

## Delivery workflow agents

| Asset | Stage | Responsibility | Allowed edits |
| --- | --- | --- | --- |
| [.github/agents/planner.agent.md](../../../../.github/agents/planner.agent.md) | Planning | Clarify scope, map ownership, and produce implementation plans | No |
| [.github/agents/implementer.agent.md](../../../../.github/agents/implementer.agent.md) | Implementation | Execute approved plan tasks and validation | Yes |
| [.github/agents/reviewer.agent.md](../../../../.github/agents/reviewer.agent.md) | Review | Evaluate correctness, architecture, risk, and missing validation | No |
| [.github/agents/qa.agent.md](../../../../.github/agents/qa.agent.md) | QA | Verify behavior, evidence, residual risk, and delivery readiness | No |

## Specialized Custom Agents

| Asset | Focus | Responsibility | Allowed edits |
| --- | --- | --- | --- |
| [.github/agents/modules-boundary-steward.agent.md](../../../../.github/agents/modules-boundary-steward.agent.md) | `modules/` MDDD work | Own module selection, layer placement, API-boundary enforcement, import discipline, and validation for changes inside `modules/` | Yes |

## Delivery prompts

| Asset | Primary use | Typical entry point |
| --- | --- | --- |
| [.github/prompts/plan-feature.prompt.md](../../../../.github/prompts/plan-feature.prompt.md) | Plan a feature or structured enhancement | New feature delivery |
| [.github/prompts/plan-bugfix.prompt.md](../../../../.github/prompts/plan-bugfix.prompt.md) | Plan a bug fix with reproduction and regression framing | Bug investigation |
| [.github/prompts/implement-plan.prompt.md](../../../../.github/prompts/implement-plan.prompt.md) | Execute a saved implementation plan | Re-entry at implementation stage |
| [.github/prompts/review-changes.prompt.md](../../../../.github/prompts/review-changes.prompt.md) | Review changes against plan, boundaries, and validation | Independent review rerun |
| [.github/prompts/run-qa.prompt.md](../../../../.github/prompts/run-qa.prompt.md) | Execute QA verification against scope and evidence requirements | Independent QA rerun |
| [.github/prompts/resume-delivery.prompt.md](../../../../.github/prompts/resume-delivery.prompt.md) | Resume an interrupted delivery workflow | Recovery |

## Planning contract reference

| Asset | Responsibility |
| --- | --- |
| [implementation-plan-template.md](./implementation-plan-template.md) | Canonical Markdown skeleton for formal implementation plans |
| [plan-schema.md](./plan-schema.md) | Field-level semantics, required sections, and acceptance rules for plans |
| [handoff-matrix.md](./handoff-matrix.md) | Formal stage transitions and re-entry rules |

## Operational guidance

| Asset | Audience | Purpose |
| --- | --- | --- |
| [.github/README.md](../../../../.github/README.md) | Maintainers and contributors | Root entry for `.github/` navigation, canonical entries, and link policy |
| [start-feature-delivery.md](../../../how-to-user/how-to/ai/start-feature-delivery.md) | Contributors | Start a formal delivery workflow |
| [recover-agent-flow.md](../../../how-to-user/how-to/ai/recover-agent-flow.md) | Contributors | Recover after interruption or context reset |
| [update-customizations.md](../../../how-to-user/how-to/ai/update-customizations.md) | Maintainers | Update agents, prompts, and planning contracts safely |
| [agentic-delivery-model.md](../../../diagrams-events-explanations/explanation/ai/agentic-delivery-model.md) | Maintainers and reviewers | Explain the design model and rationale |
| [legacy-customizations-migration.md](./legacy-customizations-migration.md) | Maintainers | Track legacy asset replacement and removal |

## Existing specialized skills

These skills remain authoritative for domain-specific guidance and are reused by the delivery suite:

- [.github/skills/xuanwu-mddd-boundaries/SKILL.md](../../../../.github/skills/xuanwu-mddd-boundaries/SKILL.md)
- [.github/skills/xuanwu-development-contracts/SKILL.md](../../../../.github/skills/xuanwu-development-contracts/SKILL.md)
- [.github/skills/xuanwu-rag-runtime-boundary/SKILL.md](../../../../.github/skills/xuanwu-rag-runtime-boundary/SKILL.md)
- [.github/skills/vercel-react-best-practices/SKILL.md](../../../../.github/skills/vercel-react-best-practices/SKILL.md)

## Legacy assets

| Asset | Current status | Replacement |
| --- | --- | --- |
| [.github/agents/qa-subagent.agent.md](../../../../.github/agents/qa-subagent.agent.md) | Legacy QA persona hidden from picker and subagent routing pending retirement | [.github/agents/qa.agent.md](../../../../.github/agents/qa.agent.md) |

## Ownership and update policy

- Update this index whenever a delivery agent, planning contract, or operational how-to is added, renamed, or retired.
- Keep this page aligned with [.github/README.md](../../../../.github/README.md), [.github/copilot-instructions.md](../../../../.github/copilot-instructions.md), and [legacy-customizations-migration.md](./legacy-customizations-migration.md).
- Keep explanations and inventories here concise; keep executable or discoverable customization definitions in `.github/`.
- Treat any undocumented customization as non-authoritative until it is indexed here or intentionally documented elsewhere.
