# workspace-workflow / application / process-managers

## Purpose

This directory contains **process managers** — long-lived, event-driven
application services that coordinate cross-module integration flows across
multiple use-case boundaries.

A process manager is **not** a use case (it does not have a single actor
goal and a single main-success-scenario). It listens to domain events and
orchestrates downstream reactions, managing process state across multiple
aggregates or modules.

## Current Process Managers

| File | Role |
|------|------|
| `knowledge-to-workflow-materializer.ts` | Listens to `notion.knowledge.*` events and materialises work-demand entities in the workspace-workflow subdomain. Confirmed process manager — retains application-layer placement. |

## Placement Rationale

`knowledge-to-workflow-materializer.ts` was reviewed against the query
"read-model projection vs. process manager" in **ADR-5201** and confirmed
to be a genuine process manager: it owns temporal coordination, multi-step
side-effects, and cross-module event/command dispatch.  It therefore
remains here and is **not** moved to `interfaces/` or `infrastructure/`.

> See: `docs/decisions/5201-accidental-complexity-workspace-workflow-application.md`
