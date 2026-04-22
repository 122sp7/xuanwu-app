---
name: feature-design
description: 整體功能架構設計總控模板：統整 Domain + Use Case + Adapter + UI State，拆解 feature 至各架構層，決定 Genkit 是否介入，輸出 layered blueprint。
agent: Domain Lead
argument-hint: 提供功能名稱、業務背景、所屬主域（platform / workspace / notion / notebooklm）、已知限制與非目標。
tools: ['serena/*', 'context7/*', 'read', 'search']
---

# Feature Design 功能架構設計總控

## 職責邊界

**負責**
- 將功能需求拆解至 Domain / Application / Infrastructure / Interface 層
- 識別所屬 bounded context 與 subdomain
- 定義 Genkit AI flow 是否介入（是/否/未來）
- 輸出 feature blueprint 與 dependency map
- 定義 non-goals 與邊界假設

**不負責**
- 細節 implementation（由各 implement-* prompt 負責）
- Firebase code 生成
- runtime 實作邏輯

## 輸入

- **功能名稱**：一句話業務描述
- **所屬主域**：platform / workspace / notion / notebooklm
- **業務背景**：為何需要此功能、現有系統狀態
- **已知限制**：技術、時程、依賴等
- **非目標**：明確排除的功能範圍

## 工作流程

1. 讀取 `docs/README.md` → `docs/01-architecture/domain/bounded-contexts.md` → `docs/01-architecture/domain/subdomains.md`，定位所屬 bounded context。
2. 讀取 `docs/01-architecture/domain/ubiquitous-language.md`，確認功能用語是否有既有術語映射。
3. 讀取 `docs/01-architecture/contexts/<context>/context-map.md`，確認上下游依賴關係。
4. 讀取 `.github/instructions/architecture-core.instructions.md` 與 `architecture-runtime.instructions.md`，確認 runtime 邊界。
5. 輸出 feature blueprint（見下方格式）。
6. 若功能涉及 AI capability，標注 `platform.ai` 消費路徑；不允許 notion/notebooklm 自擁 `ai` subdomain。

## 輸出合約

### Feature Blueprint

```
## Feature: <名稱>

### Bounded Context
- 主域：<platform|workspace|notion|notebooklm>
- 子域：<subdomain 名稱>

### Domain Layer
- 新增 / 修改 Aggregates：
- 新增 / 修改 Value Objects：
- 新增 Domain Events：
- 業務不變數（invariants）：

### Application Layer
- Use Cases（verb-noun 格式）：
- Input DTOs：
- Output：CommandResult

### Infrastructure Layer
- Firebase Repositories / Adapters：
- 外部 API Gateways（若有）：

### Interface Layer
- Server Actions：
- UI Components / Hooks：
- Route 位置（src/app/）：

### Genkit AI Flow
- 是否介入：yes / no / future
- 若 yes：flow 名稱、input/output、platform.ai 消費路徑

### Cross-Module Dependencies
- 上游消費（來自哪些模組 index.ts）：
- 下游提供（向哪些模組發布事件或 API）：

### Non-Goals
-

### Open Questions
-
```

## 後續 Prompts 建議順序

1. `domain-modeling` — 若需新建 Aggregate 或 Value Object
2. `use-case-generation` — 實作 Application Layer
3. `firebase-adapter` — 實作 Infrastructure Layer
4. `implement-server-action` — 實作 Interface Layer
5. `implement-uiomponent` — 實作 UI

Tags: #use skill context7 #use skill serena-mcp #use skill repomix #use skill xuanwu-skill
#use skill hexagonal-ddd
#use skill alistair-cockburn
#use skill occams-razor
