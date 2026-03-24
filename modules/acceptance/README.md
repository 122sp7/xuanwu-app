# Acceptance Module

## Purpose

The acceptance module owns derived workspace acceptance gates and future approval or waiver workflows. It does not own workspace lifecycle fields or direct UI overrides.

## Current boundary

- derived acceptance summary only
- workspace snapshot input only
- no explicit approval, waiver, or reopen write-side yet

## Source of truth

- development contract: `/home/runner/work/xuanwu-app/xuanwu-app/docs/development-reference/reference/development-contracts/acceptance-contract.md`
- architecture baseline: `/home/runner/work/xuanwu-app/xuanwu-app/ARCHITECTURE.md`

## Current interface entrypoints

- `modules/acceptance/interfaces/queries/acceptance.queries.ts`
- `modules/acceptance/application/use-cases/list-workspace-acceptance-gates.use-case.ts`

## Key rule

If manual approval is added later, it must become an acceptance-owned write model instead of rewriting workspace fields to force readiness.
