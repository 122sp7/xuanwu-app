# AI Agent 文件分類標準

> Xuanwu App `.github/` 與 `docs/` 文件的類型分類、放置位置與命名規範。
>
> **Context7 驗證來源**：ADR 格式參考 Michael Nygard / AWS ADR Process；文件四象限分類參考 Diátaxis Documentation Framework。

---

## 設計原則

**可組合 + 可替換 + 不產生語意重疊。**

每份文件只服務一種目的。邊界模糊時，優先以「讀者需要什麼」為判斷依據：
- 需要學習 → Tutorial（範例型）
- 需要完成特定任務 → How-to（任務型 / 流程型）
- 需要查閱細節 → Reference（結構型 / 工具型）
- 需要理解背後原因 → Explanation（決策型 ADR / 規則型）

---

## 文件類型清單

| # | 類型 | 別名 | 讀者需求 |
|---|------|------|----------|
| 1 | 規則型（Rules / Constraints） | Instructions | 理解限制與邊界 |
| 2 | 流程型（Process / Flow） | — 內嵌於 Skill | 執行有序步驟 |
| 3 | 能力型（Capability / Skill） | Skillbook | 操作特定能力 |
| 4 | 任務型（Task Template / Prompt） | Prompt | 完成特定任務 |
| 5 | 結構型（Structure / Topology） | Reference | 查閱結構細節 |
| 6 | 決策型（Decision / ADR） | ADR | 理解決策背景與原因 |
| 7 | 範例型（Example / Reference） | Example | 對照實際範例 |
| 8 | 工具型（Tooling Documentation） | Usage | 操作工具 |

> **Diátaxis 對照**：Explanation ≈ 規則型 + 決策型；Reference ≈ 結構型 + 工具型；How-to ≈ 任務型 + 流程型；Tutorial ≈ 範例型。

---

## 類型選擇決策表

判斷文件類型時，先問兩個問題：

| 問題一 | 問題二 | 結果 |
|--------|--------|------|
| 是否引導行動？Yes | 學習新技能（Study）| → **範例型（Tutorial）** |
| 是否引導行動？Yes | 解決具體問題（Work）| → **任務型 / 流程型（How-to）** |
| 是否引導行動？No | 查閱細節（Work）  | → **結構型 / 工具型（Reference）** |
| 是否引導行動？No | 理解概念（Study） | → **規則型 / 決策型（Explanation）** |

---

# 類型 → 放置位置
| 類型             | 位置                     |
| -------------- | ---------------------- |
| 規則型（Rules）     | `.github/instructions` |
| 流程型（Flow）      | `.github/skills`       |
| 能力型（Skill）     | `.github/skills`       |
| 任務型（Prompt）    | `.github/prompts`      |
| 結構型（Structure） | `docs/structure`       |
| 決策型（ADR）       | `docs/decisions`       |
| 範例型（Example）   | `docs/examples`        |
| 工具型（Tooling）   | `docs/tooling`         |
| 編排（Agent）      | `.github/agents`       |

# 總體結構
.github/
  agents/
  instructions/
  prompts/
  skills/
  workflows/
  copilot-instructions.md
  AGENT.md
  README.md

docs/
  structure/
  decisions/
  examples/
  tooling/
  AGENT.md
  README.md

# 命名規則（核心標準）

全部統一：

kebab-case
語意優先，不描述實作
避免動詞 + and + 動詞
一檔一責任

# 各類型命名規範 + 範例

---

## 1️⃣ `.github/instructions`（規則型）

### 📌 命名公式

```txt
<domain>-<rule-type>.md
```

### 📌 範例

```txt
instructions/
  architecture-boundary.md
  module-dependency.md
  firestore-access.md
  naming-convention.md
  prompt-guidelines.md
```

### 📌 規則寫法（強制）

```md
- MUST ...
- MUST NOT ...
- SHOULD ...
```

---

## 2️⃣ `.github/skills`（能力 + 流程）

### 📌 命名公式

```txt
<capability>.md
```

### 📌 範例

```txt
skills/
  analyze-codebase.md
  design-architecture.md
  generate-feature.md
  review-pr.md
  refactor-module.md
```

### 📌 結構（固定）

```md
# Skill: analyze-codebase

## When to use
## Input
## Process (Flow)
## Output
## Constraints
```

👉 Flow 不拆檔，**內嵌在 skill**

---

## 3️⃣ `.github/prompts`（任務型）

### 📌 命名公式

```txt
<action>-<artifact>.md
```

### 📌 範例

```txt
prompts/
  generate-pr-description.md
  create-feature-spec.md
  summarize-document.md
  generate-firebase-rules.md
```

### 📌 結構

```md
# Task: generate-pr-description

## Input
## Output Format
## Prompt Template
```

---

## 4️⃣ `.github/agents`（編排）

### 📌 命名公式

```txt
<role>-agent.md
```

### 📌 範例

```txt
agents/
  architect-agent.md
  feature-dev-agent.md
  code-review-agent.md
```

### 📌 結構

```md
# Agent: architect-agent

## Use Instructions
## Use Skills
## Use Prompts
## Behavior
```

👉 agent 只負責「組裝」，不寫細節

---

# 五、docs 層（非 AI runtime，但極重要）

---

## 5️⃣ `docs/structure`（結構型）

### 📌 命名公式

```txt
<scope>-structure.md
```

### 📌 範例

```txt
structure/
  project-structure.md
  module-structure.md
  app-router-structure.md
  firestore-schema.md
```

---

## 6️⃣ `docs/decisions`（ADR）

> **Context7 驗證**（Michael Nygard / AWS ADR Process）：ADR 的核心價值是記錄「**為什麼**做這個決定」，而不是「怎麼做」。至少包含 Context、Decision、Consequences 三段。AWS 建議 ADR 可以是「活文件」，可加日期戳記追加新資訊，而不必另開新 ADR。

### 📌 命名公式（強制）

```txt
ADR-<number>-<title>.md
```

### 📌 範例

```txt
decisions/
  ADR-001-use-firestore.md
  ADR-002-app-router.md
  ADR-003-genkit-flow-design.md
```

### 📌 結構（Michael Nygard 完整格式）

```md
# ADR-001: <標題>

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-XXX

## Context
說明促成這個決策的背景、約束與問題空間。
不需要解釋最終選擇，只需說明「為什麼需要做決定」。

## Decision
我們選擇做什麼，以及理由（一句話結論 + 說明）。
重點：聚焦 WHY，不是 HOW。

## Consequences
這個決定帶來的後果（正面、負面、中性均需列出）。
包含已知的 trade-off 與未來需要監控的項目。
```

### 📌 ADR 撰寫守則

- 每個 ADR 只捕捉一個決策。
- 若舊決策被推翻，在舊 ADR 標記 `Superseded by ADR-XXX`，再開新 ADR。
- ADR 是不可刪除的永久記錄；可追加日期戳記補充後續觀察。

---

## 7️⃣ `docs/examples`（範例型）

### 📌 命名公式

```txt
<topic>-example.md
```

### 📌 範例

```txt
examples/
  module-design-example.md
  firebase-function-example.md
  genkit-flow-example.md
```

---

## 8️⃣ `docs/tooling`（工具型）

### 📌 命名公式

```txt
<tool>-usage.md
```

### 📌 範例

```txt
tooling/
  firebase-admin-usage.md
  firestore-rules-usage.md
  genkit-usage.md
```

---

# 六、關鍵約束（避免語意重疊）

### ❗ 1. 規則不能寫在 skill

* ❌ `skills/firebase-rules.md`
* ✅ `instructions/firestore-access.md`

---

### ❗ 2. 流程不能獨立存在

* ❌ `flows/generate-feature-flow.md`
* ✅ 放進 `skills/generate-feature.md`

---

### ❗ 3. prompt 不包含 business logic

* ❌ decision / flow
* ✅ only template

---

### ❗ 4. agent 不寫規則

* 只引用 instructions

---

# 七、最終結構（可直接用）

```txt
.github/
  agents/
    architect-agent.md
    feature-dev-agent.md
    code-review-agent.md

  instructions/
    architecture-boundary.md
    module-dependency.md
    firestore-access.md
    naming-convention.md

  skills/
    analyze-codebase.md
    design-architecture.md
    generate-feature.md
    review-pr.md

  prompts/
    generate-pr-description.md
    create-feature-spec.md
    summarize-document.md

docs/
  structure/
    project-structure.md
    module-structure.md

  decisions/
    ADR-001-use-firestore.md
    ADR-002-app-router.md

  examples/
    module-design-example.md
    genkit-flow-example.md

  tooling/
    firebase-admin-usage.md
    genkit-usage.md
```

---

# 八、Diátaxis 對照（Context7 驗證）

Diátaxis 是一套系統性的文件作者框架，依兩個維度把文件分成四象限：
- 橫軸：是否引導行動（Action ↔ Cognition）
- 縱軸：學習新技能 vs. 解決當下問題（Study ↔ Work）

| Diátaxis 類型 | 本文件對應類型 | 放置位置 |
|--------------|--------------|---------|
| Tutorial（學習導向）| 範例型（Example） | `docs/examples` |
| How-to Guide（任務導向） | 任務型（Prompt）+ 流程型（內嵌 Skill） | `.github/prompts` / `.github/skills` |
| Reference（資訊查閱）| 結構型（Structure）+ 工具型（Tooling） | `docs/structure` / `docs/tooling` |
| Explanation（理解導向）| 規則型（Instructions）+ 決策型（ADR） | `.github/instructions` / `docs/decisions` |

**使用 Diátaxis 做內容放置決策**（Context7 驗證的判斷流程）：

1. 問：這份文件引導行動還是提供理解？
2. 問：讀者是在學習還是在工作？
3. 交叉結果即為對應象限，從上表找到放置位置。

> **Anti-pattern**：不要讓同一份文件同時服務多個象限。如果發現一份文件又是 Tutorial 又是 Reference，拆成兩份。

