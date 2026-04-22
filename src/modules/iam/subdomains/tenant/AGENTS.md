# tenant Subdomain Agent Rules

## ROLE

- The agent MUST treat tenant as the iam subdomain for tenant scope and isolation semantics.
- The agent MUST keep tenant documentation aligned with iam ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep tenant inside the iam bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep tenant terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT mix tenant scope with workspace scope language.

## Route Here When

- You document or adjust tenant-specific behavior and boundaries.

## Route Elsewhere When

- Identity concerns: [../identity/AGENTS.md](../identity/AGENTS.md)
- IAM root concerns: [../../AGENTS.md](../../AGENTS.md)
