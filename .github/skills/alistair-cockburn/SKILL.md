---
name: alistair-cockburn
description: >-
  Alistair Cockburn style skillbook. Use when choosing process weight, writing use cases,
  simplifying collaboration, or reviewing whether architecture and workflow stay human-centered and fit for purpose.
user-invocable: true
disable-model-invocation: false
---

# Alistair Cockburn

Use this skill when the problem is not only technical structure but also collaboration, method weight, requirements framing, or delivery rhythm.

## Research Basis

Context7 availability note:

1. No strong Context7 library entry exists for Cockburn as a person or for the Heart of Agile as a concept, so the skill is grounded primarily in web sources.

Web-verified:

1. Alistair Cockburn is an Agile Manifesto co-author, major use-case author, Crystal methodology creator, and the originator of Hexagonal Architecture.
2. Heart of Agile reduces practice to four imperatives: Collaborate, Deliver, Reflect, Improve.
3. Heart of Agile is explicitly presented as a simplification and a community of ideas, not a heavyweight method.

## Core Stance

Software development is a cooperative game of invention and communication.

That implies two simultaneous goals:

1. deliver working software now,
2. leave the codebase and the team in shape for the next round of work.

If a decision helps the current change but makes the next change harder to understand, negotiate, or test, it is suspect.

## Four Moves

Use Cockburn's four moves as the default operating loop:

1. Collaborate: align vocabulary, boundaries, and expected behavior with the right people.
2. Deliver: ship a small but real increment that can be evaluated.
3. Reflect: inspect what was learned from the increment and from the handoffs.
4. Improve: adjust code, process, or communication based on that evidence.

## Use-Case Guidance

Prefer user-goal use cases over technical step lists.

Write use cases as behavior contracts between stakeholders and the system:

1. identify the primary actor,
2. state the goal in business language,
3. write the main success scenario,
4. add only meaningful extensions and failure branches,
5. keep storage, framework, and transport details out of the use case itself.

If a use case reads like controller code or database choreography, it is at the wrong level.

## Crystal Guidance

Use the lightest method that is sufficient for the team, risk, and domain.

Favor these Crystal-style properties:

1. frequent delivery,
2. reflective improvement,
3. focus,
4. personal safety,
5. direct communication,
6. a technical environment that supports rapid feedback.

Method is a means, not the product. Process that becomes theater should be cut.

## Architectural Consequence

Cockburn's architecture contribution is practical, not decorative:

1. keep the application core insulated from UI, persistence, and external systems,
2. let ports define the conversation the core expects,
3. let adapters deal with technology and integration detail,
4. preserve replaceability only where that replaceability matters.

Use architecture to support conversation and delivery, not to win purity contests.

## Xuanwu Translation

In this repo, applying Cockburn means:

1. start with docs authority and shared language before coding,
2. keep one concern per branch or PR,
3. keep `app/` and `interfaces/` thin where possible,
4. prefer explicit ownership and readable handoffs over clever indirection,
5. choose the lightest structure that still protects the next change.

## Anti-Patterns

- Heavier process than the team or task needs.
- Architecture work detached from delivery pressure.
- Use cases written in transport or persistence language.
- PRs that mix unrelated goals and destroy focus.
- Naming that forces humans to decode intent from implementation.
- Review behavior that punishes questions instead of reducing ambiguity.

## Review Questions

1. Does this change improve both current delivery and the next round of work?
2. Is the language understandable to the real stakeholders of the feature?
3. Is the chosen process or structure the lightest thing that will work?
4. Are we documenting behavior and decisions, or just recording technical noise?
5. Did we add ceremony where better conversation would have solved the problem?

## Output Contract

When this skill is used, provide:

1. the delivery goal,
2. the collaboration or communication bottleneck,
3. the lightest sufficient process or structure,
4. any use-case or boundary rewrite needed,
5. the next feedback loop to run.
