# Notion Agent

> Strategic agent documentation: [docs/contexts/notion/AGENT.md](../../docs/contexts/notion/AGENT.md)

## Mission

保護 notion 主域作為知識內容生命週期邊界。notion 擁有正式知識內容（KnowledgePage、Article、Database），不擁有治理、工作區範疇或推理輸出。

## Bounded Context Summary

| Aspect | Description |
|--------|-------------|
| Primary role | 正典知識內容生命週期 |
| Upstream | platform（治理、AI capability）、workspace（workspaceId、membership scope、share scope） |
| Downstream | notebooklm（knowledge artifact reference、attachment reference、taxonomy hint） |
| Core invariant | notion 只能修改自己的正典內容，不可直接呼叫 notebooklm 的推理流程 |
| Published language | KnowledgeArtifact reference、attachment reference、taxonomy hint |

## Route Here When

- 問題核心是知識頁面（KnowledgePage）、內容區塊（ContentBlock）、知識集合（KnowledgeCollection）。
- 問題需要把內容建立、編輯、分類、關聯、版本或交付收斂到正典狀態。
- 問題涉及知識庫文章（Article）、分類（Category）、樣板（Template）。
- 問題涉及結構化資料視圖（Database、DatabaseView、Record）。
- 問題涉及協作留言（Comment）、細粒度權限（Permission）或版本快照（Version）。
- 問題涉及附件媒體、知識事件觸發、外部系統知識同步。

## Route Elsewhere When

- 身份、租戶、授權、權益、憑證治理屬於 platform。
- 工作區生命週期、成員管理、共享範圍屬於 workspace。
- notebook、conversation、retrieval、grounding、synthesis 屬於 notebooklm。
- 共享 AI provider、模型政策、配額屬於 platform.ai。

## Subdomain Delivery Tiers

### Tier 1 — Core (Active)

| Subdomain | Purpose | Key Aggregates |
|-----------|---------|----------------|
| knowledge | KnowledgePage 生命週期、ContentBlock 編輯、BacklinkIndex | KnowledgePage, ContentBlock, KnowledgeCollection, BacklinkIndex |
| authoring | 知識庫文章建立、驗證、分類與發布工作流程 | Article, Category |
| collaboration | 協作留言、細粒度權限與版本快照 | Comment, Permission, Version |
| database | 結構化資料多視圖（Table/Board/Calendar/Gallery） | Database, DatabaseRecord, View, DatabaseAutomation |

### Tier 2 — Near-Term (Stubs — High Business Value)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| taxonomy | 分類法、標籤樹與語義組織（跨頁面分類的正典邊界） | BacklinkIndex 在 knowledge 內；taxonomy 負責語義分類圖 |
| relations | 內容之間的正式語義關聯與 backlink 管理 | 不同於 BacklinkIndex（自動）；relations 是明確語義圖 |
| templates | 頁面範本管理與套用 | 加速建立標準化內容頁面 |
| attachments | 附件與媒體關聯儲存 | 檔案儲存整合的正典邊界 |

### Tier 3 — Medium-Term (Stubs)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| publishing | 正式發布與對外交付（Publication 狀態邊界） | authoring 的 `ArticlePublicationUseCases` 是前置邊界 |
| notes | 個人輕量筆記（與 KnowledgePage 不同的低儀式物件） | - |
| knowledge-versioning | 全域版本快照策略（workspace-level checkpoint、保留政策） | ≠ collaboration.Version（細粒度編輯歷史） |

### Tier 4 — Deferred (Stubs)

| Subdomain | Purpose | Note |
|-----------|---------|------|
| automation | 知識事件觸發自動化動作 | database.DatabaseAutomation 是局部實作；automation 是跨內容類型的事件規則 |
| knowledge-analytics | 知識使用行為量測與分析 | 消費 platform.analytics 介面 |
| knowledge-integration | 知識與外部系統雙向同步（Confluence、GitHub wiki） | 消費 platform.integration 介面 |

## Subdomain Analysis — 子域數量合理性

**14 個子域（4 Active + 10 Stubs），分析如下：**

1. **`knowledge` 與 `authoring` 不重疊**：`knowledge` 是 KnowledgePage + ContentBlock（自由形式的 wiki 頁面）；`authoring` 是 Article + Category（有工作流程的結構化 KB 文章）。
2. **`collaboration.Version` 與 `knowledge-versioning` 不重疊**：`collaboration.Version` 是逐次編輯快照（per-change history）；`knowledge-versioning` 是全域 checkpoint 策略（workspace-level snapshot policy）。這兩個責任需要明確分開。
3. **`database.DatabaseAutomation` 與 `automation` 分工**：`database.DatabaseAutomation` 是資料庫範疇的規則；`automation` 是跨內容類型的知識事件觸發規則（不同上下文）。
4. **`relations` 與 `knowledge.BacklinkIndex` 不重疊**：`BacklinkIndex` 是自動反向連結索引；`relations` 是明確的語義關係圖（有類型、有方向的關聯）。
5. **無子域需要刪除**：每個子域有清楚的邊界責任。
6. **需要的卻可能被忽略**：`taxonomy` 是 Notion 語義組織的核心，應從 Gap Stub 提升到 Tier 2 的優先事項，因為 `authoring.Category` 只是局部分類，不等於全域 taxonomy。

## Ubiquitous Language

| Term | Meaning | Do Not Use |
|------|---------|------------|
| KnowledgeArtifact | notion 主域擁有的知識內容總稱 | Doc, Wiki (混指) |
| KnowledgePage | 正典頁面型知識單位（block-based） | Wiki, Page (generic) |
| Article | 經過撰寫與驗證流程的知識庫文章 | Post, Content |
| Database | 結構化知識集合（可投影為 Table/Board/Calendar） | Table, Spreadsheet |
| DatabaseView | 對 Database 的投影與檢視配置 | View (generic) |
| ContentBlock | 知識頁面的最小可組合內容單位 | Block (generic) |
| Taxonomy | 分類法、標籤樹等語義組織結構 | Tag System, Category (混稱全域分類) |
| Relation | 內容對內容之間的正式語義關聯 | Link, Connection |
| CollaborationThread | 內容附著的協作討論邊界 | Chat, Discussion |
| Attachment | 綁定於知識內容的檔案或媒體 | File, Upload |
| Template | 可重複套用的內容結構起點 | Preset, Layout |
| Publication | 對外可見且可交付的內容狀態 | Published, Public |
| VersionSnapshot | 某一時點的不可變全域快照（知識版本策略） | Backup, History |
| KnowledgeCollection | 頁面集合容器（非 Database） | Folder, Section |

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
