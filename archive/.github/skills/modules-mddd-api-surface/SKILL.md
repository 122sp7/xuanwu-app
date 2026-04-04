---
name: modules-mddd-api-surface
description: Create and refine Xuanwu module public api surfaces with contracts.ts, facade.ts, index.ts aggregate exports, API-only cross-module access, interface-layer API consumption, and infrastructure adapters that depend downward only. Use for modules/* boundary work and MDDD surface design.
---

# Modules MDDD API Surface

Use this skill when work changes how a module exposes behavior to the app layer or other modules.

## When to use

- Adding or refactoring `modules/*/api/contracts.ts`
- Adding or refactoring `modules/*/api/facade.ts`
- Cleaning `modules/*/index.ts` exports
- Moving interface-layer code to consume `api/` instead of internal layers
- Keeping infrastructure adapters isolated from `application/` and `api/`

## Workflow

1. Confirm the owning bounded context.
2. Define the stable public contracts first.
3. Expose outward behavior through the facade.
4. Keep `index.ts` as an aggregate export only.
5. Check `interfaces/` and consumers for internal-layer reach-through.
6. Check `infrastructure/` dependency direction after every import change.

## Guardrails

- Cross-module access must go through `api/`.
- `index.ts` must not contain business logic.
- `interfaces/` must not import `domain/` or `application/` directly.
- `infrastructure/` must not depend on `application/` or `api/`.

## Output expectations

- State the API surface changed
- State the consumers affected
- Report validation performed