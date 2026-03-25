---
name: 'Modules API Surface'
description: 'Rules for modules/*/api files so cross-domain access stays API-only through contracts and facades.'
applyTo: 'modules/**/api/**/*.ts'
---

# Modules API Surface

Use this instruction for `modules/*/api` files.

## Required Shape

- Keep `contracts.ts` for DTOs, request types, response types, and stable public contracts.
- Keep `facade.ts` for outward use-case entry points that the app layer or other modules can call.
- Export the minimum stable surface needed by consumers.

## Guardrails

- Do not instantiate infrastructure adapters directly in `api/`.
- Do not expose private domain entities or repository implementations unless a public contract explicitly requires a translated type.
- Do not reach into other modules except through their own `api/` boundaries.

## Validation

- Re-check every new export and downstream import path.
- Run validation from `agents/commands.md` when API signatures or import surfaces change.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill 
#use skill slavingia-skills-company-values
#use skill slavingia-skills-find-community
#use skill slavingia-skills-first-customers
#use skill slavingia-skills-grow-sustainably
#use skill slavingia-skills-minimalist-review
#use skill slavingia-skills-mvp
#use skill slavingia-skills-pricing
#use skill slavingia-skills-validate-idea
