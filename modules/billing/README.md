# Billing Module

> **開發狀態**：📅 Planned — 已規劃，尚未開始實作

## Purpose

The billing module owns billing records, invoice and settlement workflows, refund handling, and future credit or adjustment ledgers. It is a high-risk domain and requires explicit contracts before write-side expansion.

## Current boundary

- read-side billing record list only
- in-memory repository placeholder
- no canonical invoice, settlement, refund, or ledger write-side yet

## Source of truth

- development contract: `/home/runner/work/xuanwu-app/xuanwu-app/docs/development-reference/reference/development-contracts/billing-contract.md`
- architecture baseline: `/home/runner/work/xuanwu-app/xuanwu-app/ARCHITECTURE.md`

## Current interface entrypoints

- `modules/billing/interfaces/queries/billing.queries.ts`
- `modules/billing/application/use-cases/list-billing-records.use-case.ts`

## Key rule

Provider payloads and persistence adapters must stay outside the billing domain model, and every future billing state transition must remain explicit and auditable.
