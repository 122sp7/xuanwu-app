---
name: plan-bugfix
description: Create a formal implementation plan for a bug fix, including reproduction, root cause framing, and regression risk.
agent: planner
argument-hint: Describe the bug, observed behavior, expected behavior, reproduction clues, and impacted areas.
---

# Plan Bugfix

Analyze the bug report and produce a formal implementation plan using [implementation-plan-template.md](../../docs/development-reference/reference/ai/implementation-plan-template.md).

## Requirements

- Capture reproduction summary in the request or current-state sections.
- State the suspected root cause if enough evidence exists; otherwise make the uncertainty explicit.
- Include regression risk in the risks section.
- Define validation that proves the failing scenario is fixed and nearby behavior still works.
- Follow [plan-schema.md](../../docs/development-reference/reference/ai/plan-schema.md).

## Output

Return the completed implementation plan only, followed by a short note stating whether the bug is sufficiently understood to start implementation.