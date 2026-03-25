---
description: 'Create a new module in modules/ using the Modules Architect workflow and Xuanwu MDDD structure'
name: 'create-module'
agent: 'Modules Architect'
argument-hint: 'Module name, domain purpose, expected API contract, and initial dependencies'
---

# Create Module

## Mission

Create a new module under `modules/` following Xuanwu MDDD structure and API-boundary rules.

## Inputs

- Module name: `${input:moduleName:content-domain}`
- Domain purpose: `${input:purpose:Describe the bounded context}`
- Public API intent: `${input:apiIntent:List the first public actions or queries}`
- Allowed dependencies: `${input:dependencies:List approved upstream modules or events}`

## Workflow

1. Confirm the module is a distinct bounded context.
2. Create:
   - `modules/{module-name}/api/`
   - `modules/{module-name}/domain/`
   - `modules/{module-name}/application/`
   - `modules/{module-name}/infrastructure/`
   - `modules/{module-name}/interfaces/`
   - `modules/{module-name}/README.md`
   - `modules/{module-name}/index.ts`
3. Define the initial API contract before adding cross-module consumers.
4. Keep internal imports relative and cross-module access API-only.
5. Update any relevant module inventory or customization docs if new architecture guidance is introduced.

## Output Expectations

- Create the module structure
- Summarize ownership, API shape, and dependency direction
- List validation performed
