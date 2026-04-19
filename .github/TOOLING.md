# Tooling Documentation + AI Agent Instruction Design

## Goal

讓 `.github/` 文件成為「可執行路由層」：
- 規則只放在該放的位置
- 同一主題只保留一份權威
- 先路由、再執行，不重複敘事

## Layered Source of Truth

| Layer | What it owns | Canonical files |
|---|---|---|
| Strategic architecture truth | Bounded contexts, context map, ubiquitous language | `docs/README.md` + `docs/**/*` |
| Copilot global contract | Session-level behavior, read order, always-on constraints | `.github/copilot-instructions.md` |
| File-scoped execution rules | `applyTo`-based behavioral constraints | `.github/instructions/*.instructions.md` |
| Reusable task workflows | Prompt templates for plan / implement / review / test | `.github/prompts/*.prompt.md` |
| Capability toolbooks | Tool-specific operational skills | `.github/skills/*/SKILL.md` |

## Agent Instruction Design Rules

1. **One intent, one file**：單一文件只處理一種決策。
2. **Router-first**：先把任務導向正確 instruction / prompt / skill，再執行。
3. **Thin global, rich local**：`copilot-instructions.md` 保持精簡；細節下放到 `instructions/`。
4. **No architecture duplication**：架構真相回到 `docs/`，`.github/` 不再複寫 inventory。
5. **Executable over narrative**：優先輸入、步驟、輸出契約、驗證命令。
6. **Compatibility shim allowed**：舊入口保留薄轉址，不再擴寫內容。

## Runtime Routing

| If task is about... | Read first | Then |
|---|---|---|
| module boundaries / layering | `instructions/architecture-core.instructions.md` | owning module `AGENTS.md` |
| runtime split (Next.js vs `fn`) | `instructions/architecture-runtime.instructions.md` | context docs |
| process/decision weight | `instructions/process-framework.instructions.md` | matching prompt |
| docs naming/authority | `instructions/docs-authority-and-language.instructions.md` | `docs/structure/domain/ubiquitous-language.md` |
| implementation workflow | `prompts/README.md` | selected `*.prompt.md` |

## Prompt Quality Contract

每個 prompt 應固定包含：
1. `name`
2. `description`
3. `agent`
4. `argument-hint`（需要輸入時）
5. 明確的 **Workflow / Output / Validation**

## Maintenance Policy

- 新增規則前，先檢查是否能併入既有權威文件。
- 對同主題發現重複時：保留最新權威，其他改成 thin router。
- 任何流程調整，優先更新 `instructions/README.md` 與 `prompts/README.md` 索引。
