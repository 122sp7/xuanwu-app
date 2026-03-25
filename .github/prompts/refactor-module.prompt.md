---
description: 'Refactor an existing module while preserving MDDD layers, API boundaries, and dependency direction'
name: 'refactor-module'
agent: 'Modules Architect'
argument-hint: 'Module name, refactor goal, affected entities or aggregates, and boundary concerns'
---

# Refactor Module

## Mission

Refactor an existing module without breaking MDDD ownership, API boundaries, or dependency direction.

## Inputs

- Module name: `${input:moduleName:content}`
- Refactor goal: `${input:goal:Describe the refactor outcome}`
- Affected internals: `${input:scope:Entities, aggregates, use cases, repositories, or events}`
- Boundary concerns: `${input:boundaries:Cross-module imports, API leaks, or dependency issues}`

## Workflow

1. Analyze entity, aggregate, repository, event, and API ownership.
2. Move misplaced logic into the correct MDDD layer.
3. Remove cross-module internal imports.
4. Create or tighten `api/` boundaries as needed.
5. Update imports, tests, and docs in the same change.

## Output Expectations

- Summarize ownership and layer-placement decisions
- List any API changes
- List validation performed
