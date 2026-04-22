# authorization Subdomain Agent Rules

## ROLE

- The agent MUST treat authorization as the iam subdomain for permission evaluation semantics.
- The agent MUST keep authorization documentation aligned with iam ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep authorization inside the iam bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep authorization terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move billing or workspace ownership here.

## Route Here When

- You document or adjust authorization-specific behavior and boundaries.

## Route Elsewhere When

- Access-control concerns: [../access-control/AGENTS.md](../access-control/AGENTS.md)
- IAM root concerns: [../../AGENTS.md](../../AGENTS.md)
