---
description: 'Merge related modules into one bounded context while preserving API consumers and MDDD structure'
name: 'merge-module'
agent: 'Modules Architect'
argument-hint: 'Source modules, target module, API migration plan, and dependency risks'
---

# Merge Module

## Mission

Merge related modules into one bounded context while preserving explicit APIs and dependency safety.

## Inputs

- Source modules: `${input:sourceModules:module-a,module-b}`
- Target module: `${input:targetModule:module-ab}`
- API migration plan: `${input:apiPlan:How existing consumers should migrate}`
- Dependency risks: `${input:risks:Potential reverse edges or boundary leaks}`

## Workflow

1. Map overlapping ownership and public contracts.
2. Consolidate domain, application, infrastructure, interfaces, and API layers.
3. Keep migrations explicit for imports, events, and docs.
4. Remove obsolete modules only after dependents are updated.

## Output Expectations

- Summarize merged ownership and API changes
- List migration steps completed
- List validation performed
