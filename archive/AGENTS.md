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
4. Read [`.github/README.md`](.github/README.md) — customization index for agents, prompts, skills, and instructions

## Key Rules

### Architecture

- Follow **Module-Driven Domain Design (MDDD)**: code belongs in `modules/<context>/`.
- Treat every `modules/<module-name>/` as an isolated bounded context.
- Cross-module interaction must go through `modules/<module-name>/api/` only.
- Dependency direction: `interfaces/ → application/ → domain/ ← infrastructure/`.
- `domain/` must stay framework-free (no Firebase SDK, React, HTTP clients).
- Keep boundaries explicit: business logic stays in `application/` + `domain/`, while UI/UX concerns stay in `interfaces/` and `app/` composition.
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

## IDDD 領域驅動設計規範 (Implementing Domain-Driven Design)

本專案已導入 Vaughn Vernon《Implementing Domain-Driven Design》(IDDD) 規範，以確保 Copilot 生成的程式碼符合通用語言、限界上下文與事件驅動架構原則。

### DDD 審查 Agent

- **[Domain Architect](.github/agents/domain-architect.agent.md)** — IDDD 領域架構審查，負責確認聚合根設計、限界上下文邊界、通用語言一致性與領域事件規範。

### DDD 指令文件 (Instructions)

| 文件 | 用途 |
|------|------|
| [ubiquitous-language](.github/instructions/ubiquitous-language.instructions.md) | 強制查閱 `terminology-glossary.md`，規範通用語言命名 |
| [bounded-context-rules](.github/instructions/bounded-context-rules.instructions.md) | 限界上下文邊界與模組依賴方向規範 |
| [domain-modeling](.github/instructions/domain-modeling.instructions.md) | 聚合根、實體與值對象的 Immutable 設計與 Zod 驗證規範 |
| [event-driven-state](.github/instructions/event-driven-state.instructions.md) | XState 與領域事件互動、SuperJSON 序列化規範 |

### DDD Prompt 模板

- [`generate-aggregate`](.github/prompts/generate-aggregate.prompt.md) — 生成符合 IDDD 規範的 TypeScript 聚合根骨架。
- [`generate-domain-event`](.github/prompts/generate-domain-event.prompt.md) — 生成領域事件定義（Zod Schema + 型別推導）。

### DDD 術語表

DDD 相關術語定義（聚合根、限界上下文、通用語言等）請查閱 [`.github/terminology-glossary.md`](.github/terminology-glossary.md) 的「DDD 戰略設計術語」與「DDD 戰術設計術語」章節。

## Spec-Driven Development

When asked to use spec-driven development, follow [`SPEC-WORKFLOW.md`](SPEC-WORKFLOW.md).

## Copilot Delivery Workflow

This repository also maintains a formal Copilot delivery chain for non-trivial work:

1. Planner
2. Implementer
3. Reviewer
4. QA

Use `.github/copilot-instructions.md` as the Copilot-specific baseline and see [`docs/development-reference/reference/ai/handoff-matrix.md`](docs/development-reference/reference/ai/handoff-matrix.md) for the formal stage transitions.

## Permissions

For the RBAC/role model used in this project, see [`PERMISSIONS.md`](PERMISSIONS.md).

## Full Rules

See [`agents/rules/`](agents/rules/) for the complete set of architecture, quality, data, API, and CI rules.
