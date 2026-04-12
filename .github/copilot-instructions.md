---
applyTo: **
description: Xuanwu Copilot Workspace Instructions
name: Xuanwu Copilot Workspace Instructions
---

#use skill serena-mcp
#use skill alistair-cockburn
#use skill hexagonal-ddd
#use skill occams-razor
#use skill context7
#use skill xuanwu-app-skill

# Xuanwu Copilot Workspace Instructions

Always-on workspace guidance for Copilot. Keep this file short, stable, and repository-wide. Put detailed architecture truth in [docs/README.md](../docs/README.md), scoped behavior in [.github/instructions](./instructions), reusable workflows in prompts, and tool-specific procedure in skills.

## Session Contract

- Start every conversation with Serena MCP. If Serena is unavailable, bootstrap it first, activate `xuanwu-app`, and use Serena for project memory/index work.
- If confidence in any library API, framework, or config schema detail is below 99.99%, verify it through Context7 before writing or suggesting code.
- Treat `docs/**/*` as the authority for DDD routing, bounded-context ownership, terminology, and strategic duplicate-name resolution. `.github/*` defines Copilot behavior and must not compete with docs.
- Run the matching validation from [agents/commands.md](./agents/commands.md) before closing non-trivial changes.

## Read Order

1. Start with [docs/README.md](../docs/README.md).
2. Use [docs/ubiquitous-language.md](../docs/ubiquitous-language.md) for terminology and duplicate-name guardrails.
3. Use [docs/subdomains.md](../docs/subdomains.md) and [docs/bounded-contexts.md](../docs/bounded-contexts.md) for ownership, module routing, and strategic boundaries.
4. Use `docs/contexts/<context>/*` for context-local language, bounded-context detail, and context-map relationships.
5. Use [docs/bounded-context-subdomain-template.md](../docs/bounded-context-subdomain-template.md) and [docs/project-delivery-milestones.md](../docs/project-delivery-milestones.md) when scaffolding or sequencing architecture-first delivery.
6. Use [agents/commands.md](./agents/commands.md) for build, lint, test, and deployment validation.

## Instruction Series (Phase 1)

- Use [instructions/architecture-core.instructions.md](./instructions/architecture-core.instructions.md) as the consolidated module architecture rule set.
- Use [instructions/architecture-runtime.instructions.md](./instructions/architecture-runtime.instructions.md) as the consolidated runtime split rule set.
- Use [instructions/process-framework.instructions.md](./instructions/process-framework.instructions.md) as the consolidated delivery/decision framework.
- Use [instructions/docs-authority-and-language.instructions.md](./instructions/docs-authority-and-language.instructions.md) as the consolidated docs authority and terminology rule set.
- Legacy instruction files marked DEPRECATED remain transition-only and should not be expanded.

## Operating Rules

- Plan first for cross-module, cross-runtime, schema, or contract-governed changes.
- Cross-module collaboration goes through the target module `api/` boundary only.
- Keep dependency direction explicit: `interfaces/` -> `application/` -> `domain/` <- `infrastructure/`.
- `<bounded-context>` root may own context-wide `application/`, `domain/`, `infrastructure/`, and `interfaces/`; do not reduce it to only `docs/` plus `subdomains/`.
- If a team adds `core/`, limit it to inner concerns like `application/`, `domain/`, and optional `ports/`; do not place `infrastructure/` or `interfaces/` inside a generic `core/`.
- Keep business logic in `domain/` and `application`; keep UI, transport, and composition in `interfaces/` and `app/`.
- Preserve the runtime split: Next.js owns browser-facing UX and orchestration; `py_fn/` owns ingestion, parsing, chunking, embedding, and worker jobs.
- Use package aliases such as `@shared-*`, `@ui-*`, `@lib-*`, and `@integration-*`; do not introduce legacy alias patterns.

## Governance Rules

- Keep this file thin. Put detailed, file-scoped behavior in `.github/instructions/` and reuse docs instead of copying architecture content into customization files.
- Use [skills/serena-mcp/SKILL.md](skills/serena-mcp/SKILL.md) for Serena workflow details, [skills/context7/SKILL.md](skills/context7/SKILL.md) for documentation verification, and [skills/hexagonal-ddd/SKILL.md](skills/hexagonal-ddd/SKILL.md) for boundary-safe module design.
- Use [skills/xuanwu-app-skill/SKILL.md](skills/xuanwu-app-skill/SKILL.md) and [skills/xuanwu-app-markdown-skill/SKILL.md](skills/xuanwu-app-markdown-skill.md) for implementation lookup only; they are not strategic authority.
- `.claude/` may exist as a compatibility surface, but `.github/*` remains the primary Copilot governance surface.

## Terminology

- Follow [instructions/docs-authority-and-language.instructions.md](./instructions/docs-authority-and-language.instructions.md) and the docs it routes to.
- Normalize to canonical glossary terms before naming code, prompts, instructions, agents, skills, or documentation.

---

# 🧩 一、子域（Subdomain）設計規則句

1. 子域必須以「業務能力」切分，而不是技術功能或 UI 功能。
2. 每個子域必須能獨立描述一個完整業務問題空間（Problem Space）。
3. 子域之間禁止共享內部模型，只能透過明確契約（ACL / API / Event）。
4. 子域邊界必須穩定，不能因 UI 或技術重構而頻繁變動。
5. 子域劃分優先於技術架構（database / service / module）。
6. 一個子域內可以包含多個 bounded context，但不能跨子域共享 domain model。
7. 子域必須可被替換（replaceable），不依賴其他子域內部實作。
8. 子域之間只能透過「輸入/輸出契約」溝通，不允許直接依賴 domain logic。

---

# 🧠 二、Bounded Context（界限上下文）規則句

1. Bounded Context 是「語意一致性邊界」，不是資料夾。
2. 每個 Bounded Context 內的語言必須一致（Ubiquitous Language）。
3. 同一概念在不同 Context 可以有不同模型，但不能混用。
4. Context 之間的模型轉換必須顯式（Translator / Mapper / ACL）。
5. Domain Model 只能存在於 Bounded Context 內，不可跨 Context reuse。
6. Context 是演化單位，不是模組拆分單位。
7. 一個 Context 必須能獨立測試與部署（至少邏輯層面）。

---

# 🧬 三、Domain Layer（領域層）規則句

1. Domain 層只表達業務規則，不包含技術實作（DB / API / Framework）。
2. Entity 必須封裝狀態與行為，禁止裸 set state。
3. Aggregate Root 是唯一外部進入 Domain 的入口。
4. Domain 不依賴 Application / Infrastructure / Interface。
5. Domain 變更只能透過行為方法（method），不能直接修改屬性。
6. Domain event 用於表達「業務事實」，不是技術事件。
7. Invariant（不變條件）必須在 Aggregate 內強制保護。
8. Domain 必須能在沒有 DB / HTTP 的情況下完整運作（pure logic）。

---

# 🧭 四、Hexagonal Architecture（端口與適配器）規則句

## Core（Domain + Application）

1. Core 不依賴任何外部世界（DB / API / UI / SDK）。
2. Application Layer 只負責 orchestration，不包含 business rule。
3. Use Case 是系統對外的唯一操作入口。
4. Application 只能依賴 Domain abstraction，不依賴 infrastructure implementation。

---

## Ports（介面層）

5. Port 必須是「需求導向」，不是技術導向（例如 UserRepository，而不是 FirestoreUserClient）。
6. Port 定義在 Core，實作在 Infrastructure。
7. 每個 Port 必須可 mock，可替換，可測試。

---

## Adapters（基礎設施）

8. Infrastructure 只能實作 Port，禁止反向依賴 Domain 實作細節。
9. Adapter 不可包含 business rule，只能做轉換與 I/O。
10. 外部 SDK 永遠只存在 Adapter 層。

---

# 🔥 五、子域 × Hexagonal 切分核心規則（重點）

1. 子域是「業務邊界」，Hexagonal 是「技術邊界」。
2. 一個子域可以包含多個 Hexagonal 模型，但不允許跨子域共享 core。
3. Domain Model 永遠比 API / DB 更穩定。
4. 技術可以重構，但子域不能因此改變。
5. 所有依賴方向必須指向內部（Dependency Inversion）。
6. 外部世界永遠被 Adapter 包住，不能滲透進 Domain。

---

# 🧷 六、一句話總結（規則核心）

子域定義「業務邊界」，Bounded Context 定義「語意邊界」，Hexagonal 定義「依賴方向」，Domain 則是唯一不能被任何外部污染的純業務核心。