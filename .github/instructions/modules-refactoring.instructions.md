---
description: 'Refactoring workflows for adding, restructuring, splitting, merging, and deleting modules while preserving MDDD boundaries'
applyTo: 'modules/**/*.ts, modules/**/*.tsx, modules/**/*.js, modules/**/*.jsx, modules/**/*.md, app/**/*.ts, app/**/*.tsx'
---

# Modules Refactoring

Use this instruction when an agent must add, refactor, split, merge, or delete a module.

## General Workflow

1. Identify the owning bounded context.
2. Determine whether the change is create / refactor / split / merge / delete.
3. Map public API consumers and event consumers before moving internals.
4. Preserve MDDD layers and API boundaries throughout the change.
5. Update imports, docs, tests, and indexes in the same change.

## 新增領域

When creating `modules/{domain}`:

1. Confirm the new domain is a distinct bounded context.
2. Create:
   - `api/`
   - `domain/`
   - `application/`
   - `infrastructure/`
   - `interfaces/`
   - `README.md`
   - `index.ts`
3. Establish the first API contract before adding cross-module callers.
4. Register the new module in documentation and any module inventory that depends on it.
5. Update dependency-graph guidance if the new module introduces a new approved edge.

## 重構領域

When refactoring an existing module:

1. Analyze entities, aggregates, repository ports, domain events, and public API surface.
2. Move orchestration into `application/` if business flow leaked into `interfaces/` or `infrastructure/`.
3. Remove cross-domain internal imports.
4. Create or tighten `api/` exports as needed.
5. Update imports, tests, docs, and any dependency notes.

## 拆分 / 合併領域

When splitting or merging modules:

1. Map source ownership and target ownership.
2. Identify what remains internal versus public.
3. Preserve or migrate API contracts deliberately.
4. Update event producers and consumers.
5. Update routing imports, tests, docs, and dependency rules.

## 刪除領域

Before deleting a module:

1. Search all imports.
2. Search all API usage.
3. Search all event usage.
4. Remove or migrate consumers first.
5. Remove the module.
6. Update module indexes, docs, and dependency guidance.

## Required Searches

- Search `@/modules/<module-name>` imports
- Search `@/modules/<module-name>/api` imports
- Search event discriminants using the module prefix
- Search README, docs, and prompts that reference the module name

## Validation

- Run the narrowest relevant checks first
- Run `npm run lint` after import or boundary refactors
- Run `npm run build` after API, type, or routing changes
