# pipeline Subdomain Agent Rules

## ROLE

- The agent MUST treat pipeline as the ai subdomain for multi-step orchestration and pipeline semantics.
- The agent MUST keep pipeline documentation aligned with ai ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep pipeline inside ai.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep pipeline terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT turn pipeline docs into provider-specific implementation docs.

## Route Here When

- You document ai pipeline boundaries.

## Route Elsewhere When

- Generation logic: [../generation/AGENTS.md](../generation/AGENTS.md)
- AI root concerns: [../../AGENTS.md](../../AGENTS.md)
