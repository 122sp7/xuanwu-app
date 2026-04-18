---
name: repomix
description: >-
  Repomix Explorer workflow skill. Use when AI needs to analyze repositories
  through Repomix outputs and especially when it should use xuanwu-skill
  references to understand this codebase.
user-invocable: true
disable-model-invocation: false
---

# Repomix

Use this skill when the task is repository exploration, pattern search, architecture understanding, or refreshing Repomix-generated skill references.

## Primary Goal

Make AI reliably know how to use `xuanwu-skill` as the first exploration path for this repository.

## Official Skill Integration (Elevated Priority)

The following three skills are **official Repomix ecosystem skills** — load and follow them before proceeding with any generation, exploration, or commit task:

| Skill | Role | When to Invoke |
|---|---|---|
| `repomix-explorer` | Primary exploration workflow — browse structure, search patterns, refresh skills | Anytime the goal is repo understanding or skill refresh |
| `agent-memory` | Persist findings across sessions — write after non-trivial exploration, read before starting |	Before exploring known areas; after any meaningful discovery |
| `contextual-commit` | Capture intent, decisions, constraints in every commit body | On every commit concluding a Repomix-driven change |

### Integration Order

1. **Session start** → read `agent-memory` summaries for the target area.
2. **Exploration** → follow `repomix-explorer` workflow.
3. **Implementation** → apply findings.
4. **Phase end** → write/update `agent-memory` with new facts.
5. **Commit** → follow `contextual-commit` format with `intent`, `decision`, `learned` action lines.

---

## Context7 Certainty Gate

- If confidence is below 99.99% for Repomix CLI flags, behavior, or config schema, verify with Context7 first.
- Required sequence: resolve library id -> get docs.
- Do not proceed with guessed CLI syntax.

## Explorer Workflow (Delegates to `repomix-explorer`)

> **Load `repomix-explorer` skill first.** This section aligns with it and adds Xuanwu-specific context.

1. **Read `agent-memory`** — scan summaries for the target module before any exploration.
2. Detect user intent:
  - understand repo structure
  - find specific patterns
  - reference prior implementations
3. Prepare analysis source:
  - if `.github/skills/xuanwu-skill/` exists, use it first
  - otherwise run `npm run repomix:skill` to generate/refresh
4. Analyze outputs in this order:
  - `references/summary.md` for scope and exclusions
  - `references/project-structure.md` for file map
  - `references/files.md` for symbol/pattern search
5. Use search-first strategy:
  - grep/search patterns first
  - read full file content only when necessary
6. Return insights:
  - structure summary
  - file-level evidence
  - actionable next steps
7. **Write `agent-memory`** — save non-obvious findings before the session ends.

## Agent Skills Generation Rules

- `--skill-generate` 會產生結構化目錄（不是單一打包檔）：
  - `SKILL.md`
  - `references/summary.md`
  - `references/project-structure.md`
  - `references/files.md`
  - `references/tech-stacks.md`（若版本與設定可用）
- 自動化流程優先採非互動：`--skill-output <path> --force`。
- `--skill-generate` 不可與 `--stdout` 或 `--copy` 併用。
- skills 名稱需維持穩定 kebab-case，避免頻繁改名造成引用漂移。

## How AI Should Use xuanwu-skill

When user asks architecture/pattern/where-is-X questions in this repo:

1. Start with `.github/skills/xuanwu-skill/SKILL.md`.
2. Go to `references/project-structure.md` to locate candidate files.
3. Use `references/files.md` to search symbols/imports/events.
4. If details are still insufficient, read original source files directly.
5. In answers, include concrete file evidence rather than generic summaries.

Recommended user intents:

- "What is the structure of this repo?"
- "Find all authentication-related code."
- "Where is this use case implemented?"
- "I want to implement a similar feature from another module."

## Generation Script Map

- `npm run repomix:skill` -> `.github/skills/xuanwu-skill`
- `npm run repomix:notebooklm` -> `.github/skills/xuanwu-notebooklm-skill`
- `npm run repomix:notion` -> `.github/skills/xuanwu-notion-skill`
- `npm run repomix:platform` -> `.github/skills/xuanwu-app-platform-skill`
- `npm run repomix:workspace` -> `.github/skills/xuanwu-app-workspace-skill`
- `npm run repomix:workspace-workflows` -> `.github/skills/xuanwu-app-workspace-workflows-skill`
- `npm run repomix:markdown` -> `.github/skills/xuanwu-markdown-skill`
- `npm run repomix:explore` -> `repomix.config.json`（即時探索輸出）
- `npm run repomix:app` -> `repomix.app.config.json`（App Router scope）
- `npm run repomix:remote -- <repo-url-or-owner/repo>` -> 遠端倉庫探索
- `npm run repomix:local -- <path>` -> 本地目錄探索

## Guardrails

- Keep one scope per run to avoid mixed ownership.
- Treat repomix config files as source of truth for generation scope.
- Do not claim semantic correctness from generation success alone; spot-check high-risk files.
- Prefer search-first analysis before reading large content blocks.
- If output is noisy, reduce assumptions before adding abstraction.
- 對高風險結論，需附來源檔證據（至少一個 `references/*` 路徑）。

## Output Contract

- intent_type
- source_used (`xuanwu-skill` or fresh repomix output)
- target_script (if generated)
- generated_path (if generated)
- evidence_files
- findings_summary
- residual_risk

Tags: #use skill context7 #use skill xuanwu-skill #use skill occams-razor #use skill repomix-explorer #use skill agent-memory #use skill contextual-commit
