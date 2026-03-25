---
title: Billing development contract
description: Implementation contract for billing record queries and the future invoice, settlement, and refund boundaries required for enterprise billing work.
status: "📅 Planned"
---

# Billing development contract

> **開發狀態**：📅 Planned — 已規劃，尚未開始實作

## Scope

Current billing module: read-side queries over in-memory data. Target: future invoice, settlement, and refund slices.

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
| `id` | `string` | Record identifier |
| `organizationId` | `string` | Tenant |
| `workspaceId` | `string?` | Workspace scope |
| `description` | `string` | Line description |
| `amountCents` | `number` | Minor units |
| `currency` | `USD\|TWD` | Code |
| `status` | `pending\|paid\|failed\|refunded` | State |
| `invoiceNumber` | `string?` | Invoice ref |
| `dueAtISO` | `string?` | Due time |
| `paidAtISO` | `string?` | Payment time |
| `createdAtISO` | `string` | Created |
| `updatedAtISO` | `string` | Updated |

## Target write-side slices

- Invoice issuance  
- Payment settlement
- Refund workflow
- Credit/adjustment ledger
- Failure + retry policy

## State machine

| State | Trigger actor | Allowed next states | Notes |
| --- | --- | --- | --- |
| `pending` | Issue | `paid`, `failed`, `refunded` | |
| `paid` | Settle | `refunded` | Terminal until refund |
| `failed` | Failure | `pending` only via retry | No silent reuse |
| `refunded` | Refund | terminal | Preserve src ref |

## Invariants

1. Money in minor units only
2. Organization required; workspace optional
3. Provider webhooks ≠ domain model
4. Every state change: timestamp + reason

## Acceptance gates

Before write-side, complete:
- Durable persistence (replace in-memory)
- Invoice/payment/refund split
- Auditability requirements
- Settlement state review (high-risk)
