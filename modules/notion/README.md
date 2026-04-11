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
├── application/      # Context-wide orchestration (empty, use subdomain layers)
├── domain/           # Context-wide domain concepts (empty, use subdomain layers)
├── infrastructure/   # Context-wide driven adapters (empty, use subdomain layers)
├── interfaces/       # Context-wide driving adapters (empty, use subdomain layers)
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── knowledge/            # Tier 1 — Active (KnowledgePage, ContentBlock)
    ├── authoring/            # Tier 1 — Active (Article, Category)
    ├── collaboration/        # Tier 1 — Active (Comment, Permission, Version)
    ├── database/             # Tier 1 — Active (Database, Record, View)
    ├── taxonomy/             # Tier 2 — Stub (semantic classification)
    ├── relations/            # Tier 2 — Stub (explicit semantic graph)
    ├── templates/            # Tier 2 — Stub (reusable content structures)
    ├── attachments/          # Tier 2 — Stub (file/media association)
    ├── publishing/           # Tier 3 — Stub (external delivery boundary)
    ├── notes/                # Tier 3 — Stub (lightweight personal notes)
    ├── knowledge-versioning/ # Tier 3 — Stub (global snapshot policy)
    ├── automation/           # Tier 4 — Stub (cross-content event rules)
    ├── knowledge-analytics/  # Tier 4 — Stub (content usage measurement)
    └── knowledge-integration/ # Tier 4 — Stub (external system sync)
```

## Subdomains

### Tier 1 — Core (Active)

| Subdomain | Purpose | Key Aggregates / Entities |
|-----------|---------|--------------------------|
| knowledge | KnowledgePage 生命週期、ContentBlock 編輯、BacklinkIndex、版本查詢 | KnowledgePage, ContentBlock, KnowledgeCollection, BacklinkIndex |
| authoring | 知識庫文章建立、驗證工作流程與分類目錄 | Article, Category |
| collaboration | 協作留言、細粒度權限與版本快照（逐次編輯歷史） | Comment, Permission, Version |
| database | 結構化資料視圖（Table/Board/Calendar/Gallery/Form）、記錄、自動化 | Database, DatabaseRecord, View, DatabaseAutomation |

### Tier 2 — Near-Term (Stubs — High Business Value)

| Subdomain | Purpose | Distinction |
|-----------|---------|------------|
| taxonomy | 跨頁面分類法與語義組織（全域標籤樹、主題分類） | ≠ authoring.Category（局部文章分類）；taxonomy 是全域語義網 |
| relations | 內容對內容的明確語義關聯（有類型、方向） | ≠ knowledge.BacklinkIndex（自動反向連結）；relations 是主動宣告的語義圖 |
| templates | 頁面範本管理與套用、範本庫 | 加速建立標準化知識結構 |
| attachments | 附件與媒體關聯儲存（Storage 整合正典邊界） | 獨立於知識頁面內容模型 |

### Tier 3 — Medium-Term (Stubs)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| publishing | 正式對外交付的 Publication 狀態邊界 | authoring 的 `ArticlePublicationUseCases` 是過渡邊界 |
| notes | 個人輕量筆記（低儀式、快速捕捉，≠ KnowledgePage） | 獨立於正式 Article 與 KnowledgePage 工作流程 |
| knowledge-versioning | 全域版本 checkpoint 策略（workspace-level, 保留政策） | ≠ collaboration.Version（per-edit 歷史）；是策略量，不是操作量 |

### Tier 4 — Deferred (Stubs)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| automation | 跨內容類型的知識事件觸發規則 | ≠ database.DatabaseAutomation（資料庫局部規則）；automation 是 cross-content event rules |
| knowledge-analytics | 知識使用行為量測（頁面閱讀、搜尋詞） | 消費 platform.analytics 介面 |
| knowledge-integration | 知識與外部系統雙向同步 | 消費 platform.integration 介面 |

## Subdomain Analysis

**14 個子域（4 Active + 10 Stubs），分析如下：**

- ✅ `knowledge` 與 `authoring` 分工正確：自由頁面（block-based wiki）vs. 結構化文章（KB article workflow）。
- ✅ `collaboration.Version`（逐次編輯快照）與 `knowledge-versioning`（全域 checkpoint 策略）是不同責任，分開正確。
- ✅ `database.DatabaseAutomation`（資料庫局部）與 `automation`（跨內容事件）不重疊。
- ✅ `knowledge.BacklinkIndex`（自動反向索引）與 `relations`（明確語義圖）不重疊。
- ✅ 無子域需要刪除：每個有清楚邊界責任。
- ⚠️ **`taxonomy` 應提升優先度**：全域語義組織是 Notion-style 系統的核心，但 `authoring.Category` 僅覆蓋 KB 文章局部分類，不等於全域 taxonomy。應從 Gap Stub 提升到 Tier 2 Near-Term。
- ⚠️ `knowledge-versioning` 需要明確說明與 `collaboration.Version` 的分界，避免實作者混淆。

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
