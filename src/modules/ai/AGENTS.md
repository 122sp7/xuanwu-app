# ai Agent Rules

## ROLE

- The agent MUST treat ai as the mechanism capability module for generation, retrieval, safety, and tool-calling primitives.
- The agent MUST keep AI mechanism ownership in this context while leaving product UX composition to consumer contexts.

## DOMAIN BOUNDARIES

- The agent MUST keep ai subdomains focused on reusable AI capability, not feature UX.
- The agent MUST NOT move notebook/chat product workflow ownership into ai.
- The agent MUST expose cross-context collaboration via [index.ts](index.ts) only.

## TOOL USAGE

- The agent MUST validate subdomain paths before index or doc updates.
- The agent MUST keep AI contract changes schema-explicit.
- The agent MUST keep edits scoped to ai ownership.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [../AGENTS.md](../AGENTS.md).
	2. Read this file and [README.md](README.md).
	3. Identify owning ai subdomain.
	4. Apply bounded edits.
	5. Validate boundary and references.

## DATA CONTRACT

- The agent MUST keep subdomain index synchronized with actual directories.
- The agent MUST keep public capability contracts stable or versioned.
- The agent MUST keep links relative and valid.

## CONSTRAINTS

- The agent MUST NOT bypass ai module boundary for cross-context calls.
- The agent MUST NOT duplicate strategic ownership text here.
- The agent MUST NOT introduce framework/runtime leakage into domain layer.

## ERROR HANDLING

- The agent MUST report stale subdomain links.
- The agent MUST fail fast on ambiguous ownership.
- The agent MUST escalate when strategic and runtime rules conflict.

## CONSISTENCY

- The agent MUST keep AGENTS for routing/rules and README for overview.
- The agent MUST keep naming aligned with docs ubiquitous language.

## SECURITY

- The agent MUST preserve safety and policy boundaries for AI outputs.
- The agent MUST avoid secret/key exposure in examples and docs.

## Route Here When

- You change ai mechanism subdomains or capability contracts.
- You update generation/retrieval/safety/tool-calling internals.

## Route Elsewhere When

- Notebook/user conversation UX: [../notebooklm/AGENTS.md](../notebooklm/AGENTS.md)
- Knowledge content ownership: [../notion/AGENTS.md](../notion/AGENTS.md)
- Workspace task business process: [../workspace/AGENTS.md](../workspace/AGENTS.md)

## Quick Links

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Public boundary: [index.ts](index.ts)
- Strategic authority: [../../../docs/README.md](../../../docs/README.md)
