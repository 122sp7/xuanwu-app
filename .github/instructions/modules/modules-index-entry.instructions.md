---
name: 'Modules Index Entry'
description: 'Rules for modules/*/index.ts files so they remain aggregate exports without embedded business logic.'
applyTo: 'modules/**/index.ts'
---

# Modules Index Entry

Use this instruction for module root `index.ts` files.

## Rules

- `index.ts` is an aggregate export only.
- Re-export stable public members from `api/` or other intentionally public entry points.
- Keep the file free of orchestration, conditionals, adapter wiring, and business logic.

## Guardrails

- Do not implement use cases, facades, or stateful helpers here.
- Do not expose private infrastructure or domain internals through convenience exports.

## Validation

- Verify that app-layer or cross-module imports still resolve through the intended public surface.

Tags: #use skill context7 #use skill xuanwu-app-skill
