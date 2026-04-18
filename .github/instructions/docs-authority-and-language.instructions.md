---
description: 'Consolidated documentation authority and ubiquitous language rules for docs governance and naming discipline.'
applyTo: '{docs,src/modules,packages}/**/*.{ts,tsx,js,jsx,md}'
---

# Docs Authority And Language

## Authority Rules

- `docs/**/*` is the strategic authority for bounded-context ownership, terminology, and context map.
- Before adding or editing docs, start from `docs/README.md` and update the owning authority document.
- `.github/instructions/*` defines behavior rules only; do not duplicate architecture inventory or glossary content.
- `src/modules/<context>/docs/*` may describe implementation detail only and must not override root docs decisions.

## Ubiquitous Language Rules

1. Before naming classes, interfaces, types, variables, or domain events, check `docs/ubiquitous-language.md` and context-local glossary docs.
2. Do not replace canonical terms with synonyms once defined.
3. Domain events must use past-tense naming.
4. Bounded-context names must align with `src/modules/<context>/` folder names.
5. If a necessary term is missing, update glossary docs first, then implement.

## Naming Rules

- Aggregate roots: `PascalCase` nouns.
- Value objects: `PascalCase` nouns with meaning-focused names.
- Domain events: `PascalCase` past tense.
- Event discriminant: `kebab-case` `<module>.<action>`.
- Use-case file: `verb-noun.use-case.ts`.
- Repository interface: `PascalCaseRepository`.
- Repository implementation: `TechnologyPascalCaseRepository`.

## Documentation Checks

- Verify content belongs to the owner document instead of creating parallel files.
- Verify behavioral rules are not restating full strategic docs content.
- If docs changes affect `.github/skills/` repomix references, regenerate with existing scripts.

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill hexagonal-ddd
