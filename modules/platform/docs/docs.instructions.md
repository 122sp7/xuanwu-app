---
description: 'Platform documentation rules: strategic doc authority, ADR discipline, and ubiquitous language enforcement.'
applyTo: 'modules/platform/docs/**/*.md'
---

# Platform Docs Layer (Local)

Use this file as execution guardrails for `modules/platform/docs/*`.
For full reference, align with `.github/instructions/docs-authority-and-language.instructions.md` and `docs/contexts/platform/*`.

## Core Rules

- `modules/platform/docs/` holds **links and local summaries only** — authoritative content lives in `docs/contexts/platform/`.
- Do not duplicate strategic knowledge here; point to the canonical source instead.
- Any new architectural decision affecting platform must have a corresponding ADR in `docs/decisions/`.
- Use ubiquitous language from `docs/contexts/platform/ubiquitous-language.md`; do not introduce synonyms or aliases.
- Keep this directory in sync with `docs/contexts/platform/README.md` whenever the subdomain list changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
