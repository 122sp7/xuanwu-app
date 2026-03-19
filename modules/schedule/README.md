# Schedule Module

## Purpose

The schedule module owns derived workspace schedule items and schedule-specific acknowledgement behavior. It does not own finance lifecycle, workspace lifecycle, or ad hoc UI-only schedule state.

## Current boundary

- derived read model for workspace schedule items
- persisted acknowledgement write-side for individual items
- schedule queries resolve workspace and finance context inside the module from `workspaceId`
- no broader dismiss, snooze, or reschedule workflow yet

## Migration status against legacy schedule capability

The legacy schedule capability captured in `.github/skills/xuanwu-skill/references/files.md` is broader than the current MDDD slice.

What is migrated today:

- workspace-scoped derived readiness milestones based on workspace lifecycle and finance timing
- per-item acknowledgement persisted separately from the derived read model

What is still outside the current module and remains to be migrated into explicit MDDD slices:

- workspace-originated schedule proposal submission flow
- organization-owned HR schedule governance and pending proposal review
- staffing assignment lifecycle such as assign, reject, cancel proposal, and complete assignment
- persistent organization/account `schedule_items` single source of truth and related projection boundaries
- schedule domain events and downstream notification routing such as `organization:schedule:assigned`

Treat the current `modules/schedule` package as the workspace readiness / acknowledgement slice, not the full legacy workforce scheduling domain.

## Source of truth

- development contract: `/home/runner/work/xuanwu-app/xuanwu-app/docs/reference/development-contracts/schedule-contract.md`
- architecture baseline: `/home/runner/work/xuanwu-app/xuanwu-app/ARCHITECTURE.md`

## Current interface entrypoints

- `modules/schedule/interfaces/queries/schedule.queries.ts`
- `modules/schedule/interfaces/_actions/schedule.actions.ts`

## Key rule

Derived item status and persisted acknowledgement state are separate concerns and must not be merged into one mutable document shape.
