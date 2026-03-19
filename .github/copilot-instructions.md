# Xuanwu Copilot Instructions

## Mission
- This repository is in an active **VSA -> MDDD** migration.
- Favor small, reviewable changes that move code toward the target architecture in `../ARCHITECTURE.md`.
- Keep dependency direction strict: `UI -> Application -> Domain <- Infrastructure`.

## Always-on working mode
- **Always start by using `Use skill: xuanwu-skill`** before exploring implementation details.
- Treat `xuanwu-skill` as the fast index for project structure, module placement, and existing patterns.
- Prefer project context over single-file edits: understand the affected flow across `app/`, `modules/`, `shared/`, `ui/`, `infrastructure/`, and `interfaces/` before changing code.

## Copilot customization structure
- Keep always-on guidance in `.github/copilot-instructions.md`.
- Keep path-scoped guidance in `.github/instructions/*.instructions.md` with explicit `applyTo` globs.
- Keep reusable workflows in `.github/prompts/*.prompt.md` and `.github/agents/*.agent.md`.
- Keep GitHub Copilot coding-agent environment bootstrap in `.github/workflows/copilot-setup-steps.yml` with a single job named exactly `copilot-setup-steps`.
- Keep hook automation in `.github/hooks/*.json` only after lifecycle ownership and rollback are defined.
- Keep on-demand reference packages in `.github/skills/*/SKILL.md`.

## Tool priority
1. **filesystem MCP** first for repo-wide structure, trees, multi-file reads, and safe path-aware exploration.
   - Goal: help the model understand the project as a system, not as isolated files.
2. **Serena MCP** for symbol-aware search/edit and durable memory updates.
   - Persist verified architecture, module progress, UI patterns, and migration decisions after meaningful steps.
   - When major structure changes land, refresh the project index/skill references used by the team.
3. **Next DevTools MCP** for real Next.js behavior.
   - Prefer runtime inspection over guesswork for App Router, RSC, hydration, routing, cache, and shell behavior.
   - Use browser screenshots only after verifying runtime state.
4. **shadcn/ui MCP** before inventing or duplicating UI primitives.
   - Reuse or extend `ui/` and shadcn components instead of creating one-off variants.
5. **markitdown MCP** for external docs, product notes, and migration references.
   - Convert long-form documents into structured Markdown context before planning implementation work.

## Architecture and migration rules
- Prioritize migration work that clarifies or strengthens:
  - `app/`
  - `modules/`
  - `infrastructure/`
  - `interfaces/`
  - `lib/`
  - `shared/`
  - `ui/`
- Keep module boundaries explicit:
  - `domain/` contains pure entities/value objects/ports only.
  - `application/` contains use-cases and orchestration only.
  - `infrastructure/` contains adapters only.
  - `interfaces/` contains Next.js actions, hooks, and queries only.
- Do not duplicate logic across modules. Extract shared concerns into `shared/`, `lib/`, or `ui/` when they are truly reusable.
- For UI work, preserve shell consistency and prefer reusable patterns already established in the repo.

## Workflow expectations
- Plan first, then implement.
- For complex migration tasks, create or update a plan via `.github/prompts` or `.github/agents` instead of jumping straight to edits.
- If asked to "continue next phase", choose the highest-priority unfinished slice using this order:
  1. close remaining identity/account/organization gaps
  2. close workspace + shell context consistency gaps
  3. continue unfinished modules by user-facing impact (`task`, `notification`, `knowledge`, `retrieval`, then back-office modules)
- Explicit exception: **exclude VS8** from this continuation flow unless the user explicitly asks to include VS8.
- Update Serena memory after each significant module completion or architecture decision.
- If docs, prompts, instructions, or agents are improved during migration, keep them aligned with the actual repository state.

## Validation
- Baseline validation commands for this repo:
  - `npm run lint`
  - `npm run build`
- Run targeted validation as early as possible, then rerun the repo validation after meaningful changes.

## References
- [MDDD architecture guide](../ARCHITECTURE.md)
- [Xuanwu reference skill](./skills/xuanwu-skill/SKILL.md)
- [VSA -> MDDD migration skill](./skills/vsa-mddd-migration/SKILL.md)
