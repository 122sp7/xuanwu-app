---
name: resume-delivery
description: Resume a delivery workflow from a specific stage after interruption or context reset.
agent: ask
argument-hint: Provide current stage, plan reference, current change summary, outstanding findings, and desired next action.
---

# Resume Delivery

Reconstruct the current delivery state and route the work to the correct next stage.

## Inputs to capture

- Current stage
- Plan reference or plan text
- Current code or documentation change summary
- Outstanding review or QA findings
- Desired next action

## Requirements

- Use [handoff-matrix.md](../../docs/development-reference/reference/ai/handoff-matrix.md) to determine the valid next stage.
- If the delivery state is unclear, ask the minimum questions needed to reconstruct it.
- Recommend the correct next prompt or agent handoff.
- If enough information is available, provide a ready-to-send next-stage prompt.

## Output

Return:

1. reconstructed delivery state,
2. recommended next stage,
3. missing information if any,
4. and the exact next prompt to run.