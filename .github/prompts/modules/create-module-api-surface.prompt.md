---
name: 'create-module-api-surface'
description: 'Create or refactor a module public API surface with contracts.ts, facade.ts, safe interfaces usage, and clean index exports.'
agent: 'Modules API Surface Steward'
argument-hint: 'Provide the module name, requested actions or queries, consumer type, and any allowed upstream dependencies.'
---

# Create Module API Surface

## Mission

Create or refactor the public surface of a module so the app layer and other modules can consume it through `api/` and `index.ts` only.

## Inputs

- Module name: `${input:moduleName:account}`
- Public actions or queries: `${input:actions:list 2-5 public API actions or queries}`
- Consumer type: `${input:consumerType:app route | module consumer | both}`
- Allowed upstream dependencies: `${input:dependencies:list approved module API dependencies or events}`

## Workflow

1. Define or refine `api/contracts.ts`.
2. Define or refine `api/facade.ts`.
3. Keep `index.ts` as the aggregate export only.
4. Ensure `interfaces/` and consumers use the API surface instead of internal layers.
5. Run validation for changed exports and imports.

## Output

- Public contracts added or changed
- Facade entry points added or changed
- Validation run
- Residual boundary or consumer migration risks