# issue Subdomain Agent Rules

## ROLE

- The agent MUST treat issue as the workspace subdomain for issue lifecycle semantics.
- The agent MUST keep issue documentation aligned with workspace ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep issue inside workspace.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) when ownership text changes.

## Route Here When

- You document workspace issue boundaries.
