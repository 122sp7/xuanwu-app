# realtime-insights Subdomain Agent Rules

## ROLE

- The agent MUST treat realtime-insights as the analytics subdomain for live analytical signal semantics.
- The agent MUST keep realtime-insights documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep realtime-insights inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep realtime signal terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT redefine upstream real-time behavior as analytics-owned writes.

## Route Here When

- You document analytics realtime-insights boundaries.

## Route Elsewhere When

- Insights logic: [../insights/AGENTS.md](../insights/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
