# generation Subdomain Agent Rules

## ROLE

- The agent MUST treat generation as the ai subdomain for model output generation semantics.
- The agent MUST keep generation documentation aligned with ai ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep generation inside ai.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep generation terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT claim product UX ownership here.

## Route Here When

- You document ai generation boundaries.

## Route Elsewhere When

- Pipeline logic: [../pipeline/AGENTS.md](../pipeline/AGENTS.md)
- AI root concerns: [../../AGENTS.md](../../AGENTS.md)
