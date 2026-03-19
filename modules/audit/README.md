# Audit Module

## Purpose

The audit module owns append-only audit visibility for workspace and organization scopes. It should become the stable sink for future audit events emitted by other modules.

## Current boundary

- workspace and organization audit queries
- Firebase-backed read path
- no explicit audit sink contract for upstream writers yet

## Source of truth

- development contract: `/home/runner/work/xuanwu-app/xuanwu-app/docs/reference/development-contracts/audit-contract.md`
- architecture baseline: `/home/runner/work/xuanwu-app/xuanwu-app/ARCHITECTURE.md`

## Current interface entrypoints

- `modules/audit/interfaces/queries/audit.queries.ts`
- `modules/audit/application/use-cases/audit.use-cases.ts`

## Key rule

Audit records are append-only evidence, not operational state. Future integrations must emit audit events through an audit-owned boundary instead of writing directly to storage.
