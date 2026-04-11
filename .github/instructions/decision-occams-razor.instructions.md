---
description: '[DEPRECATED] Occam parsimony rules. See process-framework.instructions.md.'
applyTo: '**/*'
---

# Decision Occams Razor

> DEPRECATED: Consolidated into `.github/instructions/process-framework.instructions.md`.

## Core Principle

- Prefer the option with fewer assumptions when outcomes are comparable.
- Remove assumptions before removing evidence.
- Simpler is better only when real domain complexity remains represented.

## Real-Pressure Test

Add a new abstraction/layer/document only if it protects at least one:

1. Runtime or process boundary.
2. Bounded-context ownership boundary.
3. Volatile external dependency.
4. Materially different behavior.
5. Repeated and observed change pressure.

## Decision Loop

1. List options and the invariant that must be preserved.
2. List assumptions and added structures per option.
3. Remove options based on hypothetical future needs only.
4. Choose the easiest option to explain, validate, and reverse.
5. Reintroduce complexity only after new evidence appears.

## Anti-Bloat Rules

- Do not add interfaces or modules for naming symmetry alone.
- Do not duplicate authority docs in parallel files.
- Do not add a second abstraction before first concrete pressure appears.
- Do not collapse distinct domain meanings just to reduce file count.

## PR Checkpoints

- State what assumption was removed.
- State what complexity must remain and why.
- State the validation step proving the simpler path still works.

Tags: #use skill context7 #use skill serena-mcp #use skill xuanwu-app-skill
#use skill occams-razor