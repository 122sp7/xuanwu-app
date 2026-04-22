# docs Agent Rules

## ROLE

- The agent MUST treat docs as the strategic authority for terminology, ownership, and context relationships.
- The agent MUST use docs to resolve architectural ambiguity before changing code.
- The agent MUST keep this file focused on routing and governance behavior.

## DOMAIN BOUNDARIES

- The agent MUST separate strategic docs from runtime implementation docs.
- The agent MUST NOT redefine bounded-context ownership outside the owning strategic documents.
- The agent MUST NOT treat .github behavior instructions as strategic architecture authority.
- The agent MUST route module implementation decisions back to src runtime docs only after strategic alignment.

## TOOL USAGE

- The agent MUST verify every referenced doc path exists before adding links.
- The agent MUST use minimal edits and avoid duplicating large architecture blocks across files.
- The agent MUST synchronize command references with [tooling/commands-reference.md](tooling/commands-reference.md).

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read [README.md](README.md).
	2. Read strategic system docs in [structure/system](structure/system).
	3. Read strategic domain docs in [structure/domain](structure/domain).
	4. Read owning context docs in [structure/contexts](structure/contexts).
	5. Apply or update docs and report any conflicts.

## DATA CONTRACT

- The agent MUST keep links relative to the docs root.
- The agent MUST use consistent naming and path display across context links.
- The agent MUST keep ADR references valid and explicit.

## CONSTRAINTS

- The agent MUST NOT duplicate strategic definitions in runtime readmes.
- The agent MUST NOT add undocumented terms when a canonical term already exists.
- The agent MUST NOT leave unresolved ownership conflicts undocumented.

## ERROR HANDLING

- The agent MUST fail fast on missing authority documents.
- The agent MUST flag broken or stale links immediately.
- The agent MUST stop and request direction when two authority docs conflict and no ADR resolves it.

## CONSISTENCY

- The agent MUST keep docs/README as the human entry point.
- The agent MUST keep docs/AGENTS as routing and governance constraints.
- The agent MUST keep context docs aligned with domain/system authority docs.

## SECURITY

- The agent MUST NOT include secrets or sensitive operational details in docs.
- The agent MUST keep security guidance aligned with principle-of-least-privilege language.

## Route Here When

- You need strategic clarification for bounded-context ownership or terminology.
- You need authoritative context-map and integration direction.

## Route Elsewhere When

- Runtime composition and implementation work: [../src/AGENTS.md](../src/AGENTS.md)
- Repository-level routing decisions: [../AGENTS.md](../AGENTS.md)

## Quick Links

- Entry: [README.md](README.md)
- System authority: [structure/system/architecture-overview.md](structure/system/architecture-overview.md)
- Domain authority: [structure/domain/bounded-contexts.md](structure/domain/bounded-contexts.md)
- Terminology authority: [structure/domain/ubiquitous-language.md](structure/domain/ubiquitous-language.md)
- Context map: [structure/system/context-map.md](structure/system/context-map.md)
- ADR index: [decisions/README.md](decisions/README.md)
