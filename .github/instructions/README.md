# Custom Instructions

Repository instruction index for `applyTo`-scoped rules used by Copilot.

## Foundation

| File | Scope | Purpose |
| --- | --- | --- |
| [instructions.instructions.md](./instructions.instructions.md) | `.github/instructions/*.instructions.md` | How to create high-quality custom instruction files |
| [agents.instructions.md](./agents.instructions.md) | `.github/agents/*.agent.md` | How to create custom delivery agents |
| [agent-skills.instructions.md](./agent-skills.instructions.md) | `.github/skills/**/SKILL.md` | How to create agent skills |
| [prompt.instructions.md](./prompt.instructions.md) | `.github/prompts/*.prompt.md` | How to create slash-command prompts |

## Project-Specific

| File | Scope | Purpose |
| --- | --- | --- |
| [xuanwu-app-nextjs-mddd.instructions.md](./xuanwu-app-nextjs-mddd.instructions.md) | `app/**/*.{ts,tsx}`, `packages/**/*.{ts,tsx}`, `providers/**/*.{ts,tsx}`, `debug/**/*.{ts,tsx}` | Next.js 16, React 19, MDDD development standards |
| [xuanwu-functions-python.instructions.md](./xuanwu-functions-python.instructions.md) | `py_fn/**/*.py` | Python Firebase Functions development standards |

## Architecture & Modules

| File | Scope | Purpose |
| --- | --- | --- |
| [modules-architecture.instructions.md](./modules-architecture.instructions.md) | `modules/**/*.md` | MDDD layer design and module structure docs |
| [modules-api-boundary.instructions.md](./modules-api-boundary.instructions.md) | `modules/**/*.{ts,tsx,js,jsx}` | Cross-module API boundaries and imports |
| [modules-dependency-graph.instructions.md](./modules-dependency-graph.instructions.md) | `modules/**/*.{ts,tsx,js,jsx}` | Dependency direction and layer enforcement |
| [modules-naming.instructions.md](./modules-naming.instructions.md) | `modules/**/*.md` | Module naming conventions in specs/docs |
| [modules-refactoring.instructions.md](./modules-refactoring.instructions.md) | `modules/**/*.md` | Refactoring workflows for module planning/docs |

## Other

| File | Scope | Purpose |
| --- | --- | --- |
| [dotnet-architecture-good-practices.instructions.md](./dotnet-architecture-good-practices.instructions.md) | `**/*.cs`, `**/*.csproj`, `**/Program.cs`, `**/*.razor` | DDD and .NET architecture guidance |

## Total: 12 Instruction Files

Each instruction file includes clear examples, best practices, and anti-patterns to guide Copilot behavior and enforce project standards.

## Scope Partition (Noise Control)

Use this partition to avoid overlapping instruction contexts:

- App and package implementation: `xuanwu-app-nextjs-mddd.instructions.md`
- Module code boundaries: `modules-api-boundary.instructions.md` + `modules-dependency-graph.instructions.md`
- Module architecture and naming docs: `modules-architecture.instructions.md` + `modules-naming.instructions.md` + `modules-refactoring.instructions.md`
- Prompt authoring: `prompt.instructions.md`
- Agent authoring: `agents.instructions.md`
- Skill authoring: `agent-skills.instructions.md`

## Context Noise Budget

To reduce repeated context consumption:

- Keep each instruction file focused on one concern.
- Prefer narrow `applyTo` globs.
- Avoid duplicating repository-wide policy from `AGENTS.md` and `.github/copilot-instructions.md`.
- Link to canonical docs instead of repeating long explanations.
- Move long examples into dedicated docs and keep instruction files compact.

Recommended size targets:

- High-frequency instruction files: <= 300 lines
- Specialized instruction files: <= 500 lines

## Conflict Resolution Order

When rules overlap, resolve by this order:

1. The instruction with the most specific `applyTo`
2. Code-boundary instructions over descriptive docs (`modules-api-boundary` and `modules-dependency-graph`)
3. `.github/copilot-instructions.md` for execution workflow and delivery rules

## Diagnostics

- If an instruction does not load automatically, verify its `applyTo` pattern against the target file and inspect Chat customization diagnostics.
- Prefer brace-expansion globs such as `modules/**/*.{ts,tsx,js,jsx}` over comma-separated path lists in a single pattern.

## Related

- [../README.md](../README.md) — Root `.github/` navigation
- [../agents/README.md](../agents/README.md) — Delivery workflow agents
- [../skills/README.md](../skills/README.md) — Specialized agent skills
