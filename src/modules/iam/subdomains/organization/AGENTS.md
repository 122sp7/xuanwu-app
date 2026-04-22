# organization Subdomain Agent Rules

## ROLE

- The agent MUST treat organization as the iam subdomain for organization lifecycle and governance semantics.
- The agent MUST keep organization documentation aligned with iam ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep organization inside the iam bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep organization terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move workspace membership ownership into this subdomain.

## Route Here When

- You document or adjust organization-specific behavior and boundaries.

## Route Elsewhere When

- Account concerns: [../account/AGENTS.md](../account/AGENTS.md)
- IAM root concerns: [../../AGENTS.md](../../AGENTS.md)
