# knowledge — Knowledge Content Layer

> **開發狀態**：🚧 Developing — 積極開發中
> **Domain Type**：Core Domain（核心域）

`modules/knowledge` 是整個知識平台的**核心領域**，負責知識內容的建立、管理與版本控制。對應 Notion 的文件儲存與管理職能，是知識平台的數據根基。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- 禁止直接 import `domain/`、`application/`、`infrastructure/`、`interfaces/`
- 事件訂閱透過領域事件 `knowledge.*` 進行

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 知識頁面 CRUD | 建立、讀取、更新、刪除 KnowledgePage（含 blocks） |
| 區塊內容管理 | 管理 ContentBlock 的多型內容（text / heading / image / code 等） |
| 版本歷史 | 透過 ContentVersion 保存頁面歷史快照 |
| 知識集合 | 管理 KnowledgeCollection / Tag 分類體系 |
| 附件管理 | 管理頁面附件（Attachment），與 source 模組協作 |

---

## 聚合根（Aggregate Roots）

| Aggregate | 說明 |
|-----------|------|
| `KnowledgePage` | 核心知識頁面，包含 title、slug、parentPageId、blockIds |
| `KnowledgeCollection` | 知識集合，用於組織頁面群組 |
| `Tag` | 標籤聚合根，用於跨頁面分類 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| 知識頁面 | KnowledgePage | 核心知識單元，含 title、slug、parentPageId、blockIds |
| 區塊 | ContentBlock | 頁面內的原子內容單元（id、pageId、content、order） |
| 區塊類型 | BlockType | `text \| heading-1 \| heading-2 \| image \| code \| bullet-list \| ...` |
| 版本 | ContentVersion | 頁面的歷史快照（snapshotBlocks、editSummary、authorId） |
| 知識集合 | KnowledgeCollection | 頁面的邏輯分組容器 |
| 標籤 | Tag | 用於跨頁面分類的值標籤 |
| 附件 | Attachment | 與頁面關聯的二進制檔案參考 |

---

## 領域事件（Domain Events）

| 事件 | 觸發條件 |
|------|----------|
| `knowledge.page_created` | 新知識頁面建立時 |
| `knowledge.page_updated` | 頁面內容更新時 |
| `knowledge.page_archived` | 頁面被封存時 |
| `knowledge.version_published` | 使用者手動觸發版本快照時 |
| `knowledge.tag_assigned` | 標籤被指派到頁面時 |

---

## 依賴關係

- **上游（依賴）**：`identity/api`（作者身分）、`workspace/api`（工作區範圍）
- **下游（被依賴）**：`wiki/api`（知識圖譜節點）、`search/api`（搜尋索引）、`ai/api`（RAG ingestion）

---

## 目錄結構

```
modules/knowledge/
├── api/                  # 公開 API 邊界（contracts.ts, facade.ts, index.ts）
├── application/          # Use Cases
│   └── use-cases/
├── domain/               # Aggregates, Entities, Value Objects, Events, Repositories
│   ├── entities/
│   ├── events/
│   ├── repositories/
│   └── value-objects/
├── infrastructure/       # Firebase / 外部適配器
│   └── firebase/
├── interfaces/           # UI 元件、hooks、server actions
│   ├── components/
│   ├── hooks/
│   └── _actions/
└── index.ts              # 模組根 barrel（client-safe 匯出）
```

---

## 架構參考

- 系統設計文件：`docs/architecture/domain-model.md`
- 通用語言：`docs/architecture/ubiquitous-language.md`
- 事件目錄：`docs/architecture/domain-events.md`
