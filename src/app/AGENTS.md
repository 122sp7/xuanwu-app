# src/app Agent Rules

## ROLE

- The agent MUST treat src/app as App Router composition surface.
- The agent MUST keep page, layout, and route wiring concerns in this subtree.
- The agent MUST keep business behavior outside src/app.

## DOMAIN BOUNDARIES

- The agent MUST NOT place use-case logic in route handlers or page components.
- The agent MUST route business operations through module public APIs.
- The agent MUST keep shared UI primitives in packages, not app-local duplicates.

## TOOL USAGE

- The agent MUST verify route ownership before editing any route group.
- The agent MUST verify imports resolve to public module boundaries.
- The agent MUST keep edits scoped to composition concerns only.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Confirm change is composition-level.
	4. Implement route/layout updates.
	5. Validate links and build/lint impact.

## DATA CONTRACT

- The agent MUST keep route parameter naming consistent with owning context contracts.
- The agent MUST keep path references relative and valid.
- The agent MUST document only composition intent in app docs.

## CONSTRAINTS

- The agent MUST NOT access infrastructure adapters directly from app.
- The agent MUST NOT add cross-context coupling in route composition.
- The agent MUST NOT duplicate module documentation in this file.

## ERROR HANDLING

- The agent MUST fail fast when route ownership is unclear.
- The agent MUST report stale route links or invalid imports.
- The agent MUST stop and escalate when change requires architecture decision.

## CONSISTENCY

- The agent MUST keep AGENTS as routing contract and README as human overview.
- The agent MUST preserve one-way composition flow from app to module public APIs.

## SECURITY

- The agent MUST avoid exposing secrets or raw credentials in route examples.
- The agent MUST preserve auth boundaries by delegating checks to modules/use-cases.

## Route Here When

- You modify page, layout, route groups, parallel routes, loading/error composition.
- You adjust App Router slot composition and rendering boundaries.

## Route Elsewhere When

- Business rules, use cases, domain entities: [../modules/AGENTS.md](../modules/AGENTS.md)
- Shared UI primitives: [../../packages/AGENTS.md](../../packages/AGENTS.md)
- Heavy async ingestion/embedding pipelines: [../../fn/AGENTS.md](../../fn/AGENTS.md)

## Quick Links

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Module layer: [../modules/AGENTS.md](../modules/AGENTS.md)
- Strategic authority: [../../docs/README.md](../../docs/README.md)
