---
title: Acceptance development contract
description: Implementation contract for derived workspace acceptance gates and the rules that future approval flows must preserve.
---

# Acceptance development contract

## Scope

This contract defines the current acceptance module boundary, which is a derived workspace readiness projection, and the constraints that future approval or override flows must satisfy.

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Acceptance gate derivation | `modules/acceptance` |
| Workspace lifecycle, address, personnel, capability, and location context | `modules/workspace` |

## Current query contract

### Entry point

`getWorkspaceAcceptanceSummary(workspace)` returns a `WorkspaceAcceptanceSummary`.

### Output shape

| Field | Type | Meaning |
| --- | --- | --- |
| `gates` | `AcceptanceGate[]` | Derived gate list |
| `readyCount` | `number` | Count of ready gates |
| `overallReady` | `boolean` | Aggregate readiness indicator |

### Gate shape

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `string` | Stable derived gate identifier |
| `label` | `string` | Gate label |
| `status` | `ready \| attention` | Derived readiness result |
| `detail` | `string` | Supporting message |

## State machine

| State | Trigger actor | Allowed next states | Notes |
| --- | --- | --- | --- |
| `attention` | derived acceptance summary | `ready` | Computed from workspace snapshot |
| `ready` | derived acceptance summary | `attention` | Also computed from workspace snapshot |
| `approved` | future explicit acceptance workflow | terminal until a later revoke flow exists | Must not overwrite derived gate status |

The current module only owns `attention` and `ready` as derived states. `approved` is a future business decision state and must be modeled separately if it is introduced.

## Invariants

1. Acceptance gates remain derived from workspace state until a product decision introduces explicit approval events.
2. Future manual overrides must not rewrite `WorkspaceEntity` fields to simulate readiness.
3. Acceptance approval, waiver, or sign-off must become acceptance-owned write records.
4. The summary remains safe to recompute at any time from workspace input plus any future acceptance-owned overrides.

## Acceptance gates for development

Before acceptance write-side work begins, the team should decide:

- whether approval is per gate or per workspace summary,
- which actor can approve, waive, or reopen a gate,
- whether approval changes user-visible readiness or only governance state,
- and where approval audit records are stored.
