# account Subdomain Agent Rules

## ROLE

- The agent MUST treat account as the iam subdomain for account lifecycle and account-scoped identity semantics.
- The agent MUST keep account documentation aligned with iam ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep account inside the iam bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep account terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move organization or workspace ownership here.

## Route Here When

- You document or adjust account-specific behavior and boundaries.

## Route Elsewhere When

- Organization concerns: [../organization/AGENTS.md](../organization/AGENTS.md)
- IAM root concerns: [../../AGENTS.md](../../AGENTS.md)
