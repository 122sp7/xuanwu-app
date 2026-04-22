# infra Agent Rules

## ROLE

- The agent MUST treat packages/infra as the home for local infra primitives used across the repo.
- The agent MUST keep infra focused on reusable technical primitives, not external service wrappers or business logic.

## DOMAIN BOUNDARIES

- The agent MUST keep client-state, date, form, http, query, serialization, state, table, trpc, uuid, virtual, and zod primitives inside packages/infra.
- The agent MUST route external-service wrappers to integration packages.

## TOOL USAGE

- The agent MUST validate child package paths before edits.
- The agent MUST keep subpackage references synchronized with actual directories.

## EXECUTION FLOW

- The agent MUST read [../AGENTS.md](../AGENTS.md) first.
- The agent MUST select the correct infra child before editing leaf docs.
- The agent MUST update [README.md](README.md) with this file when routing changes.

## DATA CONTRACT

- The agent MUST keep primitive package purpose descriptions explicit and stable.

## CONSTRAINTS

- The agent MUST NOT place service credentials, SDK wrappers, or business rules in packages/infra.

## Route Here When

- You update local infra primitive routing or governance.

## Route Elsewhere When

- External integrations: [../integration-ai/AGENTS.md](../integration-ai/AGENTS.md)
