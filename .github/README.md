# VS Code Agent / Prompt / Instruction 檔案屬性說明

本文件說明在 **VS Code Agent 系統** 中三種類型設定檔所支援的屬性：

1. 提示檔案（Prompt file）
2. 指示檔案（Instruction file）
3. 代理程式檔案（Agent file）

---

# 一、提示檔案（Prompt File）

**用途**：定義可被呼叫的提示模板（Prompt Template）

## 支援屬性

| 屬性            | 用途                    |
| ------------- | --------------------- |
| agent         | 指定此 prompt 屬於哪個 agent |
| argument-hint | 提示參數格式                |
| description   | 提示用途說明                |
| model         | 指定使用模型                |
| name          | Prompt 名稱             |
| tools         | 允許使用的工具               |

## 範例

```yaml
name: generate-api
description: Generate API endpoint
agent: backend-agent
model: 'GPT-5.3-Codex'
tools: [read, edit, search]
argument-hint: <resource-name>
```

## 說明

Prompt file 比較像：

> 可重複呼叫的任務模板

例如：

* 生成 API
* 生成測試
* 重構程式碼
* 建立 DTO
* 建立 Migration

---

# 二、指示檔案（Instruction File）

**用途**：定義規則、架構指導、開發規範（類似 AI 的 coding standards）

## 支援屬性

| 屬性          | 用途        |
| ----------- | --------- |
| applyTo     | 套用的檔案或資料夾 |
| description | 規則說明      |
| name        | 指示名稱      |

## 範例

```yaml
name: nextjs-structure
description: Enforce Next.js app router structure
applyTo: app/**
```

## 說明

Instruction file 比較像：

> 專案規範 / 架構守則 / Coding Guideline

例如：

* Next.js 結構規範
* DDD 分層規範
* 命名規則
* API 設計規範
* 測試規範

Instruction 是 **長期規則**
Prompt 是 **一次性任務**

---

# 三、代理程式檔案（Agent File）

**用途**：定義 AI 代理（Agent），包含能力、工具、可呼叫性、代理協作等

## 支援屬性

| 屬性                       | 用途          |
| ------------------------ | ----------- |
| agents                   | 子代理         |
| argument-hint            | 呼叫參數提示      |
| description              | 代理說明        |
| disable-model-invocation | 禁止自動呼叫模型    |
| github                   | GitHub 整合   |
| handoffs                 | 可交接給其他代理    |
| model                    | 使用模型        |
| name                     | 代理名稱        |
| target                   | 作用目標        |
| tools                    | 可使用工具       |
| user-invocable           | 是否允許使用者直接呼叫 |

---

## Agent 範例

```yaml
name: backend-agent
description: Backend architecture and API development agent
model: 'GPT-5.3-Codex'
tools: [read, edit, search]
agents: [database-agent, api-agent]
handoffs: [reviewer-agent]
user-invocable: true
```

---

# 四、三種檔案差異總結

| 類型           | 用途          | 作用層級 |
| ------------ | ----------- | ---- |
| instructions | 專案規範 / 開發規則 | 全域規則 |
| prompts      | 任務模板        | 任務層  |
| agents       | AI 角色與能力    | 系統層  |

---

# 五、整體架構關係（很重要）

可以理解成三層：

```
Agents（代理角色）
    ↓ 使用
Prompts（任務模板）
    ↓ 遵守
Instructions（專案規範）
```

也就是：

```
Agent = 誰來做
Prompt = 做什麼
Instruction = 怎麼做
```

這是整個 VS Code Agent / Copilot Agents 架構的核心模型。

---

# 六、常見專案目錄結構

建議結構：

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
│   ├─ nextjs-architecture.instruction.md
│   ├─ ddd-structure.instruction.md
│   └─ coding-standards.instruction.md
```

---

# 七、最重要觀念（核心）

記住這個對應關係：

| 檔案           | 本質      |
| ------------ | ------- |
| agents       | AI 組織架構 |
| prompts      | 任務腳本    |
| instructions | 開發憲法    |
| tools        | 能力      |
| handoffs     | 代理協作    |
| applyTo      | 規則作用範圍  |

---

