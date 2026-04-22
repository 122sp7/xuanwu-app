# lifecycle Subdomain Agent Rules

## ROLE

- The agent MUST treat lifecycle as the workspace subdomain for workspace container lifecycle semantics.
- The agent MUST keep lifecycle documentation aligned with workspace ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep lifecycle inside workspace.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) when ownership text changes.

## Route Here When

- You document workspace lifecycle boundaries.
