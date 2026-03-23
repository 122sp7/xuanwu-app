---
title: Billing development contract
description: Implementation contract for billing record queries and the future invoice, settlement, and refund boundaries required for enterprise billing work.
status: "📅 Planned"
---

# Billing development contract

> **開發狀態**：📅 Planned — 已規劃，尚未開始實作

## Scope

This contract defines the current billing module read model and the target boundaries for future enterprise billing slices. It is intentionally conservative because the module currently exposes a list query over an in-memory repository.

## Current owner and dependencies

| Concern | Owner |
| --- | --- |
| Billing record list use case | `modules/billing` |
| Organization and optional workspace scope | `modules/billing` input boundary |
| Persistence | currently in-memory compatibility adapter |

## Current query contract

### Entry point

`getOrganizationBillingRecords(organizationId, workspaceId?)` returns a list of `BillingRecord` values.

### Record shape

| Field | Type | Meaning |
| --- | --- | --- |
| `id` | `string` | Billing record identifier |
| `organizationId` | `string` | Tenant boundary |
| `workspaceId` | `string` | Optional workspace boundary |
| `description` | `string` | Billing line description |
| `amountCents` | `number` | Monetary value in minor units |
| `currency` | `USD \| TWD` | Currency code |
| `status` | `pending \| paid \| failed \| refunded` | Current billing state |
| `invoiceNumber` | `string` | Optional invoice reference |
| `dueAtISO` | `string` | Optional due time |
| `paidAtISO` | `string` | Optional payment time |
| `createdAtISO` | `string` | Creation timestamp |
| `updatedAtISO` | `string` | Last update timestamp |

## Target enterprise write-side slices

Future billing implementation should split at least these aggregates instead of growing `BillingRecord` into a catch-all object:

- invoice issuance
- payment settlement
- refund initiation and completion
- credit or adjustment ledger entries
- failure classification and retry policy

## State machine

| State | Trigger actor | Allowed next states | Notes |
| --- | --- | --- | --- |
| `pending` | invoice or charge issuance | `paid`, `failed`, `refunded` | `refunded` only if cancellation before capture is supported |
| `paid` | settlement confirmation | `refunded` | Terminal for successful charge until refund |
| `failed` | settlement or collection failure | `pending` only through explicit retry or reissue flow | Do not silently reuse failed records |
| `refunded` | refund workflow | terminal | Preserve source settlement reference |

## Invariants

1. Money values stay in minor units.
2. Organization scope is always required, even when workspace scope is present.
3. Provider webhook payloads must not become the billing domain model.
4. Every state change needs a timestamp and source reason before the first production write-side slice lands.

## Acceptance gates

Billing implementation should not proceed past read-side prototypes until:

- Firestore or other durable persistence replaces the in-memory adapter,
- invoice, payment, and refund responsibilities are separate,
- auditability requirements are defined,
- and settlement state transitions are reviewed as high-risk business logic.
