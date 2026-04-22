# iam Agent Rules

## ROLE

- The agent MUST treat iam as the owner of identity, access control, tenant, account, and organization governance.
- The agent MUST keep iam focused on access and identity semantics, not workspace collaboration or billing logic.

## DOMAIN BOUNDARIES

- The agent MUST keep account and organization ownership in iam.
- The agent MUST keep security-policy, session, and access-control concerns inside iam.
- The agent MUST expose cross-module identity capability through [index.ts](index.ts).

## TOOL USAGE

- The agent MUST validate subdomain path references before edits.
- The agent MUST keep terminology aligned with strategic identity language.
- The agent MUST scope changes to iam-owned docs and capabilities.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Select the owning iam subdomain.
	4. Apply bounded changes.
	5. Validate links and terminology consistency.

## DATA CONTRACT

- The agent MUST keep identity and access contract terms explicit.
- The agent MUST keep subdomain indexes synchronized with actual directories.
- The agent MUST keep accountId, actor, tenant, and organization wording precise.

## CONSTRAINTS

- The agent MUST NOT move workspace membership or billing entitlement ownership into iam.
- The agent MUST NOT bypass public module boundaries for cross-context collaboration.
- The agent MUST NOT duplicate full strategic docs in this routing file.

## ERROR HANDLING

- The agent MUST report stale links, missing subdomain docs, and naming conflicts.
- The agent MUST stop and ask for direction if ownership or published language is unclear.

## CONSISTENCY

- The agent MUST keep AGENTS focused on routing and constraints.
- The agent MUST keep README focused on overview and navigation.
- The agent MUST keep naming aligned with strategic IAM terminology.

## SECURITY

- The agent MUST treat identity and access documentation as security-sensitive.
- The agent MUST avoid exposing secrets, tokens, or unsafe examples.

## Route Here When

- You update identity, access-control, tenant, session, account, or organization behavior or docs.
- You need the iam module boundary or subdomain routing contract.

## Route Elsewhere When

- Workspace collaboration scope: [../workspace/AGENTS.md](../workspace/AGENTS.md)
- Billing entitlement and subscription concerns: [../billing/AGENTS.md](../billing/AGENTS.md)

## Quick Links

- Pair: [README.md](README.md)
- Parent: [../AGENTS.md](../AGENTS.md)
- Public boundary: [index.ts](index.ts)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)
