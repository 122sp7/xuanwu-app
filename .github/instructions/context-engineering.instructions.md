---
description: 'Use these rules to improve Copilot context quality across Xuanwu code, architecture, and customization work.'
applyTo: 'app/**/*,core/**/*,modules/**/*,infrastructure/**/*,interfaces/**/*,lib/**/*,shared/**/*,ui/**/*,.github/**/*,README.md,ARCHITECTURE.md'
---

# Xuanwu Context Engineering Rules

## Purpose

- Optimize repository structure and prompts so GitHub Copilot can infer the correct layer, ownership, and implementation pattern with minimal ambiguity.
- Treat context quality as an engineering concern: better file layout, naming, exports, and prompts produce better code changes.

## Project Context Signals

- Start with `Use skill: xuanwu-app-skill` before exploring implementation details.
- For `.github/*`, Copilot, agent, prompt, instruction, or skill work, also load `vscode-docs-skill` before editing.
- Use `ARCHITECTURE.md` as the architectural source of truth and verify actual folders before assuming the migration is complete.
- Map affected work across `app/`, `modules/`, `core/`, `infrastructure/`, `interfaces/`, `lib/`, `shared/`, and `ui/` before editing.
- Prefer Serena MCP for symbol-aware discovery and precise edits, then use filesystem MCP for structure discovery, repomix MCP for cross-cutting reference lookups, and memory MCP for durable verified facts.

## Structure For Better AI Context

- Keep file paths descriptive and domain-revealing. Favor paths like `modules/task/application/use-cases/` over vague utility buckets.
- Colocate related types, ports, use-cases, adapters, and interface entrypoints within the same module so one search path exposes the full flow.
- Export stable public surfaces through `index.ts` files. Public exports define the slice contract; non-exported code should stay internal.
- Prefer extending existing module folders over creating parallel or duplicate paths for the same capability.
- Keep reusable UI in `ui/`, reusable technical abstractions in `lib/`, and truly cross-cutting shared contracts/utilities in `shared/`.

## Code Pattern Hints

- Use explicit business names for files, symbols, and types. Prefer `OrganizationMembershipRepository` over ambiguous names like `repo` or `service`.
- Prefer explicit exported parameter and return types on public functions, hooks, DTO mappers, and adapters.
- Replace magic values with named constants when they carry domain meaning or workflow constraints.
- Keep comments short and structural. Use them to explain boundaries, orchestration steps, or invariants, not obvious syntax.

## Working With Copilot

- For non-trivial tasks, state the full change surface up front: affected module, route, adapter, and validation target.
- Reference an existing in-repo pattern when requesting changes, especially for module wiring, shadcn composition, Firebase adapters, and App Router structure.
- When requesting multi-file work, describe the ownership split explicitly: UI, application, domain, infrastructure, and interface boundaries.
- Keep the cursor or active file near the boundary you want changed. Copilot prioritizes nearby code and open files as context.

## Multi-File Change Discipline

- Ask for one migration slice at a time and verify it before expanding scope.
- If the task spans multiple layers, define the sequence first: contract changes, adapter updates, UI wiring, then validation.
- For architectural work, prefer plan-first prompts or custom agents before editing broad areas.
- After meaningful structure changes, refresh relevant `.github` instructions, prompts, or skill references so future sessions inherit the new context.

## When Copilot Struggles

- Open the closest existing implementation pattern and the target file together before asking for edits.
- Restate the architectural constraint explicitly when the model drifts toward UI/business-logic mixing.
- If suggestions become generic, tighten the prompt with exact file targets, expected ownership, and validation commands.
- If repository structure changes materially, update memory MCP notes and any affected reference skills rather than relying on stale context.
