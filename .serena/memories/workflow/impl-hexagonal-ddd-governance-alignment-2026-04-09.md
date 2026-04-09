## Phase: impl
## Task: align .github governance with Hexagonal Architecture + DDD triad
## Date: 2026-04-09

### Scope
- Update `.github/copilot-instructions.md`
- Update `.github/agents/domain-architect.agent.md`
- Update selected `.github/instructions/*.instructions.md`
- Update selected `.github/prompts/*.prompt.md`
- Align to skillbook `.github/skills/hexagonal-ddd/SKILL.md`

### Context7 Validation
- Resolved and used `/sairyss/domain-driven-hexagon` as primary reference.
- Verified principles used in updates: domain isolation from infrastructure/api, ports as abstractions, adapters in outer layers.

### Changes
- Added Hexagonal DDD canonical triad into copilot instructions:
  - Ubiquitous Language
  - Bounded Context
  - Context Map
- Added explicit authoritative source ordering referencing:
  - `instructions/ubiquitous-language.instructions.md`
  - `instructions/bounded-context-rules.instructions.md`
  - `modules/<context>/context-map.md`
- Replaced stale skill tag `#use skill xuanwu-mddd-boundaries` with `#use skill hexagonal-ddd` across targeted agents/instructions/prompts.
- Updated routing in copilot instructions from `alistair-cockburn` to `skills/hexagonal-ddd/SKILL.md` for Hexagonal+DDD boundary work.
- Added Context Map checks into:
  - `domain-architect.agent.md` checklist
  - `review-architecture.prompt.md`
  - `plan-module.prompt.md`

### Notes
- Runtime could not execute pwsh-backed lint commands in this environment (pwsh missing), so command validation was blocked at tool-runtime level.
- Content edits are limited to `.github/*` governance surfaces requested by user.
