# workspace Agent Rules

## ROLE

- The agent MUST treat workspace as the owner of collaboration container behavior and workspace-local coordination.
- The agent MUST keep workspace focused on collaboration scope, not identity governance or shared AI mechanisms.

## DOMAIN BOUNDARIES

- The agent MUST keep membership, share scope, lifecycle, task, and collaboration flows inside workspace.
- The agent MUST expose cross-module capabilities through [index.ts](index.ts).
- The agent MUST keep identity and access ownership in iam.

## TOOL USAGE

- The agent MUST validate subdomain path references before edits.
- The agent MUST keep workspace terminology aligned with strategic docs.
- The agent MUST scope edits to workspace-owned docs and capabilities.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Select the owning workspace subdomain.
	4. Apply bounded changes.
	5. Validate links and terminology consistency.

## DATA CONTRACT

- The agent MUST keep workspaceId, membership, share scope, and activity wording precise.
- The agent MUST keep subdomain indexes synchronized with actual directories.

## CONSTRAINTS

- The agent MUST NOT move IAM, billing, or platform operational ownership into workspace.
- The agent MUST NOT bypass module index boundaries for cross-context collaboration.

## ERROR HANDLING

- The agent MUST report stale links, missing docs, or ownership ambiguity.
- The agent MUST stop and ask for direction if published language becomes unclear.

## CONSISTENCY

- The agent MUST keep AGENTS focused on routing and constraints.
- The agent MUST keep README focused on overview and navigation.

## SECURITY

- The agent MUST preserve access and sharing boundary language.
- The agent MUST avoid documenting unsafe permission shortcuts.

## Route Here When

- You update workspace collaboration, task, sharing, lifecycle, or activity behavior or docs.
- You need the workspace module boundary or subdomain routing contract.

## Route Elsewhere When

- Identity, authorization, or tenant concerns: [../iam/AGENTS.md](../iam/AGENTS.md)
- Shared AI capability concerns: [../ai/AGENTS.md](../ai/AGENTS.md)

## Quick Links

- Pair: [README.md](README.md)
- Parent: [../AGENTS.md](../AGENTS.md)
- Public boundary: [index.ts](index.ts)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)
