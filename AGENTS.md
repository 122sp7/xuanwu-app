# Agent Guide — Xuanwu App

This file is the entry point for AI agents (GitHub Copilot, Claude, OpenCode, etc.) working in this repository.

## Development Status Workflow

Use the following status flow for issues, tasks, and features:

| Order | Status | Emoji | Description |
|------|--------|-------|-------------|
| 0 | Idea | 💡 | Initial idea or feature request |
| 1 | Backlog | 📥 | Stored in backlog, not scheduled |
| 2 | Planned | 📅 | Planned and scheduled |
| 3 | Designing | 🎨 | Architecture / UI / schema design |
| 4 | Ready | 🟢 | Ready for development |
| 5 | Developing | 🚧 | Active development |
| 6 | Midway | 🏗️ | Development partially completed |
| 7 | Testing | 🧪 | Testing / QA |
| 8 | Fixing | 🔧 | Bug fixing |
| 9 | Review | 🔍 | Code review / acceptance review |
|10 | Staging | 🚀 | Staging / pre-production |
|11 | Done | ✅ | Development completed |
|12 | Delivered | 📦 | Delivered / deployed to production |
|13 | Archived | 🗄️ | Archived / closed / inactive |

## Quick Start

1. Read [`agents/README.md`](agents/README.md) — rules index and overview
2. Read [`agents/knowledge-base.md`](agents/knowledge-base.md) — domain knowledge and module inventory
3. Read [`agents/commands.md`](agents/commands.md) — build, lint, deploy commands

## Key Rules

### Architecture

- Follow **Module-Driven Domain Design (MDDD)**: code belongs in `modules/<context>/`.
- Dependency direction: `interfaces/ → application/ → domain/ ← infrastructure/`.
- `domain/` must stay framework-free (no Firebase SDK, React, HTTP clients).
- Import shared code through `@alias` package aliases, never with relative paths across modules.

### Import Aliases

```ts
import type { CommandResult } from "@shared-types";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { getFirebaseFirestore } from "@integration-firebase";
```

Never use legacy paths: `@/shared/*`, `@/libs/*`, `@/infrastructure/*`, `@/ui/*`.

### Runtime Boundary

- **Next.js** owns browser-facing APIs, upload UX, auth/session, Server Actions, streaming AI responses.
- **`py_fn/`** owns ingestion, parsing, chunking, embedding, and background jobs.
- Do not add chat streaming or auth logic to `py_fn/`.

## Validation Commands

```bash
npm install          # Install dependencies
npm run lint         # ESLint (0 errors expected; pre-existing warnings are OK)
npm run build        # Next.js production build + TypeScript type-check

# Python worker
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

## Common Patterns

### Server Action (write-side)

```ts
"use server";
export async function myAction(input: MyInput): Promise<CommandResult> {
  // validate → use case → return CommandResult
}
```

### Use Case

```ts
// modules/<context>/application/use-cases/MyUseCase.ts
export class MyUseCase {
  constructor(private readonly repo: MyRepository) {}
  async execute(input: MyInput): Promise<CommandResult> { ... }
}
```

### Repository

- Interface in `domain/repositories/`.
- Firebase implementation in `infrastructure/firebase/`.

## Spec-Driven Development

When asked to use spec-driven development, follow [`SPEC-WORKFLOW.md`](SPEC-WORKFLOW.md).

## Permissions

For the RBAC/role model used in this project, see [`PERMISSIONS.md`](PERMISSIONS.md).

## Full Rules

See [`agents/rules/`](agents/rules/) for the complete set of architecture, quality, data, API, and CI rules.
