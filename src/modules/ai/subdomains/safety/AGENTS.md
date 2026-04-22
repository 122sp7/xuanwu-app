# safety Subdomain Agent Rules

## ROLE

- The agent MUST treat safety as the ai subdomain for guardrail and safety evaluation semantics.
- The agent MUST keep safety documentation aligned with ai ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep safety inside ai.
- The agent MUST route cross-module use through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep safety terminology explicit and stable.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## CONSTRAINTS

- The agent MUST NOT include harmful examples or unsafe policy shortcuts.

## Route Here When

- You document ai safety boundaries.

## Route Elsewhere When

- Evaluation logic: [../evaluation/AGENTS.md](../evaluation/AGENTS.md)
- AI root concerns: [../../AGENTS.md](../../AGENTS.md)
