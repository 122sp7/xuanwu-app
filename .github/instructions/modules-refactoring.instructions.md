---
description: 'Refactoring workflows for adding, restructuring, splitting, merging, and deleting modules while preserving MDDD boundaries'
applyTo: 'modules/**/*.ts, modules/**/*.tsx, modules/**/*.js, modules/**/*.jsx, modules/**/*.md, app/**/*.ts, app/**/*.tsx'
---

# Modules Refactoring

Use this instruction when an agent must add, refactor, split, merge, or delete a module.

## Workflow Checklist

### Before any refactor
- [ ] Identify owning bounded context
- [ ] Determine change type: create / refactor / split / merge / delete
- [ ] Map public API consumers and event consumers
- [ ] Preserve MDDD layers and boundaries

### Create module
- [ ] Confirm distinct bounded context
- [ ] Create: `api/`, `domain/`, `application/`, `infrastructure/`, `interfaces/`, `README.md`, `index.ts`
- [ ] Establish first API contract
- [ ] Register in docs and module inventory

### Refactor existing module
- [ ] Move leaked business logic to `application/`
- [ ] Remove internal cross-domain imports
- [ ] Tighten `api/` exports
- [ ] Update imports, tests, docs

### Split / merge modules
- [ ] Map source → target ownership
- [ ] Identify internal vs. public
- [ ] Migrate API and event contracts
- [ ] Update routing, tests, docs

### Delete module
- [ ] Search `@/modules/<module-name>` imports
- [ ] Search `@/modules/<module-name>/api` imports
- [ ] Search event discriminants and docs referencing module
- [ ] Remove consumers first, then module
- [ ] Update indexes and dependency guidance

### Validation
- [ ] `npm run lint` after imports/boundary changes
- [ ] `npm run build` after type/routing changes
