---
title: Schedule development contract
description: Implementation contract for derived schedule items, persisted acknowledgements, and future schedule write-side ownership.
---

# Schedule development contract

## Scope

This contract defines how the schedule module combines a derived read model with a persisted acknowledgement write-side. It prevents future schedule work from mixing derived milestone logic with mutable item state in ad hoc ways.

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Derived schedule item list | `modules/schedule` |
| Finance timing input | `modules/finance` snapshot input |
| Workspace scope | `modules/workspace` |
| Item acknowledgement persistence | `modules/schedule` Firebase adapter |

The schedule query boundary resolves workspace and finance context inside the schedule module. Callers provide `workspaceId` and do not assemble snapshot dependencies themselves.

## Current read contract

### Entry point

`getWorkspaceSchedule(workspaceId)` returns a derived list of `WorkspaceScheduleItem` values.

### Output shape

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `string` | Stable derived item identifier |
| `title` | `string` | User-facing label |
| `timeLabel` | `string` | Display time summary |
| `type` | `milestone \| follow-up \| maintenance` | Schedule category |
| `status` | `upcoming \| scheduled \| completed` | Derived display state |
| `detail` | `string` | Supporting description |

## Current write contract

### Entry point

`acknowledgeWorkspaceScheduleItem(input)` persists a schedule acknowledgement record.

### Input shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `workspaceId` | `string` | yes | Scope boundary |
| `scheduleItemId` | `string` | yes | Derived item identifier |
| `actorAccountId` | `string` | yes | Audit actor |

### Persisted acknowledgement shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | yes | Built from workspace and item identifiers |
| `workspaceId` | `string` | yes | Scope boundary |
| `scheduleItemId` | `string` | yes | Linked derived item |
| `acknowledgedByAccountId` | `string` | yes | Actor identifier |
| `acknowledgedAtISO` | `string` | yes | Event timestamp |

## State machine

| State | Trigger actor | Allowed next states | Notes |
| --- | --- | --- | --- |
| `derived` | schedule read model | `acknowledged` | Base schedule item is computed, not stored |
| `acknowledged` | schedule write-side action | terminal until a future explicit reset flow exists | Persisted separately from the derived item |

The display `status` on `WorkspaceScheduleItem` is not the same thing as acknowledgement state. Future work must keep those two dimensions separate.

## Invariants

1. Schedule items remain derived from workspace and finance context.
2. User interaction state such as acknowledgement is persisted separately.
3. Acknowledgement must key off the derived item id rather than rewriting the derived item itself.
4. Future mutations such as dismiss, snooze, or reopen must become explicit write-side records rather than extra booleans on the derived item.

## Acceptance gates

New schedule features should begin only when:

- the derived item id strategy is stable,
- acknowledgement semantics are explicit for duplicate clicks and idempotent retries,
- finance-driven milestones remain read-only inputs,
- and any new write-side action declares whether it mutates acknowledgement state, item presentation, or both.
