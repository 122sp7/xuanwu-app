---
description: 'Rules for using Context7 to fetch current external docs only when repository sources are not sufficient.'
applyTo: '.github/**/*.{md,agent.md,prompt.md,instructions.md}'
---

# Context7 Usage Rules

## Use Context7 when

- The task depends on current framework or library behavior that can change across versions.
- The repository does not already contain authoritative guidance for the requested behavior.

## Do not use Context7 when

- The answer is already explicit in `AGENTS.md`, `.github/copilot-instructions.md`, module docs, or local code.
- The task is purely local refactoring with no external API uncertainty.

## Required output behavior

1. Name the selected documentation source and topic.
2. Distinguish documented facts from repository conventions.
3. Apply least-change implementation based on confirmed docs.