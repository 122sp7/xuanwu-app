---
applyTo: **
description: Xuanwu Copilot Workspace Instructions
name: Xuanwu Copilot Workspace Instructions
---

#use skill serena-mcp
#use skill repomix
#use skill context7
#use skill xuanwu-skill
#use skill hexagonal-ddd
#use skill xuanwu-markdown-skill
#use skill occams-razor
#use skill alistair-cockburn

# Xuanwu Copilot Workspace Instructions

Always-on workspace guidance for Copilot. Keep this file short, stable, and repository-wide. Put detailed architecture truth in [docs/README.md](../docs/README.md), scoped behavior in [.github/instructions](./instructions), reusable workflows in prompts, and tool-specific procedure in skills.

## Session Contract

### Mandatory Skills (Load Every Session, No Exceptions)

These three skills **must be loaded at the start of every conversation** before any other action:

| Order | Skill | Purpose |
|---|---|---|
| 1 | `serena-mcp` | Project memory, symbol index, onboarding state |
| 2 | `repomix` | Repo structure exploration, pattern search, skill refresh |
| 3 | `context7` | Library/framework API verification gate |

- If Serena is unavailable, bootstrap it first (`uvx --from git+https://github.com/oraios/serena serena start-mcp-server`), activate `xuanwu-app`, then proceed.
- Do not answer architecture, API, or implementation questions until all three mandatory skills are loaded.
- If confidence in any library API, framework, or config schema detail is below 99.99%, verify it through Context7 before writing or suggesting code.
- Treat `docs/**/*` as the authority for DDD routing, bounded-context ownership, terminology, and strategic duplicate-name resolution. `.github/*` defines Copilot behavior and must not compete with docs.
- Run the matching validation from [docs/tooling/commands-reference.md](../docs/tooling/commands-reference.md) before closing non-trivial changes.

## Mandatory Compliance Rules

These rules are **non-negotiable** and apply to every task, file, and decision. Any violation requires an immediate stop and explicit report before proceeding.

1. **AI Operational Scope**: Without explicit authorization, do not create files, add modules, modify interface definitions, or make any changes beyond the scope of the current task description.
2. **Bounded Context**: Every concept belongs to exactly one Context. When referencing a same-named concept across Contexts, an explicit mapping layer must be established. Sharing types or objects directly is not permitted.
3. **Ubiquitous Language Governance**: All naming must derive from the defined Domain glossary. When encountering a name not in the glossary, halt implementation and report it. Self-naming is not permitted.
4. **Contract / Schema**: All data entering the system must pass through a defined Schema validation. Accessing raw input outside the validation layer is not permitted. Assuming input is valid is not permitted.
5. **Breaking Change Policy**: When modifying any externally exposed Schema, interface, or event structure, a new version must be added and the old version retained. Direct overwriting is not permitted.
6. **Aggregate Design**: All modifications to an Aggregate's internal state must be executed through that Aggregate's own methods. Directly modifying an Aggregate's properties or child objects from outside is not permitted.
7. **State Model / FSM**: Every state transition must exist in the defined list of legal transitions. Transition paths that are not defined must throw an error. Silent ignoring or self-inferred transitions are not permitted.
8. **Consistency / Transaction Strategy**: Operations spanning Aggregates or Contexts must not be wrapped in a single transaction. A defined saga or outbox pattern must be used. Designing ad-hoc synchronous coupling solutions is not permitted.
9. **Event Ordering / Causality Model**: All event handlers must implement idempotency. Assuming events arrive in send order is not permitted. Sequence must be determined using a causality token or version number.
10. **Failure Strategy**: Every external call must define a failure handling path (retry / compensate / dead-letter). Silently swallowing exceptions is not permitted. Assuming external services always succeed is not permitted.
11. **Authorization / Security**: Every operation must verify that the caller holds the required permission before execution. Relying on call order or upstream validation as implicit authorization is not permitted.
12. **Hexagonal Architecture**: The Domain layer must not import any types from Infrastructure, Frameworks, or external services. All external dependencies must be accessed through defined Port interfaces.
13. **Dependency Rule Enforcement**: Dependencies may only flow inward (Infrastructure → Application → Domain). Reverse dependencies are forbidden. Direct imports between Contexts at the same layer are forbidden.
14. **Testability / Specification**: Every Domain behavior must have corresponding automated test coverage. Implementing logic structures that cannot be verified by the existing test framework is not permitted.
15. **Observability**: All cross-layer calls, state changes, and errors must produce structured, traceable records. Replacing structured events with print statements or log strings is not permitted.
16. **ADR / Design Rationale**: When multiple implementation options are technically viable, do not choose independently. Halt, list the options and their differences, and wait for a human decision before proceeding.
17. **Minimum Necessary Design / YAGNI**: Do not create abstractions, interfaces, or extension points for future possibilities. Every new structure must correspond to a requirement that explicitly exists in the current task.
18. **Single Responsibility / No Redundancy**: Every concept must be defined exactly once in exactly one layer. When the same semantic is found expressed in multiple places, report the conflict. Allowing both to coexist is not permitted.
19. **Design Activation Rules**: Do not preemptively apply architectural patterns that have not been triggered by current complexity. Every introduced pattern must be traceable to a concrete, already-existing problem.
20. **Lint / Policy as Code**: All implementations violating the above rules must be interceptable by static analysis tooling before commit. Implementing architectural constraints that cannot be verified by tooling is not permitted.

## Read Order

1. Start with [docs/README.md](../docs/README.md).
2. Use [docs/structure/domain/ubiquitous-language.md](../docs/structure/domain/ubiquitous-language.md) for terminology and duplicate-name guardrails.
3. Use [docs/structure/domain/subdomains.md](../docs/structure/domain/subdomains.md) and [docs/structure/domain/bounded-contexts.md](../docs/structure/domain/bounded-contexts.md) for ownership, module routing, and strategic boundaries.
4. Use `docs/structure/contexts/<context>/*` for context-local language, bounded-context detail, and context-map relationships.
5. Use [docs/structure/domain/bounded-context-subdomain-template.md](../docs/structure/domain/bounded-context-subdomain-template.md) and [docs/structure/system/project-delivery-milestones.md](../docs/structure/system/project-delivery-milestones.md) when scaffolding or sequencing architecture-first delivery.
6. Use [docs/tooling/commands-reference.md](../docs/tooling/commands-reference.md) for build, lint, test, and deployment validation.

## Instruction Series (Phase 1)

- Use [instructions/architecture-core.instructions.md](./instructions/architecture-core.instructions.md) as the consolidated module architecture rule set.
- Use [instructions/architecture-runtime.instructions.md](./instructions/architecture-runtime.instructions.md) as the consolidated runtime split rule set.
- Use [instructions/process-framework.instructions.md](./instructions/process-framework.instructions.md) as the consolidated delivery/decision framework.
- Use [instructions/docs-authority-and-language.instructions.md](./instructions/docs-authority-and-language.instructions.md) as the consolidated docs authority and terminology rule set.
- Legacy instruction files marked DEPRECATED remain transition-only and should not be expanded.

## Module Layer Routing（src-only）

本 repo 已全面改為 `src/modules/` 單一模組層：

| 路徑 | 職責 | 撰寫時機 |
|---|---|---|
| `src/modules/<context>/` | 主域模組實作層（Hexagonal DDD） | 修改邊界規則、domain model、跨模組 API、use case 與 adapters |

- 不確定放在哪一層 → 讀 `src/modules/<context>/AGENTS.md` 的 **Route Here / Route Elsewhere** 段落。
- 新實作一律以 `src/modules/template` 骨架為基線。
- 阅讀 strategic boundary / published language → `src/modules/<context>/index.ts` 與 `src/modules/<context>/AGENTS.md`。

## Operating Rules

> Dependency direction, domain purity, cross-module boundary, and planning discipline are governed by **Mandatory Compliance Rules 12–13, 16–17**. Items below are repo-specific structural decisions.

- `<bounded-context>` root may own context-wide `application/`, `domain/`, `infrastructure/`, and `interfaces/`; do not reduce it to only `docs/` plus `subdomains/`.
- If a team adds `core/`, limit it to inner concerns like `application/`, `domain/`, and optional `ports/`; do not place `infrastructure/` or `interfaces/` inside a generic `core/`.
- Preserve the runtime split: Next.js owns browser-facing UX and orchestration; `py_fn/` owns ingestion, parsing, chunking, embedding, and worker jobs.
- Use package aliases such as `@shared-*`, `@ui-*`, `@lib-*`, and `@integration-*`; do not introduce legacy alias patterns.

## Governance Rules

- Keep this file thin. Put detailed, file-scoped behavior in `.github/instructions/` and reuse docs instead of copying architecture content into customization files.
- Use [skills/serena-mcp/SKILL.md](skills/serena-mcp/SKILL.md) for Serena workflow details, [skills/context7/SKILL.md](skills/context7/SKILL.md) for documentation verification, and [skills/hexagonal-ddd/SKILL.md](skills/hexagonal-ddd/SKILL.md) for boundary-safe module design.
- Use [skills/xuanwu-skill/SKILL.md](skills/xuanwu-skill/SKILL.md) and [skills/xuanwu-markdown-skill/SKILL.md](skills/xuanwu-markdown-skill/SKILL.md) for implementation lookup only; they are not strategic authority.
- `.claude/` may exist as a compatibility surface, but `.github/*` remains the primary Copilot governance surface.

## Terminology

> Governed by **Mandatory Compliance Rule 3**. Authority: [docs-authority-and-language.instructions.md](./instructions/docs-authority-and-language.instructions.md) and the docs it routes to.

## DDD Strategic Rules (Phase 1)

- Use [instructions/subdomain-rules.instructions.md](./instructions/subdomain-rules.instructions.md) for subdomain design rules.
- Use [instructions/bounded-context-rules.instructions.md](./instructions/bounded-context-rules.instructions.md) for Bounded Context design rules.
- Use [instructions/domain-layer-rules.instructions.md](./instructions/domain-layer-rules.instructions.md) for Domain Layer design rules.
- Use [instructions/hexagonal-rules.instructions.md](./instructions/hexagonal-rules.instructions.md) for Hexagonal Architecture and cross-cutting subdomain × hexagonal rules.