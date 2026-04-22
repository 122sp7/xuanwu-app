# 04-examples Agent Rules

## Purpose

- Canonical examples index for single-context feature samples and cross-context end-to-end flows.
- Keep examples concise, ownership-clear, and link-stable.

## Legacy (verbatim)

### Source: docs/_archive/examples/modules/feature/AGENTS.md

```markdown
# Feature Docs Agent Rules

## ROLE

- The agent MUST treat this directory as the example surface for single-context feature narratives.
- The agent MUST keep examples focused on one bounded context capability at a time.

## DOMAIN BOUNDARIES

- The agent MUST emphasize what a feature does inside its owning context.
- The agent MUST NOT expand these examples into cross-context orchestration documents.

## TOOL USAGE

- The agent MUST keep links valid and examples concise.
- The agent MUST align terminology with strategic docs.

## EXECUTION FLOW

- The agent MUST identify the owning bounded context first.
- The agent MUST describe actor, goal, and result before lower-level detail.

## CONSTRAINTS

- The agent MUST keep feature examples semantic-first and context-local.

## Route Here When

- You document a single bounded context feature or use case example.

## Route Elsewhere When

- Cross-context orchestration flows: [../../end-to-end/deliveries/AGENTS.md](../../end-to-end/deliveries/AGENTS.md)

```

### Source: docs/_archive/examples/end-to-end/deliveries/AGENTS.md

```markdown
# Deliveries Agent Rules

## ROLE

- The agent MUST treat this directory as the example surface for cross-context delivery flows.
- The agent MUST keep examples focused on orchestration, handoff, and sequence.

## DOMAIN BOUNDARIES

- The agent MUST emphasize how contexts are connected, not their internal implementation details.
- The agent MUST keep flow examples event- and responsibility-oriented.

## TOOL USAGE

- The agent MUST keep links valid and examples concise.
- The agent MUST align terminology with strategic docs.

## EXECUTION FLOW

- The agent MUST identify participating contexts first.
- The agent MUST describe sequence, handoff, and failure boundaries before detail.

## CONSTRAINTS

- The agent MUST avoid turning delivery docs into low-level architecture manuals.

## Route Here When

- You document a cross-context delivery, saga, or end-to-end handoff flow.

## Route Elsewhere When

- Single-context feature examples: [../../modules/feature/AGENTS.md](../../modules/feature/AGENTS.md)

```
