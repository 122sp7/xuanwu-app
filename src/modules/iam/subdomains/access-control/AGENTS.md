# access-control Subdomain Agent Rules

## ROLE

- The agent MUST treat access-control as the iam subdomain for access decision rules.
- The agent MUST keep access-control documentation aligned with iam ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep access-control inside the iam bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep access-control terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move workspace membership or billing entitlement ownership here.

## Route Here When

- You document or adjust access-control-specific behavior and boundaries.

## Route Elsewhere When

- Session concerns: [../session/AGENTS.md](../session/AGENTS.md)
- IAM root concerns: [../../AGENTS.md](../../AGENTS.md)
