# event-projection Subdomain Agent Rules

## ROLE

- The agent MUST treat event-projection as the analytics subdomain for read-model projection semantics.
- The agent MUST keep event-projection documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep event-projection inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep projection terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT redefine source-domain ownership here.

## Route Here When

- You document analytics projection boundaries.

## Route Elsewhere When

- Metrics logic: [../metrics/AGENTS.md](../metrics/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
