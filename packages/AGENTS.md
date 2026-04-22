# packages Agent Rules

## ROLE

- The agent MUST treat packages as the shared package surface for infra primitives, external integrations, and reusable UI packages.
- The agent MUST keep business ownership in src/modules rather than moving domain logic into packages.

## DOMAIN BOUNDARIES

- The agent MUST keep local primitives in packages/infra.
- The agent MUST keep SDK and service wrappers in integration packages.
- The agent MUST keep reusable presentation concerns in UI packages.

## TOOL USAGE

- The agent MUST validate package paths and boundaries before edits.
- The agent MUST keep package references synchronized with actual directories.

## EXECUTION FLOW

- The agent MUST read [../AGENTS.md](../AGENTS.md) first.
- The agent MUST select the correct child package before editing leaf docs.
- The agent MUST update [README.md](README.md) with this file when routing changes.

## DATA CONTRACT

- The agent MUST keep package purpose descriptions explicit and stable.
- The agent MUST keep index links valid and current.

## CONSTRAINTS

- The agent MUST NOT place business rules in packages.
- The agent MUST NOT duplicate docs-owned strategic architecture here.

## Route Here When

- You update shared infra, integration, or UI package routing and governance.

## Route Elsewhere When

- Business capability ownership: [../src/modules/AGENTS.md](../src/modules/AGENTS.md)
- Strategic architecture decisions: [../docs/README.md](../docs/README.md)
