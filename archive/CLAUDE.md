# CLAUDE.md — Xuanwu App Context

Quick reference for Claude working in this Next.js 16 + MDDD repository.

## Context

**Xuanwu App**: Next.js 16, React 19, Firebase, Python workers (`py_fn/`)

**Architecture**: Module-Driven Domain Design (MDDD) — 19 bounded-context modules

**Essential**: Read AGENTS.md for rules, commands, and patterns.

## Quick Commands

```bash
npm run lint      # ESLint (0 errors)
npm run build     # Type-check + Next.js build
cd py_fn && python -m pytest tests/ -v
```

See [agents/commands.md](agents/commands.md) for full list.

## Key Principles

1. **Module isolation**: `modules/` are bounded contexts — use `api/` boundaries only
2. **Dependency direction**: `UI → App → Domain ← Infrastructure`
3. **Aliases**: Always use `@shared-*`, `@ui-*`, `@lib-*`, `@integration-*` — never `@/`
4. **Runtime split**: Next.js = frontend + orchestration; `py_fn/` = ingestion + workers

## Common Patterns (See AGENTS.md for full examples)

```ts
// Server Action: orchestrate use case, return CommandResult
"use server";
export async function action(input) { return useCase.execute(input); }

// Use Case: `application/use-cases/*.ts` orchestrates domain
// Repository: interface in `domain/`, impl in `infrastructure/`
```

## Full Reference

- **[AGENTS.md](AGENTS.md)** — Complete rules, commands, architecture, patterns
- **[agents/knowledge-base.md](agents/knowledge-base.md)** — Module inventory, tech stack
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** — Copilot delivery workflow
