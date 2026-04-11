---
description: 'Consolidated process framework for branch scope, commit quality, Cockburn delivery loop, and Occam parsimony decisions.'
applyTo: '**/*'
---

# Process Framework

## Branch and PR Scope

- Keep one concern per branch and PR.
- Name branches by intent and scope.
- Do not mix architecture refactor with unrelated feature work.

## Commit Quality

- Keep commit subject concise and action-oriented.
- Reference scope (module/runtime) in commit body when relevant.
- Include validation evidence for non-trivial changes.
- Avoid vague subjects and mixed unrelated changes.

## Cockburn Delivery Loop

1. Collaborate: align vocabulary, ownership, and expected behavior.
2. Deliver: ship a small increment with observable value.
3. Reflect: inspect implementation and handoff learnings.
4. Improve: adjust code, process, or docs based on evidence.

## Method Weight Rules

- Use the lightest process that still controls risk.
- Remove ceremony that does not improve communication, feedback, or quality.

## Occam Decision Rules

- Prefer options with fewer assumptions when outcomes are comparable.
- Remove assumptions before removing evidence.
- Add abstraction/layers/docs only when they protect real boundaries or repeated change pressure.
- Reintroduce complexity only after new evidence appears.

## PR Checkpoints

- State what changed and why.
- State what assumption was removed.
- State what complexity remains and why.
- State validation proving the chosen path still works.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill alistair-cockburn
#use skill occams-razor
