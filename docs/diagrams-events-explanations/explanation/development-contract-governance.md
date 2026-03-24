---
title: Development contract governance
description: Explanation of why development contracts exist, how they align with MDDD boundaries, and how to keep them consistent as implementation evolves.
---

# Development contract governance

Development contracts exist to stop implementation from drifting into route files, UI components, or undocumented cross-module behavior. They sit between high-level ADRs and concrete use cases: narrower than architecture guidance, but broader than a single adapter or action.

## What a development contract must contain

A development contract should make five things explicit:

1. the owning module and runtime,
2. the current public inputs and outputs,
3. the allowed state transitions and actors,
4. the invariants that future code must preserve,
5. and the acceptance gates that must be satisfied before broader implementation starts.

This keeps the repository from using UI behavior, Firestore document shapes, and worker payloads as accidental sources of truth.

## When to create one

A contract is needed when any of the following is true:

- multiple runtimes share one workflow,
- a module exposes a derived read model but does not yet have a write-side,
- enterprise governance or auditability matters,
- or the repository has repeated ADRs and plans but no single implementation reference.

That is why the first contract set covers RAG, parser, schedule, acceptance, billing, and audit.

## How contracts relate to MDDD layers

Development contracts do not replace module ports or use cases. Instead, they define the stable boundary that those ports and use cases must implement.

- UI reads contracts to know which inputs are allowed.
- Application uses them to define DTOs and workflow boundaries.
- Domain uses them to guard lifecycle rules and invariants.
- Infrastructure uses them to map persistence and external adapters without inventing new ownership rules.

## How to update a contract

Update a contract when one of these changes lands:

- a new write-side action becomes official,
- a state transition changes,
- a field becomes required or deprecated,
- runtime ownership moves between Next.js, Firebase, Python, or another adapter,
- or acceptance gates change because the delivery risk changed.

If the change is breaking, update the contract in the same pull request as the code and identify the compatibility period. If the change is transitional, mark the compatibility path explicitly instead of pretending the repository already runs the target design.

## What to avoid

Do not use development contracts to duplicate every ADR verbatim. Do not store implementation detail that belongs only in one adapter. Do not mix explanation, tutorial, and reference styles in the same page. The contract page should stay short enough that a contributor can use it as an implementation checklist before opening code.
