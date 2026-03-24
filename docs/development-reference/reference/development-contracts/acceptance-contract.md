---
title: Acceptance development contract
description: Implementation contract for derived workspace acceptance gates and the rules that future approval flows must preserve.
status: "🏗️ Midway"
---

# Acceptance development contract

> **開發狀態**：🏗️ Midway — 開發部分完成

## Scope

Acceptance module boundary: derived workspace readiness projection and constraints for future approval or override flows.

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
| `attention` | derived summary | `ready` | Computed from workspace snapshot |
| `ready` | derived summary | `attention` | Computed from workspace snapshot |
| `approved` | future explicit workflow | terminal (until revoke exists) | Cannot overwrite derived status |

Current module owns `attention` and `ready`. `approved` is future business state, modeled separately.

## Invariants

1. Gates remain derived from workspace state until explicit approval events are introduced.
2. Future manual overrides must not rewrite workspace fields to simulate readiness.
3. Approval, waiver, or sign-off must become acceptance-owned write records.
4. Summary stays safe to recompute from workspace input + any future overrides.

## Open blockers

Before write-side work begins, decide:
- Approval scope (per gate or whole summary)?
- Who can approve / waive / reopen?
- Does approval affect user-visible readiness?
- Where are approval records stored?
