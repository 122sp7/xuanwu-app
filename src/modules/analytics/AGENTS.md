# analytics Agent Rules

## ROLE

- The agent MUST treat analytics as the read-model and insights capability module.
- The agent MUST keep analytics focused on event ingestion, projection, and reporting outputs.

## DOMAIN BOUNDARIES

- The agent MUST keep analytics downstream from source domains.
- The agent MUST NOT place upstream business write ownership in analytics.
- The agent MUST expose integration through [index.ts](index.ts) and event contracts.

## TOOL USAGE

- The agent MUST validate subdomain path references before updates.
- The agent MUST keep metric/projection contract changes explicit.
- The agent MUST keep edits scoped to analytics ownership.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Select owning analytics subdomain.
	4. Apply bounded changes.
	5. Validate links and boundaries.

## DATA CONTRACT

- The agent MUST keep event and projection contract naming stable.
- The agent MUST keep subdomain index synchronized with actual directories.
- The agent MUST keep links relative and valid.

## CONSTRAINTS

- The agent MUST NOT mutate upstream domain ownership from analytics.
- The agent MUST NOT bypass event-contract boundaries.
- The agent MUST NOT duplicate strategic authority text in this routing file.

## ERROR HANDLING

- The agent MUST report stale links or missing subdomain docs.
- The agent MUST stop on ownership conflicts and request direction.

## CONSISTENCY

- The agent MUST keep AGENTS as routing/rules and README as overview.
- The agent MUST keep analytics terminology aligned with strategic docs.

## SECURITY

- The agent MUST avoid exposing sensitive event payload examples.
- The agent MUST preserve tenant/account scope in analytics contracts.

## Route Here When

- You update event ingestion/projection/metrics/insights capabilities.
- You change analytics module contracts or subdomain implementation placement.

## Route Elsewhere When

- Route composition and UI rendering: [../../app/AGENTS.md](../../app/AGENTS.md)
- Upstream business ownership: owning module AGENTS under [../](../)

## Quick Links

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)
