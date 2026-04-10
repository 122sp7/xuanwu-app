---
applyTo: **
description: Xuanwu Copilot Workspace Instructions
name: Xuanwu Copilot Workspace Instructions
---

# Xuanwu Copilot Workspace Instructions

Always-on workspace guidance for Copilot. Keep this file short, stable, and repository-wide. Put file-type, framework, or task-specific rules in [.github/instructions](./instructions), reusable workflows in prompts, and tool- or role-specific behavior in skills.

## Purpose

- Xuanwu is a personal- and organization-oriented Knowledge Platform built as a modular monolith with MDDD boundaries.
- Align Copilot with Xuanwu architecture, validation flow, and delivery boundaries.
- Keep always-on instructions low-noise so scoped `.instructions.md` files can do the detailed work.
- Prefer references to canonical docs over repeated policy text.

## Non-Negotiable Session Contract

- Start every conversation with Serena MCP. If Serena tools are unavailable, bootstrap Serena first, then continue.
- Serena owns orchestration. Serena understands the request, gathers targeted context, decides whether subagents are needed, and remains responsible for final synthesis.
- If confidence in any library API, framework behavior, or config schema detail is below 99.99%, query Context7 before writing, generating, or suggesting code.
- Repository orchestration memory and index updates belong to Serena. Use Serena tools for project memory/index work; do not treat direct edits under `.serena/` or non-Serena project-memory paths as authoritative replacements.

## Authoritative Sources

Read these in order before making non-trivial decisions:

1. [instructions/ubiquitous-language.instructions.md](./instructions/ubiquitous-language.instructions.md) for canonical terminology routing.
2. [instructions/bounded-context-rules.instructions.md](./instructions/bounded-context-rules.instructions.md) for module isolation and cross-context collaboration boundaries.
3. `modules/<context>/context-map.md` for context relationships, upstream/downstream contracts, and anti-corruption decisions.
4. [agents/knowledge-base.md](./agents/knowledge-base.md) for repository-wide architecture rules and module boundaries.
5. [agents/commands.md](./agents/commands.md) for validation commands, build, lint, test, and deployment workflows.

## DDD Reference Authority

Strategic DDD root maps are owned by `docs/subdomains.md` and `docs/bounded-contexts.md`. Bounded-context reference sets currently live in `modules/<context>/` and should be read from there unless a future consolidation change explicitly moves ownership.

Cross-domain duplicate-name resolution is owned by `docs/subdomains.md`, `docs/bounded-contexts.md`, `docs/ubiquitous-language.md`, and `docs/contexts/<context>/*`. If `modules/<context>/docs/*` preserves legacy or implementation-oriented names during migration, those names must not override the strategic ownership and naming decisions in root `docs/`.

| Query | Canonical Document |
|-------|-------------------|
| Strategic subdomain classification | [`docs/subdomains.md`](../docs/subdomains.md) |
| Bounded Context boundaries / module map | [`docs/bounded-contexts.md`](../docs/bounded-contexts.md) |
| Bounded Context + Subdomain delivery template | [`docs/bounded-context-subdomain-template.md`](../docs/bounded-context-subdomain-template.md) |
| Project milestones from zero to delivery | [`docs/project-delivery-milestones.md`](../docs/project-delivery-milestones.md) |
| Context terminology | `modules/<context>/ubiquitous-language.md` |
| Context aggregates / entities / value objects | `modules/<context>/aggregates.md` |
| Context domain events | `modules/<context>/domain-events.md` |
| Context map | `modules/<context>/context-map.md` |
| Context repositories | `modules/<context>/repositories.md` |
| Context application services | `modules/<context>/application-services.md` |
| Context domain services | `modules/<context>/domain-services.md` |

**Rule**: `.github/instructions/` files contain **behavioral constraints** (what Copilot must do). `docs/subdomains.md` + `docs/bounded-contexts.md` contains strategic DDD routing, and `modules/<context>/` contains the current bounded-context detail set. Link instead of copying.

**Rule**: when strategic naming conflicts with implementation-era names, root `docs/` wins for ownership, vocabulary, and cross-domain communication. Treat `modules/<context>/docs/*` as implementation-aligned detail, not as authority for duplicate generic names across main domains.

## Hexagonal DDD Canonical Triad

- **Ubiquitous Language**: `instructions/ubiquitous-language.instructions.md` + `modules/<context>/ubiquitous-language.md`
- **Bounded Context**: `instructions/bounded-context-rules.instructions.md` + `docs/bounded-contexts.md`
- **Context Map**: `modules/<context>/context-map.md`

Any architecture/design update must stay consistent across this triad.

## Workspace-Wide Operating Rules

- Plan first for cross-module, cross-runtime, schema, or contract-governed changes.
- When scaffolding a new bounded context or subdomain tree, read `docs/bounded-context-subdomain-template.md` before generating directories or files.
- When sequencing architecture-first delivery, read `docs/project-delivery-milestones.md` before turning planning gaps into implementation work.
- Treat the approved plan as the execution contract; stay within scope and update docs when boundaries or public APIs change.
- Search and read before editing. Prefer existing instructions, prompts, and skills over ad hoc restatement.
- Keep changes minimal, local, and boundary-safe.

## Architecture Guardrails

- Follow Module-Driven Domain Design: each `modules/<context>/` directory is an isolated bounded context.
- Cross-module access must go through the target module's `api/` boundary only.
- Keep dependency direction explicit: `interfaces/` -> `application/` -> `domain/` <- `infrastructure/`.
- Keep business logic in `domain/` and `application/`; keep UI, transport, and composition in `interfaces/` and `app/`.
- Use package aliases such as `@shared-*`, `@ui-*`, `@lib-*`, and `@integration-*`; do not introduce legacy `@/shared/*`, `@/libs/*`, or similar paths.
- Preserve the runtime split: Next.js owns browser-facing UX, auth/session, orchestration, and streaming; `py_fn/` owns ingestion, parsing, chunking, embedding, and worker jobs.

## Copilot Customization Design Rules

- Keep this file concise and self-contained; prefer short directive statements over long tutorial prose.
- Put scoped guidance in focused `.instructions.md` files with narrow `applyTo` patterns.
- Reuse canonical references instead of duplicating the same rules across instructions, prompts, agents, and skills.
- Do not turn temporary implementation details, current module counts, or migration mappings into permanent global rules.
- When customizations appear ignored, verify them with Chat customization diagnostics before changing the file structure.

## Serena MCP

Serena MCP is **mandatory for every session**. There are no exceptions.

Serena is the orchestration lead for every conversation. Start with Serena to understand the request, gather only the needed context, and decide whether focused subagents are required. Subagents assist with exploration or execution, but Serena remains responsible for task framing, delegation, and final synthesis.

### Session-Start Protocol (Required)

1. Bootstrap Serena MCP server if tools are not available:
   ```bash
   uvx --from git+https://github.com/oraios/serena serena start-mcp-server
   ```
2. Activate the `xuanwu-app` project before any read or write operation.
3. List and read relevant memories before starting any non-trivial task.

### Session-End Protocol (Required)

After every meaningful phase (plan → impl → review → qa) and before any handoff:

1. Write a phase-end memory update using Serena memory tools.
2. Trigger an index update if files were added, renamed, or removed.

See the phase-end template in [skills/serena-mcp/SKILL.md](skills/serena-mcp/SKILL.md).

### Hard Prohibitions

- **NEVER** edit any file inside `.serena/` directly with file tools (`create`, `edit`, `write`, etc.).
- **NEVER** delete or rename `.serena/` entries outside of Serena tooling.
- **NEVER** use non-Serena file edits as a substitute for Serena project memory or index updates.
- If the Serena write tool is unavailable, report blocked and halt — do **not** bypass with direct file writes.
- Index and memory changes are only valid when made through Serena tools.

## Context7 Documentation Query

When confidence in any library API, framework behavior, or config schema detail is **below 99.99%**, you **must** query official documentation through upstash/context7 before writing, generating, or suggesting code.

### Trigger Conditions

Any of the following require a context7 lookup before proceeding:

- API signature, parameter name, or return type is uncertain.
- Version-specific behavior or breaking-change risk exists.
- Config schema details (Next.js, Firebase, Zod, XState, etc.) are not fully recalled.
- A library was recently updated and you are unsure of the current behavior.

### Required Steps

1. Call `resolve-library-id` with the library name to get a Context7-compatible ID.
2. Call `get-library-docs` with that ID and a focused `topic` to retrieve official docs.
3. Use the retrieved docs as the authoritative source; do **not** rely on training-time recall alone.

### Guardrails

- Do not skip the lookup by assuming training data is current — default to querying.
- Do not pass arbitrary strings as the library ID; always resolve it first via `resolve-library-id`.
- Keep queries focused: one `topic` per call rather than fetching the entire doc set.
- See [skills/context7/SKILL.md](skills/context7/SKILL.md) for the full workflow.

## Claude Compatibility Layer

`.claude/` is a supported Claude Code compatibility surface.

- Use `.claude/settings.json` when you need Claude hook lifecycle, permissions, or project MCP behavior.
- Use `.claude/rules/tech-strategy.md` when you need Claude-side technology-policy context.
- Use `.claude/hooks/*` when a task touches Claude-specific guards, validation, or session automation.
- Keep `.github/*` as the primary Copilot governance surface; use `.claude/` to preserve or understand Claude compatibility, not as a parallel source of repository-wide truth.

## Skill And Agent Routing

- Use [skills/xuanwu-app-skill/SKILL.md](skills/xuanwu-app-skill/SKILL.md) when repository structure or implementation location matters.
- Use [skills/xuanwu-app-markdown-skill/SKILL.md](skills/xuanwu-app-markdown-skill/SKILL.md) when markdown documentation structure or wording matters.
- Use [skills/hexagonal-ddd/SKILL.md](skills/hexagonal-ddd/SKILL.md) when applying Hexagonal Architecture with DDD to module boundaries, ports/adapters, and cross-module API contracts.
- Use boundary or contract skills only when the task actually crosses those concerns.
- Keep prompts, instructions, agents, and skills complementary. Do not duplicate the same policy in multiple layers unless the scope is different.

## Validation

- Run the matching validation for changed files by using [agents/commands.md](./agents/commands.md).
- Do not close work until required lint, build, test, and documentation updates are complete.

## Terminology

- Terminology routing is governed by [instructions/ubiquitous-language.instructions.md](./instructions/ubiquitous-language.instructions.md).
- Treat glossary terminology as canonical naming and vocabulary authority.
- Do not introduce new terms if an equivalent glossary term already exists.
- When multiple names exist, normalize to the glossary term before implementation.
- Use glossary-aligned wording for prompts, instructions, agents, skills, and DDD docs.
