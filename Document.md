可組合 + 可替換 + 不產生語意重疊。
規則型（Rules / Constraints）
流程型（Process / Flow）
能力型（Capability / Skill）
任務型（Task Template / Prompt）
結構型（Structure / Topology）
決策型（Decision / ADR）
範例型（Example / Reference）
工具型（Tooling Documentation）

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

docs/
  structure/
  decisions/
  examples/
  tooling/

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

### 📌 結構

```md
# ADR-001

## Context
## Decision
## Consequences
```

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
