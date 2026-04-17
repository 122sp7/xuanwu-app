# .github — Agent Guide

## Purpose

`.github/` 是 Copilot 行為治理層，定義 Copilot 在本 repo 的工作規則、工具流程與技能包。

## Directory Map

| 路徑 | 職責 |
|---|---|
| `copilot-instructions.md` | 永遠啟用的 workspace 全域 Copilot 指引 |
| `instructions/` | 範圍化行為規則（`.instructions.md`，依 `applyTo` 生效） |
| `agents/` | 專門 Agent 定義與 `commands.md`（build/lint/test/deploy 指令） |
| `prompts/` | 可重用的 Copilot 工作流提示範本 |
| `skills/` | 技能包（`SKILL.md`），提供專門能力知識與執行工作流 |

## Governance Rules

- `.github/` 定義 Copilot **行為規則**；不重複或競爭 `docs/` 的架構真相。
- 架構知識（主域、子域、ubiquitous language、context map）的權威是 `docs/`。
- 把細節放在 `instructions/`；讓 `copilot-instructions.md` 保持精簡穩定。
- Skills 不是戰略權威；它們是執行流程的輔助工具包。

## Route Here When

- 新增或修改 Copilot 行為規則（`instructions/`）。
- 新增或修改 agent 定義或指令（`agents/`）。
- 新增或修改可重用提示範本（`prompts/`）。
- 新增或修改技能包（`skills/`）。

## Route Elsewhere When

- 需要修改架構邊界、subdomain 定義或 context map → `docs/`。
- 需要修改模組實作規則 → `src/modules/<context>/AGENT.md`。
- 需要修改全域專案說明 → `AGENTS.md` 或 `CLAUDE.md`（根目錄）。

## Document Network

- [copilot-instructions.md](./copilot-instructions.md) — 全域 Copilot workspace 指引
- [agents/commands.md](./agents/commands.md) — build/lint/test/deploy 指令清單
- [instructions/architecture-core.instructions.md](./instructions/architecture-core.instructions.md) — 模組架構規則
- [instructions/architecture-runtime.instructions.md](./instructions/architecture-runtime.instructions.md) — runtime split 規則
- [../docs/README.md](../docs/README.md) — 架構文件索引（權威）
