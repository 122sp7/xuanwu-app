---
name: xuanwu-mddd-boundaries
description: 'Enforce Xuanwu''s MDDD module architecture and bounded-context boundaries. Use for cross-module imports, dependency violations, refactors in `modules/`, `packages/`, or `app/`, and changes to repositories, DTOs, or server actions. Preserves correct module ownership, layer placement, package aliases, and public boundaries.'
disable-model-invocation: true
---

# Xuanwu MDDD Boundaries

Use this skill when implementation work needs to stay aligned with Xuanwu's module-driven architecture.

## When to Use This Skill

- Adding a new use case, repository, DTO, query hook, or server action
- Moving code between `app/`, `modules/`, and `packages/`
- Refactoring imports between modules or packages
- Reviewing code that may violate module ownership or dependency direction
- Deciding whether a concern belongs in a business module or a shared package

## Authoritative Sources

- [agents/knowledge-base.md](../../../agents/knowledge-base.md)
- [packages/README.md](../../../packages/README.md)
- [tsconfig.json](../../../tsconfig.json)
- [eslint.config.mjs](../../../eslint.config.mjs)

## Workflow

1. **Find the owner first**
   - Map the change to the owning bounded context under `modules/`.
   - Use `packages/` only for stable shared boundaries that are reused across modules.

2. **Place code in the correct layer**
   - `interfaces/` for UI, route handlers, query hooks, and server actions
   - `application/` for orchestration and DTOs
   - `domain/` for entities, value objects, repository interfaces, and pure business rules
   - `infrastructure/` for Firebase, Upstash, HTTP, and other adapters

3. **Preserve dependency direction**
   - Keep `UI -> Application -> Domain <- Infrastructure`
   - Do not import infrastructure into domain code
   - Do not let packages reverse-import from `app/` or `modules/` internals

4. **Respect public boundaries**
   - Cross-module imports must go through the target module's `api/` boundary
   - Internal files inside one module should use relative imports
   - Package consumers must import through the configured `@alias`, never through relative paths into `packages/*`

5. **Validate the final change**
   - Run `npm run lint`
   - Run `npm run build`

## Guardrails

- Do not create a new shared package when the concern is still local to one module.
- Do not reach into another module's `application/`, `domain/`, `infrastructure/`, or `interfaces/` internals.
- Do not use legacy import paths blocked by ESLint.
- Do not treat `app/` as a business-logic layer.

## Output Expectations

When using this skill, return:

1. the owning module or package,
2. the target layer,
3. any import-boundary changes required,
4. and the validation commands that should be run.
