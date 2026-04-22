# .github

Copilot 治理層，定義代理行為規則、prompt 工作流、可重用技能包。

## 層級架構

本目錄的五個層級組織：

| 層級 | 檔案/目錄 | 職責 | 讀取時機 |
|------|---------|------|---------|
| **導向入口** | README.md（你在讀這個） | 快速概覽本層結構 | 第一次進入 .github/ |
| **治理規則** | [AGENTS.md](./AGENTS.md) | 本層的路由規則集 | 開始工作前，確認路由 |
| **全局合約** | [copilot-instructions.md](./copilot-instructions.md) | 全工作區常設規則、session 初始化、mandatory skills | 每次 session 開始 |
| **設計決策** | [TOOLING.md](./TOOLING.md) | .github 層級組織邏輯、layered source of truth | 理解 .github 組織設計時 |
| **檔案作用域規則** | [instructions/](./instructions/) | 31 個 instruction 檔案，各自獨立決策領域（架構、流程、實作等） | 需要特定決策時查詢 |
| **工作流範本** | [prompts/](./prompts/) | 35 個 prompt 範本，可重用工作流（plan、implement、review 等） | 執行常見任務時參考 |
| **能力工具箱** | [skills/](./skills/) | 技能書與工具特定操作規範 | 使用特定工具或技能時 |

## 快速入口

### 剛開始工作
1. 讀 [copilot-instructions.md](./copilot-instructions.md) — 全局常設規則
2. 讀 [AGENTS.md](./AGENTS.md) — 本層路由邏輯

### 需要特定決策
- **模組邊界 / 分層** → [instructions/architecture-core.instructions.md](./instructions/architecture-core.instructions.md)
- **Runtime 分割** → [instructions/architecture-runtime.instructions.md](./instructions/architecture-runtime.instructions.md)
- **流程 / 決策權重** → [instructions/process-framework.instructions.md](./instructions/process-framework.instructions.md)
- **文檔權威 / 命名** → [instructions/docs-authority-and-language.instructions.md](./instructions/docs-authority-and-language.instructions.md)

### 需要工作流範本
- **規劃** → [prompts/README.md](./prompts/README.md)
- **實作** → 相應的 `*.prompt.md`

### 理解設計決策
- **為什麼這樣組織** → [TOOLING.md](./TOOLING.md)
- **Layered Source of Truth** → [TOOLING.md](./TOOLING.md#layered-source-of-truth)

## 重要原則

- **戰略真相在 docs/**：架構決策、bounded context 所有權、ubiquitous language 的權威在 [docs/](../docs/)；本層只定義 **Copilot 如何工作**，不競爭架構知識
- **Thin Global, Rich Local**：[copilot-instructions.md](./copilot-instructions.md) 保持精簡；細節下放到 `instructions/` 與 `prompts/`
- **一意一檔**：每個 instruction 檔案只處理一個決策領域；工作流相同但不同意圖時新增 prompt，不複寫 instruction
- **路由優先**：遇到模糊決策時，優先從 AGENTS.md 找到正確的下一個讀取檔案，而不是直接回答

## 目錄結構

```
.github/
├── README.md                    ← 你在讀這個
├── AGENTS.md                    ← 本層路由規則
├── copilot-instructions.md      ← 全局常設規則
├── TOOLING.md                   ← 設計決策文檔
├── instructions/                ← 31 個 .instructions.md 檔案
│   ├── architecture-core.instructions.md
│   ├── architecture-runtime.instructions.md
│   ├── process-framework.instructions.md
│   ├── docs-authority-and-language.instructions.md
│   └── ... (27 more files)
├── prompts/                     ← 35 個 .prompt.md 檔案
│   ├── README.md
│   └── ... (plan / implement / review / test / etc.)
└── skills/                      ← Skill 書與工具規範
    ├── serena-mcp/
    ├── context7/
    ├── hexagonal-ddd/
    └── ... (30+ skills)
```

## 與其他層的關係

| 層 | 權威檔案 | 職責 |
|---|---------|------|
| **docs/** (戰略層) | `docs/README.md` | 架構決策、bounded context、術語 |
| **.github/** (治理層) | `copilot-instructions.md` | Copilot 行為規則、工作流、skills |
| **src/modules/** (實作層) | 各 context 的 `AGENTS.md` | 模組實作規則、API boundary |
| **packages/** (共用層) | `packages/AGENTS.md` | 共用原語與整合 wrapper 規則 |
