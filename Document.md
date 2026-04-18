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

---

# 九、完整檔案樹與設計決策

> 本節為 Xuanwu App 現況 `.github/` 檔案的完整清單與每個檔案的**類型標記、保留/合併/搬移決策**。
> 實作順序：先依本節決定搬移 → 再依決策合併 → 最後補齊缺失。

## 符號說明

| 符號 | 意義 |
|------|------|
| ✅ | 保留，格式正確，位置正確 |
| ⚠️ STRIP | agent 內嵌規則/程序，須提取至 instructions 或 skill SKILL.md |
| ⚠️ MERGE | 語意重疊，合併至目標檔案（STRIP 後再 MERGE）|
| ❌ MOVE | 類型錯置，搬移至正確位置 |
| ❌ DUPLICATE | persona YAML 重複，刪除多餘副本 |
| 🔢 | 建議加上 `applyTo` 精確化 |

---

## `.github/agents/`（編排型 — 持久 persona + handoffs）

> **命名規範**：`<role>.agent.md`（kebab-case，role 為職責動詞-名詞）
> **格式守則**：必須含 YAML frontmatter `name`、`description`、`tools`；agent 本體只組裝，不寫規則。

```txt
.github/agents/

  # ── AI / Genkit 域 ──────────────────────────────────────────
  ai-genkit-lead.agent.md          ✅  Genkit AI 流程主責（唯一 Genkit agent）
  # genkit-flow.agent.md           已合併 → ai-genkit-lead（循環 handoff 異味，已刪除）
  # genkit-orchestrator.agent.md   已 STRIP + MERGE → ai-genkit-lead（已刪除）

  # ── 架構 / DDD 域 ────────────────────────────────────────────
  hexagonal-ddd-architect.agent.md ✅  Hexagonal DDD 設計主責
  hexagonal-convergence-enforcer.agent.md
                                   ✅  架構收斂主責（操作程序已 STRIP → context7/repomix/serena-mcp SKILL.md）
  domain-architect.agent.md        ✅  Domain modeling 主責（審查清單屬可接受的 compositional guide）
  # architecture-enforcer.agent.md 已 STRIP + MERGE → hexagonal-convergence-enforcer（已刪除）
  # domain-enforcer.agent.md       已 STRIP + MERGE → hexagonal-convergence-enforcer（已刪除）
  # domain-lead.agent.md           已 MERGE → domain-architect（角色語意重疊，已刪除）

  # ── Frontend 域 ──────────────────────────────────────────────
  app-router.agent.md              ✅  Next.js App Router 專責
  frontend-lead.agent.md           ✅  前端技術主責
  shadcn-composer.agent.md         ✅  shadcn/UI 組裝專責
  state-management.agent.md        ⚠️ STRIP  Decision Rule 表格（逐字複製 state-management.instructions.md）
                                        + 6條 Guardrails（含命名規則）→ state-management.instructions.md

  # ── Firebase / 資料層 ─────────────────────────────────────────
  firebase-guardian.agent.md       ⚠️ STRIP  內嵌規則：
                                        ↳ 核心防線 5條 Hard Rules → firestore-schema.instructions.md
                                        ↳ 審查清單 3節 → security-rules.instructions.md
  firestore-schema.agent.md        ✅  Firestore schema 設計
  schema-migration.agent.md        ✅  schema 遷移專責

  # ── RAG / 知識管線 ────────────────────────────────────────────
  rag-lead.agent.md                ✅  RAG 系統整體主責
  chunk-strategist.agent.md        ✅  chunking 策略（RAG 子域專責）
  embedding-writer.agent.md        ✅  embedding 實作（RAG 子域專責）
  doc-ingest.agent.md              ✅  document ingestion 流程

  # ── 知識庫管理 ────────────────────────────────────────────────
  kb-architect.agent.md            ✅  knowledge base 架構設計

  # ── 品質 / 測試 ───────────────────────────────────────────────
  quality-lead.agent.md            ✅  QA 整體主責
  e2e-qa.agent.md                  ✅  E2E 測試執行
  test-scenario-writer.agent.md    ✅  測試情境設計

  # ── 程式碼產出 ────────────────────────────────────────────────
  server-action-writer.agent.md    ✅  Server Action 實作
  ts-interface-writer.agent.md     ⚠️ STRIP  scope 引用 src/modules/**/api/** 路徑已不存在
                                        ↳ 改為 src/modules/**/application/dto/** + index.ts boundary
  zod-validator.agent.md           ⚠️ STRIP  Hard Rules + Guardrails（複製 architecture-core.instructions.md Zod section）
  lint-rule-enforcer.agent.md      ✅  ESLint 規則設計

  # ── 安全 / 法規 ───────────────────────────────────────────────
  security-rules.agent.md          ✅  security rules 設計

  # ── 輔助 ──────────────────────────────────────────────────────
  prompt-engineer.agent.md         ✅  prompt 設計主責

  # ── 錯置 / 重複檔案 ─────────────────────────────────────────
  commands.md                      ❌ MOVE  類型錯置：工具型（Tooling），非 agent
                                      ↳ body → docs/tooling/commands-reference.md
  knowledge-base.md                ❌ DUPLICATE + WRONG BODY
                                      ↳ YAML frontmatter = kb-architect.agent.md 的完全副本（name: KB Architect）
                                      ↳ body = 結構型導覽文件（非 agent composition）
                                      ↳ 處置：body → docs/tooling/knowledge-base-reference.md；刪除檔案
```

### agents 作業後目標清單（共 21 個）

> 完成 STRIP + MERGE 後，留下 21 個語意不重疊的 agent。

```txt
ai-genkit-lead          app-router              chunk-strategist
doc-ingest              domain-architect        e2e-qa
embedding-writer        firebase-guardian*      firestore-schema
frontend-lead           hexagonal-convergence-enforcer*
hexagonal-ddd-architect kb-architect            lint-rule-enforcer
prompt-engineer         quality-lead            rag-lead
schema-migration        security-rules          server-action-writer
shadcn-composer         state-management*       test-scenario-writer
ts-interface-writer*    zod-validator*
```

> *標記的 agent 已完成 STRIP；body 已瘦身至純 compositor。
> domain-lead、genkit-flow、genkit-orchestrator、architecture-enforcer、domain-enforcer 已合併刪除。

---

## `.github/instructions/`（規則型 — 自動套用）

> **命名規範**：`<domain>-<aspect>.instructions.md`
> **格式守則**：`applyTo` glob 必須精確；全域規則用 `applyTo: "**"` 但內容只做 routing，不重複業務邏輯。
> **觸發機制**：自動套用（依 `applyTo` glob）；不需手動呼叫。

```txt
.github/instructions/

  # ── 架構層（全域 + 分層）──────────────────────────────────────
  architecture.instructions.md            ✅  相容入口 router；applyTo: "**"（只做 routing）
  architecture-core.instructions.md       ✅  Hexagonal DDD 模組邊界規則；applyTo: src/modules/**
  architecture-runtime.instructions.md    ✅  runtime 分層規則；applyTo: src/app|src/modules|py_fn/**

  # ── DDD 戰略設計 ──────────────────────────────────────────────
  bounded-context-rules.instructions.md   ✅  Bounded Context 設計約束；applyTo: src/modules/**
  subdomain-rules.instructions.md         ✅  子域切分設計約束；applyTo: src/modules/**/subdomains/**
  domain-layer-rules.instructions.md      ✅  Domain 層純度規則；applyTo: src/modules/**/domain/**
  domain-modeling.instructions.md         ✅  DDD 戰術建模（聚合/值對象）；applyTo: src/modules/**/domain/**
  hexagonal-rules.instructions.md         ✅  Hexagonal 端口與適配器規則；applyTo: src/modules/**

  # ── 文件治理 ──────────────────────────────────────────────────
  docs-authority-and-language.instructions.md ✅ 術語命名規則；applyTo: docs/**|src/modules/**

  # ── 流程與交付 ────────────────────────────────────────────────
  process-framework.instructions.md       ✅  分支/commit/Cockburn 交付規則；applyTo: "**"

  # ── Next.js ───────────────────────────────────────────────────
  nextjs-app-router.instructions.md       ✅  App Router 規則；applyTo: src/app/**
  nextjs-parallel-routes.instructions.md  ✅  Parallel Routes 規則；applyTo: src/app/**
  nextjs-server-actions.instructions.md   ✅  Server Actions 規則；applyTo: src/app|src/modules/**

  # ── Firebase / 後端 ───────────────────────────────────────────
  firestore-schema.instructions.md        ✅  Firestore schema 規則；applyTo: src/modules/**/infrastructure/**
  security-rules.instructions.md          ✅  安全規則約束；applyTo: firestore.rules|storage.rules
  cloud-functions.instructions.md         ✅  Cloud Functions 規則；applyTo: py_fn/**
  hosting-deploy.instructions.md          ✅  部署規則；applyTo: apphosting.yaml|firebase.json
  ci-cd.instructions.md                   ✅  CI/CD 規則；applyTo: .github/workflows/**

  # ── AI / Genkit ───────────────────────────────────────────────
  genkit-flow.instructions.md             ✅  Genkit flow 設計規則；applyTo: src/modules/**/infrastructure/**
  embedding-pipeline.instructions.md      ✅  embedding pipeline 規則；applyTo: py_fn/**
  rag-architecture.instructions.md        ✅  RAG 架構規則；applyTo: src/modules/**|py_fn/**
  prompt-engineering.instructions.md      ✅  prompt 設計規則；applyTo: .github/prompts/**

  # ── Frontend ──────────────────────────────────────────────────
  shadcn-ui.instructions.md               ✅  shadcn/UI 規則；applyTo: src/**/*.{ts,tsx}
  tailwind-design-system.instructions.md  ✅  Tailwind 設計規則；applyTo: src/**/*.{ts,tsx}
  state-management.instructions.md        ✅  狀態管理規則；applyTo: src/modules/**/interfaces/**
  event-driven-state.instructions.md      ✅  事件驅動狀態規則；applyTo: src/modules/**

  # ── 測試 ──────────────────────────────────────────────────────
  testing-unit.instructions.md            ✅  單元測試規則；applyTo: src/**/*.{test,spec}.ts
  testing-e2e.instructions.md             ✅  E2E 測試規則；applyTo: src/**/*.{test,spec}.ts
  playwright-mcp-testing.instructions.md  ✅  Playwright MCP 測試規則；applyTo: src/app|src/modules|debug/**

  # ── 格式 ──────────────────────────────────────────────────────
  lint-format.instructions.md             ✅  ESLint / format 規則；applyTo: "**"

  # ── 索引 ──────────────────────────────────────────────────────
  README.md                               ✅  instructions 目錄索引（非 instruction）
```

---

## `.github/prompts/`（任務型 — 手動 slash command）

> **命名規範**：`<action>-<artifact>.prompt.md`
> **格式守則**：只含任務模板，不含 business logic；`tools:` 欄位優先級高於 agent，謹慎設定。
> **觸發機制**：手動（`/prompt-name` slash command）。

```txt
.github/prompts/

  # ── 分析 ──────────────────────────────────────────────────────
  analyze-repo.prompt.md                  ✅

  # ── DDD 領域建模 ──────────────────────────────────────────────
  domain-modeling.prompt.md               ✅
  generate-aggregate.prompt.md            ✅
  generate-domain-event.prompt.md         ✅
  generate-value-object.prompt.md         ✅
  use-case-generation.prompt.md           ✅

  # ── 計畫 ──────────────────────────────────────────────────────
  plan-feature.prompt.md                  ✅
  plan-module.prompt.md                   ✅
  plan-api.prompt.md                      ✅
  feature-design.prompt.md                ✅

  # ── 實作 ──────────────────────────────────────────────────────
  implement-feature.prompt.md             ✅
  implement-firestore-schema.prompt.md    ✅
  implement-genkit-flow.prompt.md         ✅
  implement-security-rules.prompt.md      ✅
  implement-server-action.prompt.md       ✅
  implement-state-machine.prompt.md       ✅
  implement-ui-component.prompt.md        ✅
  implement-zustand-store.prompt.md       ✅
  firebase-adapter.prompt.md              ✅

  # ── 重構 ──────────────────────────────────────────────────────
  refactor-module.prompt.md               ✅
  refactor-api.prompt.md                  ✅
  enforce-hexagonal-ddd-convergence.prompt.md ✅
  serena-hexagonal-ddd-refactor.prompt.md ✅

  # ── 審查 ──────────────────────────────────────────────────────
  review-architecture.prompt.md           ✅
  review-code.prompt.md                   ✅
  review-performance.prompt.md            ✅
  review-security.prompt.md               ✅

  # ── RAG / 知識管線 ────────────────────────────────────────────
  ingest-docs.prompt.md                   ✅
  chunk-docs.prompt.md                    ✅
  embedding-docs.prompt.md                ✅

  # ── 測試 ──────────────────────────────────────────────────────
  write-tests.prompt.md                   ✅
  write-e2e-tests.prompt.md               ✅
  playwright-mcp-inspect.prompt.md        ✅
  playwright-mcp-test.prompt.md           ✅

  # ── 文件 / 除錯 ───────────────────────────────────────────────
  write-docs.prompt.md                    ✅
  debug-error.prompt.md                   ✅

  # ── 索引 ──────────────────────────────────────────────────────
  README.md                               ✅  prompts 目錄索引（非 prompt）
```

---

## `.github/skills/`（能力型 + Codebase Reference 型）

> **Sub-type A — 能力型（Capability Skill）**：教 agent 如何執行特定能力；含流程、判斷規則、範例。手動 load。
> **Sub-type B — Codebase Reference（repomix 生成）**：代碼索引供查閱；非能力文件。手動 load 作代碼搜尋。
> **命名規範**：`<capability>/SKILL.md`（A 型）、`xuanwu-<context>-skill/SKILL.md`（B 型）
> **地雷**：`browser-use` 與 `agent-browser` 語意重疊，合併為 `agent-browser`。

```txt
.github/skills/

  # ── Sub-type A：能力型 Skill ──────────────────────────────────

  # 架構方法論
  hexagonal-ddd/                   ✅  Hexagonal DDD 設計工作流
  alistair-cockburn/               ✅  Cockburn 用例 + 交付循環方法論
  occams-razor/                    ✅  奧卡姆剃刀決策方法論

  # AI / 工具驗證
  context7/                        ✅  官方文件驗證層（必載）
  serena-mcp/                      ✅  Serena MCP 會話記憶工作流（必載）
  repomix/                         ✅  Repomix repo 探索工作流（必載）
  genkit-ai/                       ✅  Genkit AI 流程設計能力
  zod-validation/                  ✅  Zod validation 三層設計工作流
  zustand-xstate/                  ✅  狀態管理選型與設計工作流
  firebase-rules/                  ✅  Firebase 架構治理工作流

  # Frontend / UI
  shadcn/                          ✅  shadcn/UI 組裝能力（必載）
  frontend-design/                 ✅  前端設計能力
  app-router-parallel-routes/      ✅  Parallel Routes 組裝能力
  vercel-composition-patterns/     ✅  Vercel 組合模式參考
  vercel-react-best-practices/     ✅  React 效能最佳實踐
  web-design-guidelines/           ✅  Web UI 設計準則審查

  # 測試 / 瀏覽器
  playwright-mcp-testing/          ✅  Playwright MCP 測試執行能力
  agent-browser/                   ✅  瀏覽器自動化能力（合併 browser-use）
  browser-use/                     ⚠️ MERGE → agent-browser  功能完全重疊

  # 部署 / 工具
  deploy-to-vercel/                ✅  Vercel 部署工作流
  next-devtools-mcp/               ✅  Next.js DevTools MCP 工作流
  find-skills/                     ✅  skill 探索與安裝能力
  sleek-design-mobile-apps/        ✅  行動裝置 UI 設計能力

  # 記憶 / 提交
  agent-memory/                    ✅  跨會話記憶管理能力
  contextual-commit/               ✅  情境化 commit 撰寫能力

  # ── Sub-type B：Codebase Reference（repomix 生成）─────────────
  # 用途：代碼索引查閱，非流程能力；由 repomix 腳本自動更新
  # 命名規範：xuanwu-<context>-skill/

  xuanwu-skill/                    ✅  全域 codebase reference（完整）
  xuanwu-src-skill/                ✅  src/ 代碼索引
  xuanwu-app-skill/                ✅  src/app/ 代碼索引
  xuanwu-ai-skill/                 ✅  ai module 代碼索引
  xuanwu-analytics-skill/          ✅  analytics module 代碼索引
  xuanwu-billing-skill/            ✅  billing module 代碼索引
  xuanwu-iam-skill/                ✅  iam module 代碼索引
  xuanwu-notebooklm-skill/         ✅  notebooklm module 代碼索引
  xuanwu-notion-skill/             ✅  notion module 代碼索引
  xuanwu-packages-skill/           ✅  packages/ 代碼索引
  xuanwu-platform-skill/           ✅  platform module 代碼索引
  xuanwu-py_fn-skill/              ✅  py_fn/ 代碼索引
  xuanwu-workspace-skill/          ✅  workspace module 代碼索引
  xuanwu-markdown-skill/           ✅  markdown 相關代碼索引
```

---

## 實作清單（Action Items）

### 🔴 必做：搬移 / 刪除錯置檔案

| 原路徑 | 處置 | 原因 |
|--------|------|------|
| `.github/agents/commands.md` | body → `docs/tooling/commands-reference.md` | 工具型文件，非 agent |
| `.github/agents/knowledge-base.md` | body → `docs/tooling/knowledge-base-reference.md`；刪除原檔 | persona 與 kb-architect 完全重複；body 是結構型而非 agent |

### 🔴 必做：提取 agent 內嵌規則（STRIP — 解除類型污染）

> 規則/程序屬於 instructions 或 skill SKILL.md，不應存在於 agent body。

| Agent | 須提取內容 | 目標位置 |
|-------|-----------|--------|
| `hexagonal-convergence-enforcer.agent.md` | Context7 Certainty Gate、Repomix Source Policy、Serena Troubleshooting | 各 skill 的 SKILL.md |
| `genkit-orchestrator.agent.md` | 6條 Hard Rules + AI Flow 審查清單 | `genkit-flow.instructions.md` |
| `architecture-enforcer.agent.md` | 4節審查清單（Dependency Direction、Import Boundary 等） | `architecture-core.instructions.md` |
| `domain-enforcer.agent.md` | 8條 Hard Violations（含具體 import 路徑）| `domain-layer-rules.instructions.md` |
| `firebase-guardian.agent.md` | 5條 Hard Rules + 3節審查清單 | `firestore-schema.instructions.md` + `security-rules.instructions.md` |
| `state-management.agent.md` | Decision Rule 表格（與 instructions 逐字重複）+ 6條 Guardrails | `state-management.instructions.md` |
| `zod-validator.agent.md` | Hard Rules + Guardrails（與 architecture-core Zod section 重複）| `architecture-core.instructions.md` |
| `ts-interface-writer.agent.md` | scope 路徑 `src/modules/**/api/**`（路徑不存在）| 修正為 `src/modules/**/application/dto/**` |

### 🟡 建議：合併語意重疊 agents（STRIP 完成後執行）

| 被合併（刪除） | 合併目標 | 重疊理由 |
|-------------|---------|---------|
| `genkit-flow.agent.md` | `ai-genkit-lead.agent.md` | 語意完全覆蓋 + 循環 handoff 異味 |
| `genkit-orchestrator.agent.md` | `ai-genkit-lead.agent.md` | STRIP 後剩薄殼，Genkit 流程職責完全涵蓋 |
| `architecture-enforcer.agent.md` | `hexagonal-convergence-enforcer.agent.md` | STRIP 後剩薄殼，架構強制職責完全涵蓋 |
| `domain-enforcer.agent.md` | `hexagonal-convergence-enforcer.agent.md` | STRIP 後剩薄殼，邊界強制職責完全涵蓋 |
| `domain-lead.agent.md` | `domain-architect.agent.md` | domain 設計主責完全涵蓋 |

### 🟡 建議：合併語意重疊 skills

| 被合併（刪除） | 合併目標 | 重疊理由 |
|-------------|---------|---------|
| `browser-use/` | `agent-browser/` | 瀏覽器自動化能力完全重疊 |

### 🟢 補強：instructions applyTo 精確化

以下 instructions 建議從 `applyTo: "**"` 改為精確 glob，避免全域噪音：

| 檔案 | 建議 applyTo |
|------|------------|
| `lint-format.instructions.md` | `**/*.{ts,tsx,js,jsx,mjs}` |
| `process-framework.instructions.md` | `**/*`（可保留，內容是 process，不是 code rules） |

