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

- [implementation-plan-template.md](../../../development-reference/reference/ai/implementation-plan-template.md)
- [plan-schema.md](../../../development-reference/reference/ai/plan-schema.md)
- [.github/agents/planner.agent.md](../../../../.github/agents/planner.agent.md)
- planning prompts under [.github/prompts](../../../../.github/prompts)
- any operational docs that explain planning or recovery

## If you change a handoff rule

Update all of the following in the same change:

- the relevant `.agent.md` file,
- [handoff-matrix.md](../../../development-reference/reference/ai/handoff-matrix.md),
- [agentic-delivery-model.md](../../../diagrams-events-explanations/explanation/ai/agentic-delivery-model.md) if rationale changed,
- recovery guidance if the valid re-entry path changed.

## If you add or retire an asset

Update all of the following in the same change:

- [customizations-index.md](../../../development-reference/reference/ai/customizations-index.md)
- [legacy-customizations-migration.md](../../../development-reference/reference/ai/legacy-customizations-migration.md) when applicable
- README or contributing guidance if contributor-facing entry points changed

## Validation expectations

- Check links between docs and customization files.
- Ensure agent and prompt names match the intended invocation model.
- Ensure no active custom agents share the same visible name unless the duplication is intentional and documented.
- Use Chat customization diagnostics to confirm agents, prompts, instructions, and skills are discovered without errors.
- Add hooks only when deterministic lifecycle enforcement is required; document the hook rationale and affected stages in the same change.
- Keep authoritative sources and workflow docs aligned.