---
title: Update AI customizations
description: Maintenance guide for changing the Xuanwu Copilot Delivery Suite without breaking workflow contracts.
---

# Update AI customizations

This guide is for maintainers who need to change agents, prompts, baseline instructions, or planning contract documents.

## Update order

When changing the delivery workflow, update files in this order:

1. authoritative references,
2. planning contract documents,
3. agents,
4. prompts,
5. operational docs and index pages.

## If you change the plan structure

Update all of the following in the same change:

- [implementation-plan-template.md](../../reference/ai/implementation-plan-template.md)
- [plan-schema.md](../../reference/ai/plan-schema.md)
- [.github/agents/planner.agent.md](../../../.github/agents/planner.agent.md)
- planning prompts under [.github/prompts](../../../.github/prompts)
- any operational docs that explain planning or recovery

## If you change a handoff rule

Update all of the following in the same change:

- the relevant `.agent.md` file,
- [handoff-matrix.md](../../reference/ai/handoff-matrix.md),
- [agentic-delivery-model.md](../../explanation/ai/agentic-delivery-model.md) if rationale changed,
- recovery guidance if the valid re-entry path changed.

## If you add or retire an asset

Update all of the following in the same change:

- [customizations-index.md](../../reference/ai/customizations-index.md)
- [legacy-customizations-migration.md](../../reference/ai/legacy-customizations-migration.md) when applicable
- README or contributing guidance if contributor-facing entry points changed

## Validation expectations

- Check links between docs and customization files.
- Ensure agent and prompt names match the intended invocation model.
- Keep authoritative sources and workflow docs aligned.