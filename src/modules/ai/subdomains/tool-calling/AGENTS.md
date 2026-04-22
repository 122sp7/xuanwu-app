# tool-calling Subdomain Agent Rules

## ROLE

- The agent MUST treat tool-calling as the ai subdomain for tool invocation orchestration semantics.
- The agent MUST keep tool-calling documentation aligned with ai ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep tool-calling inside ai.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep tool-calling terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT turn tool-calling docs into provider-specific SDK docs.

## Route Here When

- You document ai tool-calling boundaries.

## Route Elsewhere When

- Pipeline logic: [../pipeline/AGENTS.md](../pipeline/AGENTS.md)
- AI root concerns: [../../AGENTS.md](../../AGENTS.md)
