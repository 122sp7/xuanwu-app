# citation Subdomain Agent Rules

## ROLE

- The agent MUST treat citation as the ai subdomain for citation and grounding reference semantics.
- The agent MUST keep citation documentation aligned with ai ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep citation inside ai.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep citation terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT claim source-content ownership here.

## Route Here When

- You document ai citation boundaries.

## Route Elsewhere When

- Retrieval logic: [../retrieval/AGENTS.md](../retrieval/AGENTS.md)
- AI root concerns: [../../AGENTS.md](../../AGENTS.md)
