# Notion

知識內容生命週期主域

## Bounded Context

| Aspect | Description |
|--------|-------------|
| Primary role | 正典知識內容生命週期（頁面、文章、資料庫、協作、版本） |
| Upstream | platform（治理、AI capability）、workspace（workspaceId、membership scope、share scope） |
| Downstream | notebooklm（knowledge artifact reference、attachment reference、taxonomy hint） |
| Core principle | notion 擁有正典知識內容，不擁有治理或推理過程 |
| Cross-module boundary | `api/` only — no direct import of platform/workspace/notebooklm internals |

## Ubiquitous Language

| Term | Meaning |
|------|---------|
| KnowledgeArtifact | notion 主域擁有的知識內容總稱 |
| KnowledgePage | 正典頁面型知識單位（block-based 自由頁面） |
| ContentBlock | 知識頁面的最小可組合內容單位（段落、標題、程式碼等） |
| KnowledgeCollection | 頁面集合容器（分組 KnowledgePage，非 Database） |
| BacklinkIndex | 自動反向連結索引（哪些頁面引用了此頁面） |
| Article | 經過撰寫與驗證工作流程的知識庫文章 |
| Database | 結構化知識集合（可投影多種視圖） |
| DatabaseView | 對 Database 的投影配置（Table/Board/Calendar/Gallery/Form） |
| DatabaseRecord | Database 中的一筆記錄 |
| Taxonomy | 跨頁面的分類法與語義組織結構 |
| Relation | 內容對內容之間的正式語義關聯（有類型、有方向） |
| Publication | 對外可見且可交付的內容狀態 |
| VersionSnapshot | 全域版本 checkpoint 策略的不可變快照（≠ 逐次編輯 Version） |
| Template | 可重複套用的內容結構起點 |
| Attachment | 綁定於知識內容的檔案或媒體 |

## Implementation Structure

```text
modules/notion/
├── api/              # Public API boundary — cross-module entry point only
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts (events, published-language)
├── infrastructure/   # Context-wide driven adapters, grouped by subdomain when needed
├── interfaces/       # Context-wide driving adapters, grouped by subdomain when needed
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── knowledge/             # Tier 1 — Active (KnowledgePage, ContentBlock)
    ├── authoring/             # Tier 1 — Active (Article, Category)
    ├── collaboration/         # Tier 1 — Active (Comment, Permission, Version)
    ├── database/              # Tier 1 — Active (Database, Record, View)
    ├── taxonomy/              # Tier 2 — Domain contracts (semantic classification)
    ├── relations/             # Tier 2 — Domain contracts (explicit semantic graph)
    ├── attachments/           # Tier 2 — Stub (file/media association)
    ├── publishing/            # Tier 3 — Stub (external delivery boundary)
    ├── knowledge-versioning/  # Tier 3 — Stub (global snapshot policy)
    ├── notes/                 # Premature — absorbed by KnowledgePage
    ├── templates/             # Premature — absorbed by authoring
    ├── automation/            # Premature — absorbed by database
    ├── knowledge-analytics/   # Premature — read model concern
    └── knowledge-integration/ # Premature — infrastructure adapter concern
```

> **Premature stubs** — `notes/`, `templates/`, `automation/`, `knowledge-analytics/`, `knowledge-integration/` 目錄存在但不建議擴充。見 [Premature Stubs](#premature-stubs) 段落。

## Subdomains

### Tier 1 — Core (Active)

| Subdomain | Purpose | Key Aggregates / Entities |
|-----------|---------|--------------------------|
| knowledge | KnowledgePage 生命週期、ContentBlock 編輯、BacklinkIndex、版本查詢 | KnowledgePage, ContentBlock, KnowledgeCollection, BacklinkIndex |
| authoring | 知識庫文章建立、驗證工作流程與分類目錄 | Article, Category |
| collaboration | 協作留言、細粒度權限與版本快照（逐次編輯歷史） | Comment, Permission, Version |
| database | 結構化資料視圖（Table/Board/Calendar/Gallery/Form）、記錄、自動化 | Database, DatabaseRecord, View, DatabaseAutomation |

### Tier 2 — Near-Term (Domain Contracts — High Business Value)

| Subdomain | Purpose | Distinction |
|-----------|---------|------------|
| taxonomy | 跨頁面分類法與語義組織（全域標籤樹、主題分類） | ≠ authoring.Category（局部文章分類）；taxonomy 是全域語義網 |
| relations | 內容對內容的明確語義關聯（有類型、方向） | ≠ knowledge.BacklinkIndex（自動反向連結）；relations 是主動宣告的語義圖 |
| attachments | 附件與媒體關聯儲存（Storage 整合正典邊界） | 獨立於知識頁面內容模型。待附件需要獨立保留策略時充實 |

### Tier 3 — Medium-Term (Stubs)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| publishing | 正式對外交付的 Publication 狀態邊界 | authoring 的 `ArticlePublicationUseCases` 是前置邊界 |
| knowledge-versioning | 全域版本 checkpoint 策略（workspace-level, 保留政策） | ≠ collaboration.Version（per-edit 歷史）；是策略量，不是操作量 |

### Premature Stubs（目錄保留，不建議擴充）

| Subdomain | Reason |
|-----------|--------|
| notes | 輕量筆記可作為 KnowledgePage 的頁面類型處理，不需獨立子域 |
| templates | 頁面範本是 authoring 的內部關注（內容結構起點），非獨立子域 |
| automation | database 子域已涵蓋 DatabaseAutomation；跨內容類型事件自動化目前無獨立領域需求 |
| knowledge-analytics | 知識使用行為量測是讀模型關注，非獨立領域模型。可由 infrastructure 查詢層處理 |
| knowledge-integration | 外部系統整合是 infrastructure adapter 關注，非獨立子域 |

## Subdomain Analysis

**14 個目錄（4 Active + 2 Domain Contracts + 1 Stub + 2 Medium-Term + 5 Premature），分析如下：**

- ✅ `knowledge` 與 `authoring` 分工正確：自由頁面（block-based wiki）vs. 結構化文章（KB article workflow）。
- ✅ `collaboration.Version`（逐次編輯快照）與 `knowledge-versioning`（全域 checkpoint 策略）是不同責任，分開正確。
- ✅ `knowledge.BacklinkIndex`（自動反向索引）與 `relations`（明確語義圖）不重疊。
- ✅ `taxonomy` 是全域語義組織核心，與 `authoring.Category`（局部文章分類）不重疊，維持 Tier 2。
- ✅ 5 個 premature stubs 有明確理由：每個都已被現有 active 子域或 infrastructure 層吸收。
- ⚠️ `knowledge-versioning` 需持續明確與 `collaboration.Version` 的分界，避免實作者混淆。

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- `domain/` must not import infrastructure, interfaces, React, Firebase SDK, or any runtime framework.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/notion/README.md)
- [Subdomains](../../docs/contexts/notion/subdomains.md)
- [Bounded Context](../../docs/contexts/notion/bounded-contexts.md)
- [Context Map](../../docs/contexts/notion/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notion/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
