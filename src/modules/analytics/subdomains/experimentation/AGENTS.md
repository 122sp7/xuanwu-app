# experimentation Subdomain Agent Rules

## ROLE

- The agent MUST treat experimentation as the analytics subdomain for experiment and observation semantics.
- The agent MUST keep experimentation documentation aligned with analytics ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep experimentation inside analytics.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep experimentation terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT move product write ownership into analytics.

## Route Here When

- You document analytics experimentation boundaries.

## Route Elsewhere When

- Insights logic: [../insights/AGENTS.md](../insights/AGENTS.md)
- Analytics root concerns: [../../AGENTS.md](../../AGENTS.md)
