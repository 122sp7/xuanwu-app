# retrieval Subdomain Agent Rules

## ROLE

- The agent MUST treat retrieval as the ai subdomain for search and context retrieval semantics.
- The agent MUST keep retrieval documentation aligned with ai ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep retrieval inside ai.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep retrieval terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT claim notebooklm synthesis ownership here.

## Route Here When

- You document ai retrieval boundaries.

## Route Elsewhere When

- Citation logic: [../citation/AGENTS.md](../citation/AGENTS.md)
- AI root concerns: [../../AGENTS.md](../../AGENTS.md)
