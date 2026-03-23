---
title: Start feature delivery with Copilot
description: How to use the Xuanwu Copilot Delivery Suite for a formal feature workflow.
---

# Start feature delivery with Copilot

Use this workflow when the requested change is non-trivial, crosses module boundaries, changes a public workflow, or needs formal review and QA gates.

## When to use this flow

Use the formal delivery flow when one or more of the following are true:

- the change touches more than one module or package,
- the change affects runtime ownership,
- a contract-governed workflow is involved,
- the change needs explicit review and QA evidence,
- or the task is large enough that implementation should not begin from an ad hoc chat summary.

## Start the workflow

1. Open a fresh chat session.
2. Run `/plan-feature`.
3. Provide the request, constraints, and any relevant file or document context.
4. Review the implementation plan before starting implementation.

## Move through the stages

1. Planner produces the formal plan.
2. Use the `Start Implementation` handoff or run `/implement-plan`.
3. After implementation, use the `Review Implementation` handoff or run `/review-changes`.
4. After review passes, use the `Run QA` handoff or run `/run-qa`.

## What “done” means

The workflow is complete when all of the following are true:

- required implementation tasks are complete,
- required validation has actually run,
- required docs are updated,
- review findings are cleared or explicitly accepted,
- QA has produced evidence and a release recommendation.

## Related references

- [implementation-plan-template.md](../../reference/ai/implementation-plan-template.md)
- [plan-schema.md](../../reference/ai/plan-schema.md)
- [handoff-matrix.md](../../reference/ai/handoff-matrix.md)