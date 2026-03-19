---
name: wbs-state-machine
description: Model work-breakdown tasks and delivery workflows as explicit states, transitions, and acceptance gates.
---

# WBS State Machine Skill

Use this skill when the task needs a durable workflow instead of loosely coupled booleans or ad hoc status fields.

## What to do

1. Name the business states and terminal states.
2. Define allowed transitions, triggers, guards, and side effects.
3. Keep machine context serializable and suitable for persistence or audit.
4. Identify who or what actor can trigger each transition.
5. Use the template to capture invariants before implementing code.

## Included resources

- [wbs-machine-template.md](./templates/wbs-machine-template.md)
