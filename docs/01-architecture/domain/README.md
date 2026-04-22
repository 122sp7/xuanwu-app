# Domain Layer

## PURPOSE

領域層定義統一語言、bounded context 所有權、子域邊界、DDD 戰略設計。是系統邊界決策的權威，避免實作層把戰略語言污染。

## KEY CONCEPTS

### Ubiquitous Language

業務中使用的共同詞彙表，確保代碼與業務溝通一致。規則：
- 一個詞對應一個含義
- 命名優先於程式碼結構
- 同一詞在不同 context 可有不同含義，但需顯式映射

### Bounded Context

邊界內語言與規則保持自洽。8 個主域（iam、billing、ai、analytics、platform、workspace、notion、notebooklm）各為一個 bounded context。

### Subdomain

業務能力的微細拆分。每個 context 包含多個 subdomain，例如：
- **iam** 包含：identity、access-control、tenant、account、organization、authorization、session、authentication...
- **billing** 包含：billing、subscription、entitlement、referral、usage-metering...
- **ai** 包含：generation、retrieval、pipeline、tool-calling、safety、memory、context、embedding...

### Ownership Rules

每個能力恰好屬於一個 context，不允許多個 context 同時宣稱。解決規則：
- Actor / Identity / Tenant / Access Decision → **iam**
- Subscription / Entitlement / Referral → **billing**
- Shared AI capability → **ai**
- 報表 / 下游 projection → **analytics**
- 正典知識內容 → **notion**
- 推理輸出 → **notebooklm**
- 協作容器 → **workspace**
- 營運服務 → **platform**

### Conflict Resolution

當同一語言在多個 context 爭奪所有權時，優先考量：
- 語言自洽性（是否破壞某 context 的語言完整性）
- context map 方向（是否導致反向依賴）
- 業務核心性（誰最核心地擁有這個能力）

## BASELINE RESPONSIBILITIES

### 1. Bounded Contexts
8 個主域定義、所有權規則、conflict resolution、forbidden moves。

### 2. Subdomains
業務能力清單（baseline + recommended gap）、微細拆分準則。

### 3. Ubiquitous Language
術語表、命名規則、避免詞彙、identifier contract（accountId、workspaceId、userId 等）、copilot generation rules。

### 4. Context Map Template
新 context 設計時的關係範本、upstream/downstream、published language token。

### 5. Bounded Context & Subdomain Template
新 context 或 subdomain 的骨架模板、hexagonal layer 結構、開發順序合約。

### 6. DDD Strategic Design
DDD 概念速查表、aggregate 設計、value object、domain event、repository、domain service、反模式。

## RECOMMENDED GAP CONCEPTS

- **Shared Kernel** 與 **Partnership** 關係（目前只用 ACL / Conformist）
- **Event Storming** 工作流（需要時補充）
- **Aggregate Boundary** 設計深化（目前在 template 中）

## DOCUMENTATION

所有領域層文件列表與快速連結：

1. [bounded-contexts.md](./bounded-contexts.md)
2. [subdomains.md](./subdomains.md)
3. [ubiquitous-language.md](./ubiquitous-language.md)
4. [context-map.template.md](./context-map.template.md) （若存在）
5. [bounded-context-subdomain-template.md](./bounded-context-subdomain-template.md)
6. [ddd-strategic-design.md](./ddd-strategic-design.md) （若存在）

## USABILITY

- **命名衝突檢查** 可在 2 分鐘內查詢 ubiquitous-language.md
- **所有權確認** 可在 3 分鐘內查詢 bounded-contexts.md
- **新 context 設計** 可在 5 分鐘內複製骨架模板 + context map 範本
- **DDD 概念複習** 可在 3 分鐘內查詢 ddd-strategic-design.md

## QUICK LINKS

- [docs/01-architecture/system/AGENTS.md](../AGENTS.md) — 系統層（架構決策）
- [docs/README.md](../../README.md) — 文檔入口
- [docs/01-architecture/contexts/](../contexts/) — 各 context 本地文件（8 個 context）
- [.github/instructions/docs-authority-and-language.instructions.md](../../../.github/instructions/docs-authority-and-language.instructions.md) — 文檔權威與命名規則
