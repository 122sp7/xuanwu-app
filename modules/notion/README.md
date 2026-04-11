# Notion

知識內容生命週期主域

## Implementation Structure

```text
modules/notion/
├── api/              # Public API boundary
├── application/      # Context-wide orchestration
├── domain/           # Context-wide domain concepts
├── infrastructure/   # Context-wide driven adapters
├── interfaces/       # Context-wide driving adapters
├── docs/             # Links to strategic documentation
└── subdomains/
    ├── authoring/        # Active
    ├── collaboration/    # Active
    ├── database/         # Active
    ├── knowledge/        # Active
    ├── taxonomy/         # Planned (Stub)
    ├── publishing/       # Planned (Stub)
    └── attachments/      # Planned (Stub)
```

> **Premature stubs** — The following directories exist but are not recommended for expansion. They represent aspirational splits whose responsibilities are already covered by active subdomains or are infrastructure/read-model concerns:
> `automation/`, `knowledge-analytics/`, `knowledge-integration/`, `knowledge-versioning/`, `notes/`, `relations/`, `templates/`.
> See [Premature Stubs](#premature-stubs已存在目錄但不建議擴充) for details.

## Subdomains

### Active

| Subdomain | Purpose | Key Aggregates / Entities |
|-----------|---------|---------------------------|
| knowledge | 頁面建立、組織、版本化與交付；內容區塊編輯；反向連結索引 | KnowledgePage, KnowledgeCollection, ContentBlock, BacklinkIndex |
| authoring | 知識庫文章建立、驗證、分類與發布狀態管理 | Article, Category |
| collaboration | 協作留言、細粒度權限與版本快照 | Comment, Permission, Version |
| database | 結構化資料多視圖管理、記錄操作與自動化 | Database, DatabaseRecord, View, DatabaseAutomation |

### Planned

| Subdomain | Purpose | Split Trigger |
|-----------|---------|---------------|
| taxonomy | 進階分類法與語義組織（超越 Category 的語義樹、主題治理） | Category 模型無法承載語義分類需求 |
| publishing | 跨內容類型的正式發布流程與對外交付邊界 | 發布工作流需要跨 authoring 與 knowledge 統一管理 |
| attachments | 附件與媒體的獨立生命週期管理 | 附件需要獨立於頁面的保留策略或版本管理 |

### Premature Stubs（已存在目錄但不建議擴充）

| Subdomain | Reason |
|-----------|--------|
| automation | database 子域已涵蓋 DatabaseAutomation 聚合根與 AutomationUseCases；知識層級自動化是跨切關注，非獨立子域 |
| knowledge-analytics | 知識使用行為量測是讀模型關注，非獨立領域模型。可由 infrastructure 查詢層處理 |
| knowledge-integration | 外部系統整合是 infrastructure adapter 關注，非獨立子域 |
| knowledge-versioning | collaboration 子域已涵蓋 Version 聚合根與 VersionUseCases，職責重複 |
| notes | 輕量筆記可作為 KnowledgePage 的頁面類型處理，不需獨立子域 |
| relations | knowledge 子域已涵蓋 BacklinkIndex 聚合根與 BacklinkExtractorService，關聯功能已實現 |
| templates | 頁面範本是 authoring 的內部關注（內容結構起點），非獨立子域 |

## Bounded Contexts

| Cluster | Subdomains | Responsibility |
|---------|------------|----------------|
| Content Core | knowledge, authoring | 知識頁面與文章生命週期、分類、內容區塊 |
| Collaboration & Change | collaboration | 協作留言、細粒度權限與版本快照 |
| Structured Data | database | 結構化資料多視圖管理與自動化 |
| Future Extensions | taxonomy, publishing, attachments | 進階分類法、正式發布流程、附件管理 |

### Domain Invariants

- 知識內容的正典狀態屬於 notion。
- taxonomy 應獨立於具體 UI 視圖存在（目前由 Category 承載）。
- BacklinkIndex 描述內容對內容的語義關係。
- platform.ai 可被 notion use case 消費，但 AI provider / policy ownership 不屬於 notion。
- publishing 只交付已被 notion 吸收的內容狀態（目前由 authoring 承載）。
- 任何來自 notebooklm 的輸出，若要成為正典內容，必須先被 notion 吸收。

## Ubiquitous Language

| Term | Meaning | Owning Subdomain |
|------|---------|------------------|
| KnowledgeArtifact | notion 主域擁有的知識內容總稱 | （跨子域概念） |
| KnowledgePage | 正典頁面型知識單位 | knowledge |
| KnowledgeCollection | 頁面的組織集合 | knowledge |
| ContentBlock | 頁面內的結構化內容區塊 | knowledge |
| BacklinkIndex | 頁面間反向連結的索引 | knowledge |
| PageStatus | 頁面生命週期狀態（draft, published, archived） | knowledge |
| ApprovalState | 頁面審核狀態 | knowledge |
| VerificationState | 頁面驗證狀態 | knowledge |
| BlockContent | 區塊的實際內容值（text, heading, list, code, etc.） | knowledge |
| Article | 經過撰寫與驗證流程的知識內容 | authoring |
| Category | 文章分類樹結構 | authoring |
| Comment | 內容附著的協作討論 | collaboration |
| Permission | 內容的細粒度存取權限 | collaboration |
| Version | 內容某一時點的不可變快照 | collaboration |
| Database | 結構化知識集合 | database |
| DatabaseRecord | Database 中的單筆記錄 | database |
| View (DatabaseView) | 對 Database 的投影與檢視配置 | database |
| DatabaseAutomation | Database 事件觸發的自動化動作 | database |
| Taxonomy | 標籤、分類法、主題樹等語義組織結構 | taxonomy（未來） |
| Publication | 對外可見且可交付的內容狀態 | publishing（未來） |
| Attachment | 綁定於知識內容的檔案或媒體 | attachments（未來） |
| Template | 可重複套用的內容結構起點 | authoring |

### Language Rules

- 使用 KnowledgeArtifact、KnowledgePage、Article、Database 區分內容型別。
- 使用 Category 表示文章分類，進階語義分類使用 Taxonomy。
- 使用 BacklinkIndex 表示頁面間關聯，正式語義關係使用 Relation。
- 使用 Publication 表示正式對外內容狀態，不用 Publish Action 取代整個交付語言。
- 來自 notebooklm 的內容若未被 notion 吸收，不應直接稱為 KnowledgeArtifact。

### Avoid

| Avoid | Use Instead |
|-------|-------------|
| Wiki | KnowledgePage 或 Article |
| Table | Database 或 DatabaseView |
| Tag System | Category（現有）或 Taxonomy（未來） |
| Content Link | BacklinkIndex（現有）或 Relation（未來） |
| Publish Action | Publication 或 ArticlePublication |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
```

- `api/` is the only cross-module public boundary.
- Domain must not import infrastructure, interfaces, or external frameworks.
- Cross-module collaboration goes through `api/` only.

## Strategic Documentation

- [Context README](../../docs/contexts/notion/README.md)
- [Subdomains](../../docs/contexts/notion/subdomains.md)
- [Context Map](../../docs/contexts/notion/context-map.md)
- [Ubiquitous Language](../../docs/contexts/notion/ubiquitous-language.md)
- [Bounded Context Template](../../docs/bounded-context-subdomain-template.md)
