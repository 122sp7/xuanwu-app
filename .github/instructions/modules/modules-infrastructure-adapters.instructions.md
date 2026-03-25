---
name: 'Modules Infrastructure Adapters'
description: 'Rules for modules/*/infrastructure files so external resources stay in adapters with downward-only dependencies.'
applyTo: 'modules/**/infrastructure/**/*.{ts,tsx,js,jsx}'
---

# Modules Infrastructure Adapters

Use this instruction for `modules/*/infrastructure` files.

## Rules

- Keep Firebase, storage, HTTP, queue, and third-party adapters here.
- Infrastructure may depend on `domain/` contracts and entities needed to implement ports.
- Keep adapter wiring explicit and local to infrastructure.

## Guardrails

- Do not depend on `application/`, `api/`, or `interfaces/`.
- Do not place domain decision logic here.
- Do not let app-layer concerns leak into adapter code.

## Validation

- Re-check dependency direction after import changes.

Tags: #use skill context7 #use skill .serena-mcp #use skill xuanwu-app-skill 
