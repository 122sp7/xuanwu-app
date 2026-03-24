---
title: Recover an interrupted agent flow
description: How to recover the formal Copilot delivery workflow after interruption, context reset, or stage-specific reruns.
---

# Recover an interrupted agent flow

Use this guide when the formal delivery workflow was interrupted or needs to resume from a later stage.

## Common recovery cases

### Case 1: Planning is done, but implementation has not started or the session was lost

- Use `/implement-plan`.
- Provide the plan file or paste the plan text.

### Case 2: Implementation is partially complete and review must restart

- Use `/review-changes`.
- Provide the plan reference and a concise change summary.

### Case 3: Review passed, but QA must rerun

- Use `/run-qa`.
- Provide the plan reference, current change summary, and any known risk areas.

### Case 4: The stage is unclear or the chat history is polluted

- Use `/resume-delivery`.
- Provide the last known stage, plan reference, and any outstanding findings.

## Recovery rules

- Do not restart from Planner unless scope, owner, runtime, or validation requirements changed materially.
- Do not use QA to infer missing implementation state. Reconstruct the stage first.
- If the plan cannot be located or no longer reflects the intended scope, rerun planning explicitly instead of guessing.
- Prefer a durable saved plan reference over chat history when reconstructing delivery state across sessions.

## Related references

- [handoff-matrix.md](../../reference/ai/handoff-matrix.md)
- [customizations-index.md](../../reference/ai/customizations-index.md)