---
name: 'Modules Interfaces API Consumption'
description: 'Rules for modules/*/interfaces files so UI, hooks, and external interfaces consume module behavior only through api/.'
applyTo: 'modules/**/interfaces/**/*.{ts,tsx,js,jsx}'
---

# Modules Interfaces API Consumption

Use this instruction for `modules/*/interfaces` files.

## Rules

- Put UI components, hooks, route-facing adapters, and interface DTOs here.
- Consume module behavior through the module's own `api/` surface.
- Keep local view state or interaction state inside the interface layer.

## Guardrails

- Do not import the same module's `domain/` or `application/` directly.
- Do not import another module's internals.
- Do not place external resource adapters here.

## Validation

- Re-check imports for accidental reach-through before finishing.

Tags: #use skill context7 #use skill xuanwu-app-skill
