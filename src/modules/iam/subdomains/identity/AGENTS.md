# identity Subdomain Agent Rules

## ROLE

- The agent MUST treat identity as the iam subdomain for actor and identity semantics.
- The agent MUST keep identity documentation aligned with iam ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep identity inside the iam bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep identity terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT move actor or tenant semantics outside iam.

## Route Here When

- You document or adjust identity-specific behavior and boundaries.

## Route Elsewhere When

- Tenant concerns: [../tenant/AGENTS.md](../tenant/AGENTS.md)
- IAM root concerns: [../../AGENTS.md](../../AGENTS.md)
