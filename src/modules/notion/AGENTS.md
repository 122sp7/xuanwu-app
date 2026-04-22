# notion Agent Rules

## ROLE

- The agent MUST treat notion as the owner of canonical writable knowledge content and its structure.
- The agent MUST keep notion focused on knowledge authoring, structure, and collaboration, not notebooklm reasoning UX or shared AI mechanism ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep block, collaboration, database, knowledge, page, template, and view inside notion.
- The agent MUST expose cross-module capabilities through [index.ts](index.ts).
- The agent MUST keep shared AI mechanism ownership in ai and notebook reasoning UX in notebooklm.

## TOOL USAGE

- The agent MUST validate subdomain path references before edits.
- The agent MUST keep notion terminology aligned with strategic docs.
- The agent MUST scope edits to notion-owned docs and capabilities.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Select the owning notion subdomain.
	4. Apply bounded changes.
	5. Validate links and terminology consistency.

## DATA CONTRACT

- The agent MUST keep knowledge, page, block, template, and collaboration wording precise.
- The agent MUST keep subdomain indexes synchronized with actual directories.

## CONSTRAINTS

- The agent MUST NOT move notebooklm reasoning ownership into notion.
- The agent MUST NOT move generic AI capability ownership into notion.

## ERROR HANDLING

- The agent MUST report stale links, missing docs, or ownership ambiguity.
- The agent MUST stop and ask for direction if notion and notebooklm boundaries blur.

## CONSISTENCY

- The agent MUST keep AGENTS focused on routing and constraints.
- The agent MUST keep README focused on overview and navigation.

## SECURITY

- The agent MUST preserve content ownership and publication wording.
- The agent MUST avoid unsafe content-handling shortcuts in docs.

## Route Here When

- You update notion knowledge, page, block, database, or collaboration behavior or docs.
- You need the notion module boundary or subdomain routing contract.

## Route Elsewhere When

- Notebook reasoning UX concerns: [../notebooklm/AGENTS.md](../notebooklm/AGENTS.md)
- Shared AI mechanism concerns: [../ai/AGENTS.md](../ai/AGENTS.md)

## Quick Links

- Pair: [README.md](README.md)
- Parent: [../AGENTS.md](../AGENTS.md)
- Public boundary: [index.ts](index.ts)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)
