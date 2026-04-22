# Repository Agent Rules

## ROLE

- The agent MUST treat this file as the repository-level routing contract.
- The agent MUST enter the correct child AGENTS file before editing code in that subtree.
- The agent MUST keep AGENTS focused on runtime constraints and README focused on human overview.

## DOMAIN BOUNDARIES

- The agent MUST route app and module implementation work through [src/AGENTS.md](src/AGENTS.md).
- The agent MUST route shared package work through [packages/AGENTS.md](packages/AGENTS.md).
- The agent MUST route worker runtime work through [fn/AGENTS.md](fn/AGENTS.md).
- The agent MUST treat [docs/README.md](docs/README.md) as strategic authority for terminology and ownership.
- The agent MUST NOT redefine bounded-context ownership in runtime docs when strategic docs already define it.

## TOOL USAGE

- The agent MUST validate file and path existence before proposing links.
- The agent MUST validate commands against [package.json](package.json) or the owning runtime before documenting them.
- The agent MUST use structured edits and avoid unrelated reformatting.

## EXECUTION FLOW

- The agent MUST follow this order:
	1. Read this file.
	2. Enter the target subtree AGENTS file.
	3. Read the paired README for human context.
	4. Apply changes in the owning subtree only.
	5. Run relevant validation commands.

## DATA CONTRACT

- The agent MUST keep links workspace-relative and valid.
- The agent MUST keep directory ownership explicit when documenting architecture.
- The agent MUST keep command references synchronized with [docs/tooling/commands-reference.md](docs/tooling/commands-reference.md).

## CONSTRAINTS

- The agent MUST NOT bypass subtree AGENTS contracts.
- The agent MUST NOT treat generated reference outputs as hand-maintained authority.
- The agent MUST NOT duplicate strategic content when a canonical doc already exists.

## ERROR HANDLING

- The agent MUST fail fast when required files are missing.
- The agent MUST report invalid links, stale commands, and ownership conflicts explicitly.
- The agent MUST stop and ask for direction when edits require architectural decisions.

## CONSISTENCY

- The agent MUST keep AGENTS and README paired: behavior in AGENTS, overview in README.
- The agent MUST keep naming aligned with [docs/structure/domain/ubiquitous-language.md](docs/structure/domain/ubiquitous-language.md).
- The agent MUST keep dependency direction aligned with architecture rules.

## SECURITY

- The agent MUST respect module and runtime boundaries.
- The agent MUST NOT document or expose secrets in any AGENTS or README content.

## Route Here When

- You need repository-level routing for src, packages, fn, or docs.
- You need canonical pointers before entering a lower-level subtree.

## Route Elsewhere When

- For src runtime and module work: [src/AGENTS.md](src/AGENTS.md)
- For package and integration work: [packages/AGENTS.md](packages/AGENTS.md)
- For worker pipeline work: [fn/AGENTS.md](fn/AGENTS.md)
- For strategic terminology and context ownership: [docs/README.md](docs/README.md)

## Quick Links

- [src/AGENTS.md](src/AGENTS.md)
- [packages/AGENTS.md](packages/AGENTS.md)
- [fn/AGENTS.md](fn/AGENTS.md)
- [docs/README.md](docs/README.md)
- [docs/structure/system/architecture-overview.md](docs/structure/system/architecture-overview.md)
- [docs/structure/domain/bounded-contexts.md](docs/structure/domain/bounded-contexts.md)
- [docs/structure/domain/ubiquitous-language.md](docs/structure/domain/ubiquitous-language.md)
- [docs/tooling/commands-reference.md](docs/tooling/commands-reference.md)
