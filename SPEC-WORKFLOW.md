# Spec-Driven Development Workflow

This workflow is **opt-in**. Use it when explicitly requested by saying "use spec-driven development" or "follow the spec workflow".

## Canonical Entry Points

- Start feature planning: [`docs/how-to-user/how-to/start-feature-delivery.md`](docs/how-to-user/how-to/start-feature-delivery.md)
- Plan template: [`docs/development-reference/reference/ai/implementation-plan-template.md`](docs/development-reference/reference/ai/implementation-plan-template.md)
- Stage transitions: [`docs/development-reference/reference/ai/handoff-matrix.md`](docs/development-reference/reference/ai/handoff-matrix.md)

## Workflow (Spec Mode)

1. Clarify scope and constraints with a written implementation plan.
2. Anchor ownership and boundaries using [`agents/knowledge-base.md`](agents/knowledge-base.md).
3. Implement in small increments against the approved plan.
4. Run required validation from [`agents/commands.md`](agents/commands.md).
5. Update affected docs in the same change when behavior or boundaries move.

## Recommended Spec Location

When a dedicated feature spec is needed, create it under:

```text
docs/development-reference/specification/<feature-name>/
```

Suggested files:

```text
docs/development-reference/specification/<feature-name>/
├── design.md
├── implementation.md
├── decisions.md
└── future-work.md
```

## Guardrails

- Do not start non-trivial implementation without an approved plan.
- Keep module boundaries explicit; cross-module access must use `modules/<module>/api/`.
- Record major technical decisions in `decisions.md` (or an ADR when appropriate).
- Keep spec status and checklists current as implementation progresses.
