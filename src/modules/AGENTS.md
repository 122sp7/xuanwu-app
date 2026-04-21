# src/modules — Agent Guide

## Immediate Index

- Parent: [../AGENTS.md](../AGENTS.md)
- Pair: [README.md](README.md)
- Template baseline: [template/AGENTS.md](template/AGENTS.md)

## Bounded Context Index

| Module | Role | Agent entry | Human overview |
|---|---|---|---|
| `ai/` | AI 機制能力模組；提供 AI mechanism，使用者體驗仍由其他模組組合。 | [AGENTS.md](ai/AGENTS.md) | [README.md](ai/README.md) |
| `analytics/` | 分析能力模組；承接事件、指標、洞察與實驗相關實作。 | [AGENTS.md](analytics/AGENTS.md) | [README.md](analytics/README.md) |
| `billing/` | 計費能力模組；處理 entitlement、subscription、usage-metering。 | [AGENTS.md](billing/AGENTS.md) | [README.md](billing/README.md) |
| `iam/` | Identity & Access Management 模組；account / organization 已集中於此。 | [AGENTS.md](iam/AGENTS.md) | [README.md](iam/README.md) |
| `notebooklm/` | NotebookLM 使用者體驗模組；實際子域以目錄結構為準。 | [AGENTS.md](notebooklm/AGENTS.md) | [README.md](notebooklm/README.md) |
| `notion/` | KnowledgeArtifact 模組；Page / Block / Database 等可寫內容由此所有。 | [AGENTS.md](notion/AGENTS.md) | [README.md](notion/README.md) |
| `platform/` | 平台橫切能力模組；account / organization 已遷入 iam。 | [AGENTS.md](platform/AGENTS.md) | [README.md](platform/README.md) |
| `template/` | 可複製骨架模組；提供新 bounded context 的結構參考。 | [AGENTS.md](template/AGENTS.md) | [README.md](template/README.md) |
| `workspace/` | 工作區協作模組；workspace-workflow 已拆分，現況以子目錄索引為準。 | [AGENTS.md](workspace/AGENTS.md) | [README.md](workspace/README.md) |

## Routing Rules

- 讀 module-local 規則時，先進入對應 `src/modules/<context>/AGENTS.md`。
- 跨模組協作只經由 `src/modules/<context>/index.ts`。
- 子域清單以實際 `subdomains/` 目錄為準，不再在本檔重複維護狀態表。

## Drift Guard

- `AGENTS.md` 管 nested index 與 routing。
- `README.md` 管模組層概覽。
