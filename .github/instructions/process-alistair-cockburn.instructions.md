---
description: 'Human-centered delivery rules using Cockburn principles: collaborate, deliver, reflect, improve.'
applyTo: '**/*'
---

# Process Alistair Cockburn

## Core Stance

- Development is a cooperative game: optimize for shipping now and making the next change easier.
- If a choice helps current delivery but harms future readability, testability, or handoff, reject or revise it.

## Four-Move Loop

1. Collaborate: align vocabulary, ownership, and expected behavior before coding.
2. Deliver: ship a small real increment with observable value.
3. Reflect: inspect what was learned from implementation and handoff.
4. Improve: update code/process/docs based on evidence.

## Use-Case Writing Rules

- Prefer user-goal use cases over technical step lists.
- Write each use case as a behavior contract: actor, goal, main success scenario, meaningful failure branches.
- Keep storage/framework/transport details out of use-case text.

## Method Weight Rules

- Use the lightest process that still controls risk.
- Remove ceremony that does not improve communication, feedback, or quality.
- Keep one concern per branch and PR.

## Review Questions

1. Does this change improve both current delivery and future changeability?
2. Is the language understandable to real stakeholders?
3. Is there unnecessary process weight for this task?
4. Are we documenting decisions, not technical noise?

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill alistair-cockburn
