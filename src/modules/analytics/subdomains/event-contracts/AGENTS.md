# event-contracts Subdomain Agent Rules

## ROLE

- The agent MUST treat event-contracts as the analytics subdomain for published event shapes and ingestion-facing contracts.
- The agent MUST keep event-contracts documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep event-contracts inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep contract naming explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT redefine upstream domain facts here.

## Route Here When

- You document analytics event contract boundaries.

## Route Elsewhere When

- Projection logic: [../event-projection/AGENTS.md](../event-projection/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
