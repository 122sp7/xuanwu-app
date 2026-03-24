# AI Customization Reference

Copilot customization assets, delivery planning templates, schemas, and governance indices.

## Primary Purpose

This folder is the **docs-side reference** for the Xuanwu Copilot Delivery Suite. The operative assets live in [.github/](../../../../.github/), and this folder provides routing, ownership, and maintenance policy.

## Core Files

| File | Purpose | Audience |
| --- | --- | --- |
| [customizations-index.md](./customizations-index.md) | Primary index for all Copilot assets | Developers, maintainers |
| [implementation-plan-template.md](./implementation-plan-template.md) | Standard markdown skeleton for plans | Planners, implementers |
| [plan-schema.md](./plan-schema.md) | Field-level semantics and rules | Plan reviewers |
| [handoff-matrix.md](./handoff-matrix.md) | Stage transitions and re-entry paths | All delivery stages |
| [legacy-customizations-migration.md](./legacy-customizations-migration.md) | Deprecation and migration tracking | Maintainers |

## Quick Navigation

1. **To understand Copilot customizations**: Start with [customizations-index.md](./customizations-index.md)
2. **To create a formal plan**: Use [implementation-plan-template.md](./implementation-plan-template.md)
3. **To validate your plan**: Check against [plan-schema.md](./plan-schema.md)
4. **To understand stage transitions**: Read [handoff-matrix.md](./handoff-matrix.md)
5. **To track legacy migrations**: See [legacy-customizations-migration.md](./legacy-customizations-migration.md)

## Scope

- This folder is **reference only** — do not edit files here without updating `.github/` in the same change
- If this folder conflicts with `.github/`, treat `.github/` as authoritative
- Keep explanation and routing here; keep operative assets in `.github/`

## Related

- [../../README.md](../../README.md) — Development reference root
- [../../../../../.github/copilot-instructions.md](../../../../../.github/copilot-instructions.md) — Copilot baseline
- [../../../../../.github/README.md](../../../../../.github/README.md) — Operative root
- [../../../how-to-user/how-to/ai/start-feature-delivery.md](../../../how-to-user/how-to/ai/start-feature-delivery.md) — How-to workflow
