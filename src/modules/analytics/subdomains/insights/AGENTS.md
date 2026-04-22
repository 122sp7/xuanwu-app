# insights Subdomain Agent Rules

## ROLE

- The agent MUST treat insights as the analytics subdomain for derived analysis outputs and interpretation semantics.
- The agent MUST keep insights documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep insights inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep insight terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT present source-domain models as analytics-owned facts.

## Route Here When

- You document analytics insights boundaries.

## Route Elsewhere When

- Metrics logic: [../metrics/AGENTS.md](../metrics/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
