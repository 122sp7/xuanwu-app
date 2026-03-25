---
name: 'Modules Architecture'
description: 'Architecture rules for creating and refactoring modules/ bounded contexts under Xuanwu MDDD'
applyTo: 'modules/**/*.md'
---

# Modules Architecture

Use this instruction when designing or restructuring module architecture documents under `modules/`.

## MDDD Layers

Each business module keeps: `domain/`, `application/`, `infrastructure/`, `interfaces/`, `api/`, plus `README.md` and `index.ts`.
If any canonical layer is intentionally omitted, document the exception explicitly.

## Layer Responsibilities

- `domain/`: pure business rules, entities, value objects, events, repository interfaces; no framework imports.
- `application/`: use-case orchestration and DTOs; depends on domain abstractions.
- `infrastructure/`: adapter and repository implementations for external systems.
- `interfaces/`: UI/transport/server-action concerns only.
- `api/`: the only cross-module consumption boundary.

## Required Module Shape

```text
modules/{module-name}/
├── api/
├── domain/
│   ├── entities/
│   ├── repositories/
│   ├── value-objects/
│   └── events/
├── application/
│   ├── use-cases/
│   └── dto/
├── infrastructure/
├── interfaces/
├── README.md
└── index.ts
```

Additional folders are allowed when needed, but do not rename the canonical layers.

## Rules & Guardrails

- Keep business rules out of `interfaces/`; never import infrastructure into `domain/`.
- `app/` is composition and routing, not business-rule ownership.
- Use `modules-api-boundary.instructions.md` and `modules-dependency-graph.instructions.md` for code-level boundary enforcement.
- Place events/interfaces/entities/value objects/repository implementations in their canonical folders.

## Validation

- Use validation commands from `agents/commands.md` to keep one canonical command source.
