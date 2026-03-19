# Schedule Module

## Purpose

The schedule module owns derived workspace schedule items and schedule-specific acknowledgement behavior. It does not own finance lifecycle, workspace lifecycle, or ad hoc UI-only schedule state.

## Current boundary

- derived read model for workspace schedule items
- persisted acknowledgement write-side for individual items
- no broader dismiss, snooze, or reschedule workflow yet

## Source of truth

- development contract: `/home/runner/work/xuanwu-app/xuanwu-app/docs/reference/development-contracts/schedule-contract.md`
- architecture baseline: `/home/runner/work/xuanwu-app/xuanwu-app/ARCHITECTURE.md`

## Current interface entrypoints

- `modules/schedule/interfaces/queries/schedule.queries.ts`
- `modules/schedule/interfaces/_actions/schedule.actions.ts`

## Key rule

Derived item status and persisted acknowledgement state are separate concerns and must not be merged into one mutable document shape.
