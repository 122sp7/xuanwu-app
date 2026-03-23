---
title: Agentic delivery model
description: Explanation of the Xuanwu Copilot Delivery Suite, including why delivery work is split across planning, implementation, review, and QA stages.
---

# Agentic delivery model

The Xuanwu Copilot Delivery Suite exists to make AI-assisted delivery predictable in a repository that already enforces MDDD, runtime boundaries, and contract-first workflows. The goal is not to add more personas. The goal is to stop complex work from collapsing into one long chat session with mixed responsibilities.

## Why a delivery model is needed

This repository already has strong architectural guidance, but architecture guidance alone does not tell an agent how to deliver a change end to end. Without a formal delivery model, the same session tends to mix:

- requirement discovery,
- plan creation,
- code writing,
- architecture review,
- and QA verification.

That mixing creates three common failures:

1. implementation starts before scope is stable,
2. review happens too late and becomes expensive,
3. QA evidence is reduced to a vague summary instead of a release gate.

## Why the workflow is split into four stages

The suite uses four delivery stages:

1. Planner
2. Implementer
3. Reviewer
4. QA

Each stage owns one kind of decision.

### Planner

The Planner turns a request into an implementation contract for the current task. It identifies owners, runtime boundaries, affected areas, validation, and documentation impact before code changes begin.

### Implementer

The Implementer executes the approved plan. It writes code, updates docs, and runs the validation defined by the plan. It does not expand scope on its own.

### Reviewer

The Reviewer checks whether the implementation is actually acceptable. This includes correctness, MDDD alignment, contract compliance, regression risk, and missing validation or documentation.

### QA

QA verifies what was delivered, what failed, what evidence exists, and whether release risk remains. QA is separated from review because verification and critique are not the same activity.

## Why planning is formal instead of conversational

The implementation plan is not a casual summary. It is the shared input contract for the Implementer, Reviewer, and QA stages.

That is why the suite includes both:

- [implementation-plan-template.md](../../reference/ai/implementation-plan-template.md)
- [plan-schema.md](../../reference/ai/plan-schema.md)

The template defines the shape contributors read. The schema defines the fields that later stages rely on. Together they stop the plan from becoming an inconsistent free-form note.

## Why agents and prompts both exist

Agents define persistent roles, tool limits, and handoff behavior. Prompts define task-specific entry points and recovery paths.

The suite needs both because real delivery work does not always follow one uninterrupted path. A contributor might need to:

- start from a new feature request,
- rerun review only,
- rerun QA only,
- or recover after an interrupted session.

The prompts handle those operational paths without weakening the role boundaries encoded in the agents.

## Why the model fits Xuanwu architecture

The model is intentionally aligned with the repository's existing architecture rules.

- The Planner identifies the owning module, runtime, and contract.
- The Implementer keeps changes inside `interfaces -> application -> domain <- infrastructure`.
- The Reviewer checks that the change respects MDDD boundaries and does not create accidental ownership in UI or adapter code.
- QA verifies the delivered behavior rather than trusting architectural intent alone.

This is especially important in Xuanwu because workflows can cross:

- Next.js and `py_fn`,
- multiple business modules,
- and contract-governed domains such as RAG, schedule, daily, billing, and audit.

## Why recovery is a first-class design concern

Long AI-assisted tasks fail in ordinary ways:

- the chat session becomes noisy,
- the current request goes off track,
- a contributor wants to restart from the plan,
- or a later stage needs to rerun independently.

The suite treats recovery as part of the design, not as an afterthought. That is why it ships with re-entry prompts and operational how-to documents, not just personas.

## Governance principle

The delivery suite should evolve like the rest of the repository:

- architecture rules stay in the existing authoritative files,
- delivery workflow rules stay in the AI documentation set,
- and legacy assets are retired through explicit migration notes instead of silent drift.

If a workflow change alters responsibility boundaries, required validation, or handoff behavior, update the delivery documents in the same change.