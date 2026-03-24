# CLAUDE.md — Xuanwu App

This file gives Claude (and other AI agents) the context needed to work in this repository.

## Project Overview

**Xuanwu App** is a Next.js 16 knowledge-management and AI-assisted workspace platform.

- Runtime: Next.js 16 App Router, React 19, Firebase, Upstash
- Architecture: **Module-Driven Domain Design (MDDD)** — 20 bounded-context modules under `modules/`
- Workers: Python 3.11 Cloud Functions in `py_fn/` (ingestion, parsing, embedding)
- Package manager: npm (Node.js 24)

## Essential Reading

Before making any change, read:

1. [`agents/README.md`](agents/README.md) — rules index
2. [`agents/knowledge-base.md`](agents/knowledge-base.md) — domain knowledge and module inventory
3. [`agents/commands.md`](agents/commands.md) — all build/deploy commands

## Validation Commands

```bash
npm install          # install dependencies
npm run lint         # ESLint — 0 errors expected (pre-existing warnings OK)
npm run build        # Next.js production build + type-check

# Python worker
cd py_fn && python -m compileall -q .
cd py_fn && python -m pytest tests/ -v
```

## Architecture Rules

### Module-Driven Domain Design

- All business logic lives in `modules/<context>/` with four layers:
  `domain/` → `application/` → `infrastructure/` + `interfaces/`
- Dependency direction: `interfaces/ → application/ → domain/ ← infrastructure/`
- `domain/` must be framework-free (no Firebase, React, HTTP clients)
- Every `modules/<module-name>/` is isolated; cross-module imports must go through `modules/<module-name>/api/`
- Keep guidance generic by default: do not hard-code specific domain-to-module mappings unless a contract explicitly requires it
- Keep boundaries explicit: logic in `domain/` + `application/`, UI/UX in `interfaces/` and `app/` composition

### Import Aliases

Use `@alias` imports — never relative paths across modules or legacy paths.

```ts
// Good
import type { CommandResult } from "@shared-types";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { getFirebaseFirestore } from "@integration-firebase";

// Bad — legacy paths
import { cn } from "@/shared/utils";
import { Button } from "@/ui/shadcn/ui/button";
```

### Runtime Boundary

| Next.js owns | `py_fn/` owns |
|---|---|
| Browser-facing APIs | Ingestion pipeline (parse → clean → taxonomy → chunk → embed) |
| Upload UX | Document AI processing |
| Auth / session / cookies | Firestore chunk persistence |
| Server Actions | Background & retryable jobs |
| Genkit query orchestration | Admin/internal callables |
| Streaming AI responses | |

## Key Patterns

### Server Action

```ts
"use server";
export async function myAction(input: MyInput): Promise<CommandResult> {
  const useCase = new MyUseCase(new FirebaseMyRepository());
  return useCase.execute(input);
}
```

### Use Case

```ts
export class MyUseCase {
  constructor(private readonly repo: MyRepository) {}
  async execute(input: MyInput): Promise<CommandResult> { ... }
}
```

### Repository

- Interface: `modules/<context>/domain/repositories/MyRepository.ts`
- Implementation: `modules/<context>/infrastructure/firebase/FirebaseMyRepository.ts`

## Spec-Driven Development

When spec-driven development is requested, follow [`SPEC-WORKFLOW.md`](SPEC-WORKFLOW.md).

## Copilot Delivery Workflow

The repository also ships a formal Copilot delivery chain for complex work:

1. Planner
2. Implementer
3. Reviewer
4. QA

Use [`.github/copilot-instructions.md`](.github/copilot-instructions.md) as the Copilot-specific baseline and [`docs/reference/ai/handoff-matrix.md`](docs/reference/ai/handoff-matrix.md) for stage transitions and recovery paths.

## Permissions Model

See [`PERMISSIONS.md`](PERMISSIONS.md) for the role/permission model used in this project.
