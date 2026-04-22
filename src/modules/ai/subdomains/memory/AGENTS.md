# memory Subdomain Agent Rules

## ROLE

- The agent MUST treat memory as the ai subdomain for conversational and retained AI state semantics.
- The agent MUST keep memory documentation aligned with ai ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep memory inside ai.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep memory terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT redefine external memory systems here.

## Route Here When

- You document ai memory boundaries.

## Route Elsewhere When

- Context logic: [../context/AGENTS.md](../context/AGENTS.md)
- AI root concerns: [../../AGENTS.md](../../AGENTS.md)
