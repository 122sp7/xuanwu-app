# 6106 Migration Gap — notion `knowledge` 子域

- Status: Recorded — Pending Implementation
- Date: 2026-04-17
- Category: Migration Gap > notion

## Context

`xuanwu-app-skill` 快照的 `modules/notion/subdomains/knowledge/` 包含 KnowledgePage 聚合根及其對應的 Block Editor UI 層。

對應的 `src/modules/notion/subdomains/` 有 `block/` 和 `page/` 骨架，但均無實際 domain 內容。

### 遺失的 Domain Aggregate（domain/aggregates/）

```
knowledge/domain/aggregates/
  KnowledgePage.ts    — 知識頁面聚合根
    create(), updateTitle(), updateContent(), publish(), archive()
    承載 Block 樹狀結構（Block 為 children entities）
    _domainEvents: KnowledgePageCreated, KnowledgePagePublished,
                   KnowledgePageArchived, KnowledgePageContentUpdated
```

### 遺失的 Domain Entities（domain/entities/）

```
knowledge/domain/entities/
  Block.ts            — Block 實體（Paragraph/Heading/BulletList/Image/Code 等類型）
  BlockTree.ts        — Block 樹狀結構（parent-child 遞迴）
```

### 遺失的 Domain Repository（domain/repositories/）

```
knowledge/domain/repositories/
  KnowledgePageRepository.ts  — KnowledgePage 倉儲介面
  BlockRepository.ts          — Block 倉儲介面（含 block tree 操作）
```

### 遺失的 Interfaces（interfaces/web/）

```
components/
  BlockEditorPanel.tsx         (12 lines) — Block Editor 主面板
    ← 包含 TipTap rich-text editor 整合點

  KnowledgeDetailPanel.tsx     (60 lines) — 知識頁面詳情 + 閱讀模式面板

  PageEditorPanel.tsx          (18 lines) — 頁面編輯模式面板

stores/
  block-editor.store.ts        (49 lines) — Block Editor Zustand store
    ← activeBlockId, editingMode (read/edit/preview), pendingChanges
    ← setActiveBlock(), enterEditMode(), exitEditMode(), commitChanges()
```

## Decision

**不實施**。僅記錄缺口。

`block-editor.store.ts`（49 lines Zustand store）記錄了完整的編輯器狀態機語意，應在新實作 Block Editor 時以此為參考。

## Consequences

- 知識頁面（KnowledgePage）無業務層支撐，Block 內容無法透過 use case 寫入。
- `block-editor.store.ts` 缺失導致 TipTap 編輯器無 Zustand 狀態層可連接。

## 關聯 ADR

- **6104** notion authoring 子域：Article 與 KnowledgePage 的語意邊界需在 domain 層明確定義。
- **6105** notion knowledge-database 子域：KnowledgePage 可能作為 DatabaseRecord 的特化形態存在。
