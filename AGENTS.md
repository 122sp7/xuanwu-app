# Repository Entry Points

Use this file as a router only.

## Authority Order

1. `.github/copilot-instructions.md` — workspace-wide behavior rules and skill requirements
2. `docs/README.md` — strategic architecture and terminology authority
3. `.github/instructions/*.instructions.md` — scoped implementation and review rules
4. `src/modules/<context>/AGENTS.md` — module-local routing guidance

## Quick Links

- Architecture and context ownership: `docs/structure/system/architecture-overview.md`
- Context map and dependency direction: `docs/structure/system/context-map.md`
- Ubiquitous language: `docs/structure/domain/ubiquitous-language.md`
- Hard rules: `docs/structure/system/hard-rules-consolidated.md`
- Commands and validation: `docs/tooling/commands-reference.md`

## Cleanup Rule

Do not restate strategic rules, API contracts, or context ownership here.
If a rule already lives in `docs/**/*` or `.github/instructions/*`, update the owner file instead of duplicating it.
