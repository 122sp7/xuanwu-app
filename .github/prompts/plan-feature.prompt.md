---
name: plan-feature
description: Create a formal implementation plan for a feature or scoped enhancement.
agent: planner
argument-hint: Describe the feature request, desired outcome, constraints, and any relevant links or files.
---

# Plan Feature

Analyze the feature request and produce a formal implementation plan using [implementation-plan-template.md](../../docs/reference/ai/implementation-plan-template.md).

## Requirements

- Ask up to 3 concise clarifying questions only when they materially change scope, ownership, or validation.
- Follow [plan-schema.md](../../docs/reference/ai/plan-schema.md).
- Identify owning modules, runtime ownership, risks, validation, and documentation updates.
- Keep non-goals explicit.
- If the workflow appears contract-governed, name the relevant contract from [development contracts overview](../../docs/reference/development-contracts/overview.md).

## Output

Return the completed implementation plan only, followed by a short note stating whether implementation can safely begin.