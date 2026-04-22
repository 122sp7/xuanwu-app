# feature-flag Subdomain Agent Rules

## ROLE

- The agent MUST treat feature-flag as the platform subdomain for release gating semantics.
- The agent MUST keep feature-flag documentation aligned with platform ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep feature-flag inside platform.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) when ownership text changes.

## Route Here When

- You document platform feature-flag boundaries.
