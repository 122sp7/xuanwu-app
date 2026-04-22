# usage-metering Subdomain Agent Rules

## ROLE

- The agent MUST treat usage-metering as the billing subdomain for measuring usage relevant to commercial limits.
- The agent MUST keep usage-metering documentation aligned with billing ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep usage-metering inside the billing bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep usage-metering terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move analytics or entitlement ownership into this subdomain.

## Route Here When

- You document or adjust usage-metering-specific behavior and boundaries.

## Route Elsewhere When

- Entitlement outcomes: [../entitlement/AGENTS.md](../entitlement/AGENTS.md)
- Billing root concerns: [../../AGENTS.md](../../AGENTS.md)
