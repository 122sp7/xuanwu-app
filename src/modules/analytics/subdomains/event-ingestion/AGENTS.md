# event-ingestion Subdomain Agent Rules

## ROLE

- The agent MUST treat event-ingestion as the analytics subdomain for receiving and normalizing analytics inputs.
- The agent MUST keep event-ingestion documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep event-ingestion inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep ingestion terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT move upstream write ownership into analytics.

## Route Here When

- You document analytics event ingestion boundaries.

## Route Elsewhere When

- Event contracts: [../event-contracts/AGENTS.md](../event-contracts/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
