# chunk Subdomain Agent Rules

## ROLE

- The agent MUST treat chunk as the ai subdomain for content chunking semantics.
- The agent MUST keep chunk documentation aligned with ai ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep chunk inside ai.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep chunk terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT redefine notebooklm source ownership here.

## Route Here When

- You document ai chunking boundaries.

## Route Elsewhere When

- Embedding logic: [../embedding/AGENTS.md](../embedding/AGENTS.md)
- AI root concerns: [../../AGENTS.md](../../AGENTS.md)
