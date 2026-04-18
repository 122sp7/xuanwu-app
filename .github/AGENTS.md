# .github — Agent Guide

## Purpose

`.github/` 是 Copilot 行為治理層，定義工作規則、流程模板與工具能力路由。

## Start Here

- `TOOLING.md`：Tooling Documentation + AI Agent instruction 設計總入口
- `copilot-instructions.md`：always-on 全域契約

## Directory Map

| Path | Responsibility |
|---|---|
| `copilot-instructions.md` | 全域會話契約（精簡且穩定） |
| `instructions/` | `applyTo` 驅動的檔案範圍規則 |
| `prompts/` | 可重用工作流模板（plan / implement / review / test） |
| `skills/` | 工具型能力包（Toolbooks） |
| `agents/` | Agent profile 與 command contract（獨立維護） |

## Governance Rules

- `.github/` 只定義「行為與流程」，不複製 `docs/` 戰略真相。
- `copilot-instructions.md` 保持薄；細節下放到 `instructions/`。
- 同一主題只保留一份權威，其餘入口用 router/shim 連結。

## Read Order

1. `TOOLING.md`
2. `copilot-instructions.md`
3. `instructions/README.md`
4. `prompts/README.md`
5. `../docs/README.md`

## Route Here When

- 需要新增/調整 Copilot 行為規則
- 需要新增/調整 prompt workflow
- 需要更新 skill/tool 操作流程

## Route Elsewhere When

- 主域邊界、術語、context map → `docs/**/*`
- 模組內實作路由 → `src/modules/<context>/AGENTS.md`
