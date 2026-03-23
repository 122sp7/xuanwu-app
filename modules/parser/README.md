# Parser Module

> **開發狀態**：🏗️ Midway — 開發部分完成

## Purpose

The parser module owns parser readiness, parser-specific summary derivation, and future parser job orchestration. It does not own file storage, workspace identity, or RAG chunk persistence.

## Current boundary

- query-side summary only
- derives readiness from workspace context plus file-module data
- no parser job write-side yet

## Source of truth

- development contract: `/home/runner/work/xuanwu-app/xuanwu-app/docs/reference/development-contracts/parser-contract.md`
- architecture baseline: `/home/runner/work/xuanwu-app/xuanwu-app/ARCHITECTURE.md`

## Current interface entrypoints

- `modules/parser/interfaces/queries/parser.queries.ts`
- `modules/parser/application/use-cases/get-workspace-parser-summary.use-case.ts`

## Key rule

Future parser execution must introduce parser-owned job records instead of mutating workspace or file records to simulate parser state.
