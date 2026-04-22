# authentication Subdomain Agent Rules

## ROLE

- The agent MUST treat authentication as the iam subdomain for identity proof and sign-in semantics.
- The agent MUST keep authentication documentation aligned with iam ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep authentication inside the iam bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep authentication terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move session or federation ownership here without reason.

## Route Here When

- You document or adjust authentication-specific behavior and boundaries.

## Route Elsewhere When

- Session concerns: [../session/AGENTS.md](../session/AGENTS.md)
- IAM root concerns: [../../AGENTS.md](../../AGENTS.md)
