---
description: 'Refactoring workflows for adding, restructuring, splitting, merging, and deleting modules while preserving MDDD boundaries'
applyTo: 'modules/**/*.md'
---

# Modules Refactoring

Use this instruction when planning or documenting add/refactor/split/merge/delete operations for modules.

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
- [ ] Search all imports, event discriminants, and docs referencing the module boundary
- [ ] Remove consumers first, then module
- [ ] Update indexes and dependency guidance

### Validation
- [ ] Use validation commands from `agents/commands.md` and record which ones were run.
