# security-policy Subdomain Agent Rules

## ROLE

- The agent MUST treat security-policy as the iam subdomain for security rule semantics.
- The agent MUST keep security-policy documentation aligned with iam ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep security-policy inside the iam bounded context.
- The agent MUST route cross-module consumption through [../../index.ts](../../index.ts).

## TOOL USAGE

- The agent MUST keep links valid and workspace-relative.
- The agent MUST keep edits scoped to this subdomain and its pair document.

## EXECUTION FLOW

- The agent MUST read [../../AGENTS.md](../../AGENTS.md) before broad changes.
- The agent MUST update [README.md](README.md) with this file when ownership text changes.

## DATA CONTRACT

- The agent MUST keep security-policy terminology explicit and stable.

## CONSTRAINTS

- The agent MUST NOT include secrets or insecure examples here.

## Route Here When

- You document or adjust security-policy-specific behavior and boundaries.

## Route Elsewhere When

- Authorization concerns: [../authorization/AGENTS.md](../authorization/AGENTS.md)
- IAM root concerns: [../../AGENTS.md](../../AGENTS.md)
