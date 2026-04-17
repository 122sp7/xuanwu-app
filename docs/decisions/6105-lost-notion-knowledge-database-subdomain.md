# 6105 Migration Gap — notion `knowledge-database` 子域

- Status: Recorded — Pending Implementation
- Date: 2026-04-17
- Category: Migration Gap > notion

## Context

`xuanwu-app-skill` 快照的 `modules/notion/subdomains/knowledge-database/` 包含完整的資料庫視圖子域，對應 Notion-style 的 Database（Board / Calendar / Table / Gallery / List / Form 視圖）。

對應的 `src/modules/notion/subdomains/database/` 只有骨架（無實際 domain 內容）。

### 遺失的 Domain Aggregates（domain/aggregates/）

```
knowledge-database/domain/aggregates/
  Database.ts           (45 lines) — 資料庫聚合根
    create(), addField(), removeField(), updateSchema()
    _domainEvents: DatabaseCreated, DatabaseSchemaUpdated

  View.ts               (41 lines) — 視圖聚合根（Board/Table/Calendar/Gallery/List/Form）
    create(), updateFilter(), updateSort(), updateGrouping()
    _domainEvents: ViewCreated, ViewFilterUpdated, ViewSortUpdated

  DatabaseAutomation.ts (44 lines) — 自動化規則聚合根
    create(), enable(), disable(), triggerManually()
    _domainEvents: AutomationCreated, AutomationTriggered

  DatabaseRecord.ts     (23 lines) — 資料庫記錄實體
```

### 遺失的 Domain Events（domain/events/）

```
knowledge-database/domain/events/
  DatabaseEvents.ts    (93 lines) — 所有資料庫相關事件定義
    DatabaseCreated, DatabaseSchemaUpdated, DatabaseDeleted
    ViewCreated, ViewFilterUpdated, ViewSortUpdated, ViewDeleted
    AutomationCreated, AutomationTriggered, AutomationDisabled
    RecordCreated, RecordUpdated, RecordDeleted
```

### 遺失的 Domain Repositories（domain/repositories/）

```
knowledge-database/domain/repositories/
  DatabaseRepository.ts       (49 lines)
  AutomationRepository.ts     (47 lines)
  ViewRepository.ts           (38 lines)
  DatabaseRecordRepository.ts (34 lines)
```

### 遺失的 Interfaces（interfaces/web/）

```
components/
  DatabaseBoardPanel.tsx    — Board 看板視圖
  DatabaseCalendarPanel.tsx — Calendar 日曆視圖
  DatabaseFormPanel.tsx     — Form 表單視圖
  DatabaseGalleryPanel.tsx  — Gallery 圖庫視圖
  DatabaseListPanel.tsx     — List 清單視圖
  DatabaseTablePanel.tsx    — Table 表格視圖
  DatabaseDetailPanel.tsx   — 資料庫詳情面板
  DatabaseAutomationPanel.tsx — 自動化規則設定面板
  DatabaseDialog.tsx        — 新建資料庫對話框
```

## Decision

**不實施**。僅記錄缺口。

`DatabaseEvents.ts`（93 lines）是最密集的事件定義文件，應在 domain 蒸餾時優先參考。

## Consequences

- 知識庫 Database 視圖功能（Board/Table/Calendar 等）在 `src/modules/notion/` 下無業務支撐。
- 六種視圖元件缺失導致 notion 的核心 UI 功能無法呈現。

## 關聯 ADR

- **6104** notion authoring 子域：Article 可以被組織在 Database Record 中，邊界需明確。
- **6106** notion knowledge 子域：KnowledgePage 可以是 Database Record 的一種特化形式。
