# billing Agent Rules

## ROLE

- The agent MUST treat billing as the owner of subscription, entitlement, and usage-governance behavior.
- The agent MUST keep billing focused on commercial capability and access outcomes.

## DOMAIN BOUNDARIES

- The agent MUST keep subscription and entitlement ownership in billing.
- The agent MUST NOT move identity, account, or organization ownership into billing.
- The agent MUST expose billing capability through [index.ts](index.ts).

## TOOL USAGE

- The agent MUST validate subdomain path references before edits.
- The agent MUST keep entitlement and subscription terminology aligned with strategic docs.
- The agent MUST scope billing edits to billing-owned behavior and docs.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Select the owning billing subdomain.
	4. Apply bounded changes.
	5. Validate links and documentation consistency.

## DATA CONTRACT

- The agent MUST keep billing contract names explicit and stable.
- The agent MUST keep subdomain indexes synchronized with actual directories.
- The agent MUST keep command and capability wording aligned with public boundaries.

## CONSTRAINTS

- The agent MUST NOT place IAM or workspace governance rules in billing.
- The agent MUST NOT bypass module index boundaries for cross-module consumption.
- The agent MUST NOT duplicate strategic ownership text beyond routing needs.

## ERROR HANDLING

- The agent MUST report stale links, missing subdomain docs, or ownership ambiguity.
- The agent MUST stop and ask for direction if a change implies schema-version or ownership drift.

## CONSISTENCY

- The agent MUST keep AGENTS focused on routing and behavioral rules.
- The agent MUST keep README focused on human-readable overview.
- The agent MUST keep naming aligned with billing terms in strategic docs.

## SECURITY

- The agent MUST avoid exposing sensitive billing data examples.
- The agent MUST preserve explicit permission and entitlement boundaries in docs.

## Route Here When

- You update subscription, entitlement, or usage-metering behavior or docs.
- You need the billing module boundary or subdomain routing contract.

## Route Elsewhere When

- Identity, session, account, or organization concerns: [../iam/AGENTS.md](../iam/AGENTS.md)
- Route composition and app-level orchestration: [../../app/AGENTS.md](../../app/AGENTS.md)

## Quick Links

- Pair: [README.md](README.md)
- Parent: [../AGENTS.md](../AGENTS.md)
- Public boundary: [index.ts](index.ts)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)
