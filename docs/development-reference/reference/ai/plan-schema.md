---
title: Implementation plan schema
description: Required fields and field semantics for implementation plans in the Xuanwu Copilot Delivery Suite.
---

# Implementation plan schema

This schema defines the minimum structure that later stages in the delivery chain rely on. If a required field is missing, the Implementer should not begin formal execution until the gap is fixed.

## Required fields for all plans

| Section | Required | Why it is required |
| --- | --- | --- |
| Request summary | Yes | Gives every later stage a stable task identity |
| Scope | Yes | Defines what is allowed to change |
| Current state | Yes | Prevents implementation from assuming a blank slate |
| Target state | Yes | Defines the intended end condition |
| Owning modules and layers | Yes | Keeps work inside MDDD ownership rules |
| Runtime ownership | Yes | Prevents cross-runtime leakage |
| Contracts and invariants | Yes | Protects workflow boundaries and acceptance gates |
| Affected areas | Yes | Sets expectations for blast radius |
| Implementation tasks | Yes | Gives the Implementer an execution checklist |
| Validation plan | Yes | Gives Reviewer and QA concrete gates |
| Documentation updates | Yes | Prevents docs drift |
| Risks | Yes | Makes tradeoffs and release concerns explicit |
| Handoff notes for Implementer | Yes | Carries stage-specific execution constraints |

## Optional fields

| Section | When it can be omitted |
| --- | --- |
| Compatibility or rollback notes | Can be brief when no compatibility window exists |
| Open questions | Can be empty only if the Planner explicitly states there are no unresolved questions |

## Additional requirements for bugfix plans

Bugfix plans must add the following details inside the existing sections:

| Requirement | Where it belongs |
| --- | --- |
| Reproduction summary | Request summary or current state |
| Suspected root cause | Current state |
| Regression risk | Risks |
| Verification of the failing scenario | Validation plan |

## Section semantics

### Scope

The scope must clearly separate:

- what is being changed,
- what is intentionally deferred,
- and what adjacent work is explicitly not part of the task.

### Owning modules and layers

This section must map the change to concrete owners in `modules/`, `packages/`, or `app/`. Do not use generic labels such as "frontend" or "backend" without naming the actual owner.

### Runtime ownership

This section is required for anything that might touch:

- Next.js request handling,
- `py_fn`,
- Firebase write paths,
- background jobs,
- or external worker orchestration.

### Contracts and invariants

This section must name the governing contract when a contract-governed workflow is involved. If there is no formal contract, the Planner should state that explicitly instead of leaving the section vague.

### Validation plan

The validation plan must define both automated and manual checks when relevant. Avoid generic text such as "run tests" without naming which validation matters.

### Documentation updates

This section must list the files that should change if the implementation lands successfully. If no documentation updates are required, the plan should say why.

## Rejection rules for later stages

The Implementer should stop and request a plan revision when any of the following is true:

- the owner or runtime is unclear,
- the task checklist is missing,
- validation is too vague to execute,
- documentation impact is omitted,
- or the plan conflicts with a known contract or repository boundary.

The Reviewer should mark the implementation incomplete when code changes materially exceed the approved scope or when required validation and docs work were skipped.

The QA stage should mark release readiness as partial or blocked when the validation plan cannot be mapped to executed scenarios and evidence.