# Notion Agent

> Strategic agent documentation: [docs/contexts/notion/AGENT.md](../../docs/contexts/notion/AGENT.md)

## Mission

保護 notion 主域作為知識內容生命週期邊界。notion 擁有正式知識內容（KnowledgePage、Article、Database），不擁有治理、工作區範疇或推理輸出。任何變更都應維持 notion 擁有內容建立、結構化、協作、版本化與交付語言。

## Bounded Context Summary

| Aspect | Description |
|--------|-------------|
| Primary role | 正典知識內容生命週期 |
| Upstream | platform（治理、AI capability）、workspace（workspaceId、membership scope、share scope） |
| Downstream | notebooklm（knowledge artifact reference、attachment reference、taxonomy hint） |
| Core invariant | notion 只能修改自己的正典內容，不可直接呼叫 notebooklm 的推理流程 |
| Published language | KnowledgeArtifact reference、attachment reference、taxonomy hint |

## Bounded Contexts

| Cluster | Subdomains | Responsibility |
|---------|------------|----------------|
| Content Core | knowledge, authoring | 知識頁面與文章生命週期、分類、內容區塊 |
| Collaboration & Change | collaboration | 協作留言、細粒度權限與版本快照 |
| Structured Data | database | 結構化資料多視圖管理與自動化 |
| Semantic Organization | taxonomy, relations | 分類法與語義關聯圖 |
| Future Extensions | publishing, attachments | 正式發布流程、附件管理 |

## Route Here When

- 問題核心是知識頁面（KnowledgePage）、內容區塊（ContentBlock）、知識集合（KnowledgeCollection）。
- 問題需要把內容建立、編輯、分類、關聯、版本或交付收斂到正典狀態。
- 問題涉及知識庫文章（Article）、分類（Category）、樣板（Template）。
- 問題涉及結構化資料視圖（Database、DatabaseView、Record）。
- 問題涉及協作留言（Comment）、細粒度權限（Permission）或版本快照（Version）。
- 問題涉及分類法（Taxonomy）或語義關聯（Relation）。

## Route Elsewhere When

- 身份、租戶、授權、權益、憑證治理屬於 platform。
- 共享 AI provider、模型政策、配額與安全護欄屬於 platform.ai。
- 工作區生命週期、成員管理、共享範圍屬於 workspace。
- notebook、conversation、retrieval、grounding、synthesis 屬於 notebooklm。

## Subdomain Delivery Tiers

### Tier 1 — Core (Active)

| Subdomain | Purpose | Key Aggregates |
|-----------|---------|----------------|
| knowledge | KnowledgePage 生命週期、ContentBlock 編輯、BacklinkIndex | KnowledgePage, ContentBlock, KnowledgeCollection, BacklinkIndex |
| authoring | 知識庫文章建立、驗證、分類與發布工作流程 | Article, Category |
| collaboration | 協作留言、細粒度權限與版本快照 | Comment, Permission, Version |
| database | 結構化資料多視圖（Table/Board/Calendar/Gallery） | Database, DatabaseRecord, View, DatabaseAutomation |

### Tier 2 — Near-Term (Domain Contracts — High Business Value)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| taxonomy | 分類法、標籤樹與語義組織（跨頁面分類的正典邊界） | ≠ authoring.Category（局部文章分類）；taxonomy 是全域語義網 |
| relations | 內容之間的正式語義關聯與 backlink 管理 | ≠ knowledge.BacklinkIndex（自動反向索引）；relations 是明確語義圖（有類型、有方向） |
| attachments | 附件與媒體關聯儲存 | 檔案儲存整合的正典邊界。待附件需要獨立於頁面的保留策略時充實 |

### Tier 3 — Medium-Term (Stubs)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| publishing | 正式發布與對外交付（Publication 狀態邊界） | authoring 的 `ArticlePublicationUseCases` 是前置邊界 |
| knowledge-versioning | 全域版本快照策略（workspace-level checkpoint、保留政策） | ≠ collaboration.Version（逐次編輯歷史）；是策略量，不是操作量 |

### Premature Stubs（目錄保留，不建議擴充）

| Subdomain | Reason |
|-----------|--------|
| automation | database 子域已涵蓋 DatabaseAutomation；跨內容類型事件自動化目前無獨立領域需求 |
| knowledge-analytics | 知識使用行為量測是讀模型關注，非獨立領域模型。可由 infrastructure 查詢層處理 |
| knowledge-integration | 外部系統整合是 infrastructure adapter 關注，非獨立子域 |
| notes | 輕量筆記可作為 KnowledgePage 的頁面類型處理，不需獨立子域 |
| templates | 頁面範本是 authoring 的內部關注（內容結構起點），非獨立子域 |

### Domain Invariants

- 知識內容的正典狀態屬於 notion。
- taxonomy 應獨立於具體 UI 視圖存在（目前由 Category 承載部分）。
- BacklinkIndex 描述自動反向連結；Relation 描述主動宣告的語義關係。兩者不互相取代。
- platform.ai 可被 notion use case 消費，但 AI provider / policy ownership 不屬於 notion。
- 任何來自 notebooklm 的輸出，若要成為正典內容，必須先被 notion 吸收。

## Subdomain Analysis — 子域數量合理性

**14 個目錄（4 Active + 2 Domain Contracts + 1 Stub + 3 Medium-Term Stubs + 5 Premature = 15 分類，共 14 目錄），分析如下：**

1. **`knowledge` 與 `authoring` 不重疊**：`knowledge` 是 KnowledgePage + ContentBlock（自由形式的 wiki 頁面）；`authoring` 是 Article + Category（有工作流程的結構化 KB 文章）。
2. **`collaboration.Version` 與 `knowledge-versioning` 不重疊**：`collaboration.Version` 是逐次編輯快照（per-change history）；`knowledge-versioning` 是全域 checkpoint 策略（workspace-level snapshot policy）。
3. **`relations` 與 `knowledge.BacklinkIndex` 不重疊**：`BacklinkIndex` 是自動反向連結索引；`relations` 是明確的語義關係圖（有類型、有方向的關聯）。
4. **5 個 premature stubs** 有明確理由：每個都已被現有 active 子域或 infrastructure 層吸收。

## Ubiquitous Language

| Term | Meaning | Owning Subdomain | Do Not Use |
|------|---------|------------------|------------|
| KnowledgeArtifact | notion 主域擁有的知識內容總稱 | （跨子域概念） | Doc, Wiki (混指) |
| KnowledgePage | 正典頁面型知識單位（block-based） | knowledge | Wiki, Page (generic) |
| ContentBlock | 知識頁面的最小可組合內容單位 | knowledge | Block (generic) |
| KnowledgeCollection | 頁面集合容器（非 Database） | knowledge | Folder, Section |
| BacklinkIndex | 自動反向連結索引 | knowledge | - |
| PageStatus | 頁面生命週期狀態（draft, published, archived） | knowledge | - |
| Article | 經過撰寫與驗證流程的知識庫文章 | authoring | Post, Content |
| Category | 文章分類樹結構 | authoring | Tag System |
| Template | 可重複套用的內容結構起點 | authoring | Preset, Layout |
| Comment | 內容附著的協作討論 | collaboration | Chat, Discussion |
| Permission | 內容的細粒度存取權限 | collaboration | - |
| Version | 內容某一時點的不可變快照（逐次編輯歷史） | collaboration | - |
| Database | 結構化知識集合 | database | Table, Spreadsheet |
| DatabaseView | 對 Database 的投影與檢視配置 | database | View (generic) |
| DatabaseRecord | Database 中的一筆記錄 | database | - |
| DatabaseAutomation | Database 事件觸發的自動化動作 | database | - |
| Taxonomy | 分類法、標籤樹等語義組織結構 | taxonomy | Tag System, Category (混稱全域分類) |
| Relation | 內容對內容之間的正式語義關聯 | relations | Link, Connection |
| Publication | 對外可見且可交付的內容狀態 | publishing (stub) | Published, Public |
| Attachment | 綁定於知識內容的檔案或媒體 | attachments | File, Upload |
| VersionSnapshot | 全域版本 checkpoint 策略的不可變快照 | knowledge-versioning (stub) | Backup, History |

### Avoid

| Avoid | Use Instead |
|-------|-------------|
| Wiki | KnowledgePage 或 Article |
| Table | Database 或 DatabaseView |
| Tag System | Category (current) or Taxonomy (Tier 2) |
| Content Link | BacklinkIndex (automatic) or Relation (explicit semantic) |
| Publish Action | Publication 或 ArticlePublication |

## Dependency Direction

```text
interfaces/ → application/ → domain/ ← infrastructure/
api/ ← 唯一跨模組入口
```

## Development Order (Domain-First)

New features:
1. Define Domain (entities, value objects, aggregates, events)
2. Define Application (use cases, DTOs)
3. Define Ports (only if boundary isolation needed)
4. Implement Infrastructure (adapters, persistence)
5. Implement Interfaces (UI, actions, hooks)

Legacy migration (Strangler Pattern):
1. Find a Use Case to extract
2. Build Domain model in the owning subdomain
3. Converge Application layer
4. Isolate legacy via Ports
5. Replace Infrastructure adapter; remove old path when stable
