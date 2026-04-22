# subscription Subdomain Agent Rules

## ROLE

- The agent MUST treat subscription as the billing subdomain for plan lifecycle and commercial status.
- The agent MUST keep subscription documentation aligned with billing ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep subscription inside the billing bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep subscription terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move entitlement, IAM, or workspace ownership into this subdomain.

## Route Here When

- You document or adjust subscription-specific behavior and boundaries.

## Route Elsewhere When

- Entitlement capability outcomes: [../entitlement/AGENTS.md](../entitlement/AGENTS.md)
- Billing root concerns: [../../AGENTS.md](../../AGENTS.md)
