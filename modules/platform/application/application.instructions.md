---
description: 'Platform application layer rules: use-case orchestration, command/query dispatch, event handling, and DTO contracts.'
applyTo: 'modules/platform/application/**/*.{ts,tsx}'
---

# Platform Application Layer (Local)

Use this file as execution guardrails for `modules/platform/application/*`.
For full reference, align with `.github/instructions/architecture-core.instructions.md` and `docs/contexts/platform/*`.

## Core Rules

- Use cases orchestrate flow only; complex business rules stay in `domain/`.
- Every use case operates on a **single aggregate** per transaction boundary.
- After persisting, call `pullDomainEvents()` and publish via `DomainEventPublisher` — never publish before persistence.
- Pure reads without business logic belong in **query handlers**, not use cases (`GetXxxUseCase` is a smell).
- DTOs are application-layer contracts; never expose domain entities or value objects across the layer boundary.
- Event handlers translate ingress events to commands via `mapIngressEventToCommand` before dispatching.
- `PlatformCommandDispatcher` and `PlatformQueryDispatcher` are the single dispatch entry points — do not bypass them.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
