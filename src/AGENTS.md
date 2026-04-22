# src Agent Rules

## ROLE

- The agent MUST treat src as the runtime entry for Next.js composition and bounded-context modules.
- The agent MUST route UI shell and route composition work to app.
- The agent MUST route business behavior implementation to modules.

## DOMAIN BOUNDARIES

- The agent MUST keep dependency direction aligned with interfaces -> application -> domain <- infrastructure.
- The agent MUST NOT place business rules in route composition files under app.
- The agent MUST NOT bypass module public boundaries when crossing contexts.
- The agent MUST treat [docs/README.md](../docs/README.md) as strategic authority.

## TOOL USAGE

- The agent MUST validate target ownership before edits in src.
- The agent MUST validate commands and scripts via repository package configuration.
- The agent MUST prefer minimal, scoped edits for each subtree.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file.
	3. Enter [app/AGENTS.md](app/AGENTS.md) or [modules/AGENTS.md](modules/AGENTS.md).
	4. Read paired README in the same subtree.
	5. Implement and validate.

## DATA CONTRACT

- The agent MUST keep route and module links valid and workspace-relative.
- The agent MUST keep ownership language aligned with bounded-context terms.
- The agent MUST keep command guidance synchronized with [../docs/tooling/commands-reference.md](../docs/tooling/commands-reference.md).

## CONSTRAINTS

- The agent MUST NOT import peer module internals directly from another context.
- The agent MUST NOT move strategic ownership definitions into src docs.
- The agent MUST NOT duplicate deep implementation details in this routing file.

## ERROR HANDLING

- The agent MUST stop when ownership is ambiguous and request clarification.
- The agent MUST report stale links or stale route references before continuing.
- The agent MUST fail fast on missing subtree docs.

## CONSISTENCY

- The agent MUST keep this file as routing-only contract.
- The agent MUST keep [README.md](README.md) as human overview.
- The agent MUST preserve consistent path and naming style across src docs.

## SECURITY

- The agent MUST avoid exposing secrets in route docs or examples.
- The agent MUST respect boundary rules and least-privilege assumptions across layers.

## Route Here When

- You need to decide whether a change belongs to app or modules.
- You need src-level runtime routing before deeper edits.

## Route Elsewhere When

- App Router composition work: [app/AGENTS.md](app/AGENTS.md)
- Bounded-context implementation work: [modules/AGENTS.md](modules/AGENTS.md)
- Strategic ownership and terminology: [../docs/README.md](../docs/README.md)

## Quick Links

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- App layer: [app/AGENTS.md](app/AGENTS.md) and [app/README.md](app/README.md)
- Module layer: [modules/AGENTS.md](modules/AGENTS.md) and [modules/README.md](modules/README.md)
