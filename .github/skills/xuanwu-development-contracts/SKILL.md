---
name: xuanwu-development-contracts
description: 'Follow Xuanwu''s contract-first development workflow. Use when modifying workflows with explicit contracts, including RAG ingestion, parser, schedule, daily, acceptance, billing, and audit. Triggers include runtime boundaries, state transitions, invariants, and acceptance gates. Helps find the right contract first and align code to it.'
disable-model-invocation: true
---

# Xuanwu Development Contracts

Use this skill when implementation needs to follow a project contract instead of inventing behavior from UI code, route files, or storage shape alone.

## When to Use This Skill

- Changing a workflow that already has a development contract
- Adding write-side behavior to a previously derived read model
- Updating runtime ownership, actor permissions, or lifecycle transitions
- Modifying acceptance gates, required fields, or public workflow inputs/outputs
- Reviewing code in modules such as `file`, `parser`, `schedule`, `daily`, `acceptance`, `billing`, or `audit`

## Authoritative Sources

- [docs/development-reference/reference/development-contracts/overview.md](../../../docs/development-reference/reference/development-contracts/overview.md)
- [docs/diagrams-events-explanations/explanation/development-contract-governance.md](../../../docs/diagrams-events-explanations/explanation/development-contract-governance.md)

## Workflow

1. **Locate the contract**
   - Start from the overview page.
   - Open the specific contract for the workflow you are changing.

2. **Extract the boundary before coding**
   - Owning module and runtime
   - Public inputs and outputs
   - Allowed state transitions and actors
   - Invariants that must remain true
   - Acceptance gates that must be satisfied

3. **Map the contract to code**
   - `interfaces/` consumes the allowed inputs
   - `application/` defines DTOs and orchestration
   - `domain/` protects invariants and lifecycle rules
   - `infrastructure/` maps persistence and external adapters without creating new ownership rules

4. **Update the contract when the boundary changes**
   - Update the contract in the same pull request when runtime ownership, state transitions, required fields, or acceptance gates change.
   - Mark compatibility periods explicitly instead of pretending the target state already exists.

5. **Validate implementation against the contract**
   - Confirm code, DTOs, persistence fields, and runtime entrypoints match the contract language
   - Run `npm run lint`
   - Run `npm run build`

## Guardrails

- Do not use route files, UI behavior, or Firestore document shapes as the only source of truth.
- Do not expand a contract-governed workflow from the UI layer downward without first checking the contract.
- Do not duplicate full ADRs inside the contract or the code comments.
- Do not silently change a contract-governed boundary without updating the contract page.

## Output Expectations

When using this skill, return:

1. the governing contract,
2. the owner and runtime,
3. the invariants and acceptance gates that matter for the task,
4. and whether the contract itself must be updated.
