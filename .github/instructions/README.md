# Custom Instructions

Always-on and `applyTo`-scoped instructions that guide code generation, review, and standards enforcement.

## Foundation

| File | Scope | Purpose |
| --- | --- | --- |
| [instructions.instructions.md](./instructions.instructions.md) | `**/*.instructions.md` | How to create high-quality custom instruction files |
| [agents.instructions.md](./agents.instructions.md) | `**/*.agent.md` | How to create custom delivery agents |
| [agent-skills.instructions.md](./agent-skills.instructions.md) | `.github/skills/**/SKILL.md` | How to create agent skills |
| [prompt.instructions.md](./prompt.instructions.md) | `**/*.prompt.md` | How to create slash-command prompts |

## Project-Specific

| File | Scope | Purpose |
| --- | --- | --- |
| [xuanwu-app-nextjs-mddd.instructions.md](./xuanwu-app-nextjs-mddd.instructions.md) | `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`, `**/*.css` | Next.js 16, React 19, MDDD development standards |
| [xuanwu-functions-python.instructions.md](./xuanwu-functions-python.instructions.md) | `py_fn/**/*.py` | Python Firebase Functions development standards |

## Architecture & Modules

| File | Scope | Purpose |
| --- | --- | --- |
| [modules-architecture.instructions.md](./modules-architecture.instructions.md) | `modules/**/*.{ts,tsx,js,jsx,md}` | MDDD layer design and module structure |
| [modules-api-boundary.instructions.md](./modules-api-boundary.instructions.md) | `modules/**/*.{ts,tsx,js,jsx}`, `app/**/*.{ts,tsx}` | Cross-module API boundaries and imports |
| [modules-dependency-graph.instructions.md](./modules-dependency-graph.instructions.md) | `modules/**/*.{ts,tsx,js,jsx}`, `app/**/*.{ts,tsx}` | Dependency direction and layer enforcement |
| [modules-naming.instructions.md](./modules-naming.instructions.md) | `modules/**/*.{ts,tsx,js,jsx,md}` | File and symbol naming conventions |
| [modules-refactoring.instructions.md](./modules-refactoring.instructions.md) | `modules/**/*.{ts,tsx,js,jsx,md}`, `app/**/*.{ts,tsx}` | Refactoring workflows for modules |

## Other

| File | Scope | Purpose |
| --- | --- | --- |
| [dotnet-architecture-good-practices.instructions.md](./dotnet-architecture-good-practices.instructions.md) | `**/*.cs`, `**/*.csproj`, `**/Program.cs`, `**/*.razor` | DDD and .NET architecture guidance |

## Total: 12 Instruction Files

Each instruction file includes clear examples, best practices, and anti-patterns to guide Copilot behavior and enforce project standards.

## Related

- [../README.md](../README.md) — Root `.github/` navigation
- [../agents/README.md](../agents/README.md) — Delivery workflow agents
- [../skills/README.md](../skills/README.md) — Specialized agent skills
