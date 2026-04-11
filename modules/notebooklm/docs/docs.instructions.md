---
description: 'NotebookLM documentation rules: strategic doc authority, subdomain list sync, and ubiquitous language enforcement.'
applyTo: 'modules/notebooklm/docs/**/*.md'
---

# NotebookLM Docs Layer (Local)

Use this file as execution guardrails for `modules/notebooklm/docs/*`.
For full reference, align with `.github/instructions/docs-authority-and-language.instructions.md` and `docs/contexts/notebooklm/*`.

## Core Rules

- `modules/notebooklm/docs/` holds **links and local summaries only** — authoritative content lives in `docs/contexts/notebooklm/`.
- Do not duplicate strategic knowledge here; point to the canonical source instead.
- Any new architectural decision affecting notebooklm must have a corresponding ADR in `docs/decisions/`.
- Use ubiquitous language from `docs/contexts/notebooklm/ubiquitous-language.md`; do not introduce synonyms.
- Keep this directory in sync with `docs/contexts/notebooklm/README.md` whenever the subdomain list changes.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill hexagonal-ddd
