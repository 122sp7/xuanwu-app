---
title: Schedule development contract
description: Implementation contract for derived schedule items, persisted acknowledgements, and future schedule write-side ownership.
---

# Schedule development contract

## Scope

This contract defines how the current schedule module combines a derived workspace read model with a workspace request submission write-side and a persisted acknowledgement write-side. It prevents future schedule work from mixing derived milestone logic with mutable item state in ad hoc ways.

It does **not** yet cover the full legacy workforce scheduling domain from `.github/skills/xuanwu-skill/references/files.md`, where a workspace raises staffing proposals and the organization fulfills people assignment through governance flows.

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Derived schedule item list | `modules/schedule` |
| Workspace request submission | `modules/schedule` |
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

`submitScheduleRequest(input)` persists a submitted `ScheduleRequest` aggregate.

### Request submission input shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `workspaceId` | `string` | yes | Scope boundary |
| `organizationId` | `string` | yes | Fulfillment target |
| `requiredSkills` | `SkillRequirement[]` | yes | Stable request snapshot |
| `proposedStartAtISO` | `string \| null` | no | Optional requested start time |
| `notes` | `string \| null` | no | Workspace request notes |
| `actorAccountId` | `string` | yes | Submission actor |

### Persisted request shape

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | `string` | yes | Schedule request identifier generated from Firestore document allocation before persistence |
| `workspaceId` | `string` | yes | Scope boundary |
| `organizationId` | `string` | yes | Fulfillment owner |
| `status` | `draft \| submitted \| cancelled \| closed` | yes | Current implementation persists `submitted` |
| `requiredSkills` | `SkillRequirement[]` | yes | Stable submission snapshot |
| `proposedStartAtISO` | `string \| null` | no | Requested start time |
| `notes` | `string` | yes | Supporting request notes |
| `submittedByAccountId` | `string` | yes | Submission actor |
| `submittedAtISO` | `string` | yes | Submission timestamp |
| `createdAtISO` | `string` | yes | Create timestamp |
| `updatedAtISO` | `string` | yes | Last write timestamp |

### Acknowledgement entry point

`acknowledgeWorkspaceScheduleItem(input)` persists a schedule acknowledgement record.

### Acknowledgement input shape

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
| `submitted` | schedule request write-side | future `cancelled`, `closed` | Current implementation starts directly at submitted |
| `derived` | schedule read model | `acknowledged` | Base schedule item is computed, not stored |
| `acknowledged` | schedule write-side action | terminal until a future explicit reset flow exists | Persisted separately from the derived item |

The display `status` on `WorkspaceScheduleItem` is not the same thing as acknowledgement state. Future work must keep those two dimensions separate.

## Invariants

1. Schedule items remain derived from workspace and finance context.
2. Workspace request submission persists a separate `ScheduleRequest` aggregate and must not be folded into `WorkspaceScheduleItem`.
3. User interaction state such as acknowledgement is persisted separately.
4. Acknowledgement must key off the derived item id rather than rewriting the derived item itself.
5. Future mutations such as dismiss, snooze, reopen, cancel request, or close request must become explicit write-side records rather than extra booleans on the derived item.

## Remaining migration scope from legacy schedule domain

The following legacy responsibilities are still outside this contract and should be introduced as explicit MDDD slices instead of being folded into the current derived milestone model or the initial request submission slice:

- organization HR governance over pending schedule proposals
- request decomposition into `Task` aggregates
- task matching outcomes and explicit `Match` result modeling
- draft / cancellation / closure lifecycle for `ScheduleRequest`
- member assignment / rejection / proposal cancellation / assignment completion lifecycle
- schedule time allocation lifecycle and `Availability` conflict enforcement
- `Capability` requirements and organization / team fulfillment structure
- persistent organization or account `schedule_items` aggregates and projections
- schedule events and notification routing such as `organization:schedule:assigned`, `organization:schedule:assignmentCancelled`, and `organization:schedule:completed`

## Acceptance gates

New schedule features should begin only when:

- the derived item id strategy is stable,
- acknowledgement semantics are explicit for duplicate clicks and idempotent retries,
- finance-driven milestones remain read-only inputs,
- any new write-side action declares whether it mutates acknowledgement state, item presentation, or both,
- and broader organization staffing governance flows are modeled as separate aggregates or slices rather than extra fields on `WorkspaceScheduleItem`.
