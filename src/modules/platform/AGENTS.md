# platform Agent Rules

## ROLE

- The agent MUST treat platform as the owner of shared operational services and cross-cutting runtime support.
- The agent MUST keep platform focused on operational capability, not IAM or workspace business ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep audit-log, background-job, cache, feature-flag, file-storage, notification, platform-config, and search inside platform.
- The agent MUST expose cross-module capabilities through [index.ts](index.ts).
- The agent MUST keep account and organization ownership in iam.

## TOOL USAGE

- The agent MUST validate subdomain path references before edits.
- The agent MUST keep operational terminology aligned with strategic docs.
- The agent MUST scope edits to platform-owned docs and capabilities.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Select the owning platform subdomain.
	4. Apply bounded changes.
	5. Validate links and terminology consistency.

## DATA CONTRACT

- The agent MUST keep operational service naming explicit and stable.
- The agent MUST keep subdomain indexes synchronized with actual directories.

## CONSTRAINTS

- The agent MUST NOT move identity, account, organization, or collaboration ownership into platform.
- The agent MUST NOT bypass public module boundaries for cross-context collaboration.

## ERROR HANDLING

- The agent MUST report stale links, missing docs, or ownership ambiguity.
- The agent MUST stop and ask for direction if capability ownership becomes unclear.

## CONSISTENCY

- The agent MUST keep AGENTS focused on routing and constraints.
- The agent MUST keep README focused on overview and navigation.

## SECURITY

- The agent MUST preserve secure wording for storage, notifications, and audit surfaces.
- The agent MUST avoid unsafe operational shortcuts in docs.

## Route Here When

- You update platform operational services or their docs.
- You need the platform module boundary or subdomain routing contract.

## Route Elsewhere When

- Identity and organization concerns: [../iam/AGENTS.md](../iam/AGENTS.md)
- Workspace collaboration concerns: [../workspace/AGENTS.md](../workspace/AGENTS.md)

## Quick Links

- Pair: [README.md](README.md)
- Parent: [../AGENTS.md](../AGENTS.md)
- Public boundary: [index.ts](index.ts)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)
