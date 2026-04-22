# notebooklm Agent Rules

## ROLE

- The agent MUST treat notebooklm as the owner of notebook-based reasoning UX and derived synthesis flows.
- The agent MUST keep notebooklm focused on notebook conversation and synthesis experience, not shared AI mechanism ownership.

## DOMAIN BOUNDARIES

- The agent MUST keep conversation, notebook, source, and synthesis inside notebooklm.
- The agent MUST expose cross-module capabilities through [index.ts](index.ts).
- The agent MUST keep generic AI mechanism ownership in ai and canonical writable knowledge ownership in notion.

## TOOL USAGE

- The agent MUST validate subdomain path references before edits.
- The agent MUST keep notebooklm terminology aligned with strategic docs.
- The agent MUST scope edits to notebooklm-owned docs and capabilities.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Select the owning notebooklm subdomain.
	4. Apply bounded changes.
	5. Validate links and terminology consistency.

## DATA CONTRACT

- The agent MUST keep notebook, conversation, source, and synthesis wording precise.
- The agent MUST keep subdomain indexes synchronized with actual directories.

## CONSTRAINTS

- The agent MUST NOT move AI mechanism ownership from ai into notebooklm.
- The agent MUST NOT move canonical writable knowledge ownership from notion into notebooklm.

## ERROR HANDLING

- The agent MUST report stale links, missing docs, or ownership ambiguity.
- The agent MUST stop and ask for direction if notebooklm and notion boundaries blur.

## CONSISTENCY

- The agent MUST keep AGENTS focused on routing and constraints.
- The agent MUST keep README focused on overview and navigation.

## SECURITY

- The agent MUST preserve source and retrieval traceability wording.
- The agent MUST avoid unsafe data-handling shortcuts in docs.

## Route Here When

- You update notebooklm notebook, conversation, source, or synthesis behavior or docs.
- You need the notebooklm module boundary or subdomain routing contract.

## Route Elsewhere When

- Shared AI mechanism concerns: [../ai/AGENTS.md](../ai/AGENTS.md)
- Canonical writable knowledge concerns: [../notion/AGENTS.md](../notion/AGENTS.md)

## Quick Links

- Pair: [README.md](README.md)
- Parent: [../AGENTS.md](../AGENTS.md)
- Public boundary: [index.ts](index.ts)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)
