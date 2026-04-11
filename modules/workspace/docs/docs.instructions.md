---
description: 'Workspace documentation rules: strategic doc authority, subdomain list sync, and ubiquitous language enforcement.'
applyTo: 'modules/workspace/docs/**/*.md'
---

# Workspace Docs Layer (Local)

Use this file as execution guardrails for `modules/workspace/docs/*`.
For full reference, align with `.github/instructions/docs-authority-and-language.instructions.md` and `docs/contexts/workspace/*`.

## Core Rules

- `modules/workspace/docs/` holds **links and local summaries only** — authoritative content lives in `docs/contexts/workspace/`.
- Do not duplicate strategic knowledge here; point to the canonical source instead.
- Any new architectural decision affecting workspace must have a corresponding ADR in `docs/decisions/`.
- Use ubiquitous language from `docs/contexts/workspace/ubiquitous-language.md`; do not introduce synonyms.
- Keep this directory in sync with `docs/contexts/workspace/README.md` whenever the subdomain list changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
