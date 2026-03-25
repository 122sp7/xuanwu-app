---
description: 'Split one module into clearer bounded contexts while preserving public APIs and dependency rules'
name: 'split-module'
agent: 'Modules Architect'
argument-hint: 'Source module, target modules, ownership split, and migration constraints'
---

# Split Module

## Mission

Split an existing module into multiple bounded contexts without introducing boundary violations.

## Inputs

- Source module: `${input:sourceModule:knowledge}`
- Target modules: `${input:targetModules:content,graph}`
- Ownership split: `${input:ownership:Describe what moves where}`
- Migration constraints: `${input:constraints:APIs, routes, or event contracts that must remain stable}`

## Workflow

1. Map current ownership and target ownership.
2. Preserve or migrate public APIs intentionally.
3. Move internals into the correct target modules.
4. Remove stale imports and update docs, tests, and dependency guidance.

## Output Expectations

- Summarize source-to-target ownership mapping
- List API and dependency changes
- List validation performed
