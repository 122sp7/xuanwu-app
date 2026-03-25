---
name: implement-plan
description: Execute an approved implementation plan with the Implementer agent.
agent: Implementer
argument-hint: Provide a plan file, pasted plan text, or a summary of which plan tasks should be executed now.
---

# Implement Plan

Implement the approved plan.

## Requirements

- Treat the provided plan as the canonical execution contract.
- Execute only the tasks that are requested or approved.
- Respect the plan scope, non-goals, validation, and documentation updates.
- Stop and report any plan defect that blocks safe implementation.

## Output

Report:

- tasks completed,
- validation run,
- documentation updated,
- and any blockers or deviations.