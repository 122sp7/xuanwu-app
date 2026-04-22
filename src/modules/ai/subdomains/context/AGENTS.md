# context Subdomain Agent Rules

## ROLE

- The agent MUST treat context as the ai subdomain for prompt context assembly semantics.
- The agent MUST keep context documentation aligned with ai ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep context inside ai.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep context terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT move notebooklm conversation ownership here.

## Route Here When

- You document ai context assembly boundaries.

## Route Elsewhere When

- Memory logic: [../memory/AGENTS.md](../memory/AGENTS.md)
- AI root concerns: [../../AGENTS.md](../../AGENTS.md)
