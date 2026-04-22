# entitlement Subdomain Agent Rules

## ROLE

- The agent MUST treat entitlement as the billing subdomain for effective capability access outcomes.
- The agent MUST keep entitlement documentation aligned with billing ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep entitlement inside the billing bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep entitlement terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move subscription or IAM ownership into this subdomain.

## Route Here When

- You document or adjust entitlement-specific behavior and boundaries.

## Route Elsewhere When

- Subscription lifecycle changes: [../subscription/AGENTS.md](../subscription/AGENTS.md)
- Billing root concerns: [../../AGENTS.md](../../AGENTS.md)
