# VS Code Agent / Prompt / Instruction / Skill 檔案屬性說明文件

本文件整理 **VS Code Agents / Copilot Agent System** 中四種設定檔類型與其支援屬性：

1. Agent 檔案
2. Prompt 檔案
3. Instruction 檔案
4. Skill 檔案

此系統主要用於 **Visual Studio Code Agent / GitHub Copilot Agents 架構。

---

# 一、Agent 檔案（.agent.md）

**用途**：定義 AI 代理角色、能力、工具、子代理與協作流程。

## 支援屬性

| 屬性                       | 說明          |
| ------------------------ | ----------- |
| agents                   | 子代理         |
| argument-hint            | 呼叫參數提示      |
| description              | 代理描述        |
| disable-model-invocation | 禁止自動呼叫模型    |
| github                   | GitHub 整合設定 |
| handoffs                 | 可交接給其他代理    |
| model                    | 使用模型        |
| name                     | 代理名稱        |
| target                   | 作用目標        |
| tools                    | 可使用工具       |
| user-invocable           | 是否允許使用者直接呼叫 |

## 範例

```yaml
name: implementer-agent
description: Implement features and write code
model: gpt-5-codex
tools: [read, edit, search]
handoffs: [reviewer-agent]
user-invocable: true
```

---

# 二、Prompt 檔案（.prompt.md）

**用途**：定義可重複使用的任務提示模板（Prompt Template）。

## 支援屬性

| 屬性            | 說明        |
| ------------- | --------- |
| agent         | 指定使用的代理   |
| argument-hint | 參數提示      |
| description   | 提示用途      |
| model         | 使用模型      |
| name          | Prompt 名稱 |
| tools         | 可使用工具     |

## 範例

```yaml
name: generate-api
description: Generate API endpoint
agent: backend-agent
model: gpt-5-codex
tools: [read, edit]
argument-hint: <resource-name>
```

---

# 三、Instruction 檔案（.instruction.md）

**用途**：定義專案規範、架構規則、開發準則。

## 支援屬性

| 屬性          | 說明       |
| ----------- | -------- |
| applyTo     | 套用的檔案或目錄 |
| description | 規則說明     |
| name        | 指示名稱     |

## 範例

```yaml
name: nextjs-architecture
description: Enforce Next.js App Router structure
applyTo: app/**
```

Instruction 通常用於：

* DDD 分層規範
* 命名規則
* API 設計規範
* 測試規範
* 專案架構規範

---

# 四、Skill 檔案（SKILL.md）

**用途**：定義可安裝、可重用的技能模組（通常可透過 npx skills add 安裝）。

## 支援屬性

| 屬性                       | 說明        |
| ------------------------ | --------- |
| argument-hint            | 技能參數提示    |
| compatibility            | 相容性       |
| description              | 技能描述      |
| disable-model-invocation | 禁止模型自動呼叫  |
| license                  | 授權        |
| metadata                 | 額外資訊      |
| name                     | 技能名稱      |
| user-invocable           | 是否允許使用者呼叫 |

## 範例

```yaml
name: repo-analyzer
description: Analyze repository structure
argument-hint: <repo-path>
compatibility: vscode
license: MIT
user-invocable: true
metadata:
  author: team-ai
```

---

# 五、四種檔案定位差異（重要）

這四種檔案在系統中的角色如下：

| 類型           | 作用         | 層級  |
| ------------ | ---------- | --- |
| Agents       | AI 角色與代理系統 | 系統層 |
| Prompts      | 任務模板       | 任務層 |
| Instructions | 專案規範       | 規則層 |
| Skills       | 可安裝技能模組    | 能力層 |

---

# 六、整體關係架構

整體關係可以用這個邏輯理解：

```
Instructions = 規則 / 架構 / Coding Standards
Prompts      = 任務模板
Skills       = 能力模組
Agents       = AI 角色 / 指揮系統
```

關係流程：

```
Agent 使用 Skills
Agent 執行 Prompt
Agent 遵守 Instructions
Agents 之間可以 handoff
```

或簡化為：

```
Agent = 誰做事
Prompt = 做什麼
Instruction = 怎麼做
Skill = 有什麼能力
```

---

# 七、建議 .github 結構

建議專案目錄：

```
.github/
│
├─ agents/
│   ├─ planner.agent.md
│   ├─ implementer.agent.md
│   ├─ reviewer.agent.md
│   └─ repo-architect.agent.md
│
├─ prompts/
│   ├─ generate-api.prompt.md
│   ├─ refactor-module.prompt.md
│   └─ write-tests.prompt.md
│
├─ instructions/
│   ├─ ddd-architecture.instruction.md
│   ├─ nextjs-structure.instruction.md
│   └─ coding-standards.instruction.md
│
├─ skills/
│   ├─ repo-analyzer/
│   │   └─ SKILL.md
│   └─ test-generator/
│       └─ SKILL.md
```

---

# 八、屬性總表（完整）

## Agent

```
agents
argument-hint
description
disable-model-invocation
github
handoffs
model
name
target
tools
user-invocable
```

## Prompt

```
agent
argument-hint
description
model
name
tools
```

## Instruction

```
applyTo
description
name
```

## Skill

```
argument-hint
compatibility
description
disable-model-invocation
license
metadata
name
user-invocable
```

---

