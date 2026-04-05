# wiki — Knowledge Graph Layer

> **開發狀態**：🚧 Developing — 積極開發中
> **Domain Type**：Core Domain（核心域）

`modules/wiki` 是 Knowledge Platform 的**核心域**，對應 Wiki 知識結構層。負責知識圖譜節點（GraphNode）與邊（GraphEdge）的生命週期管理，建立知識之間的結構性關聯，形成可視化的知識圖譜。

外界互動規則：
- 外界只能透過 `api/` 公開介面存取此模組
- 禁止直接 import `domain/`、`application/`、`infrastructure/`、`interfaces/`
- 事件訂閱透過領域事件 `wiki.*` 進行

---

## 職責（Responsibilities）

| 能力 | 說明 |
|------|------|
| 圖節點管理 | 建立、啟用、封存 GraphNode（對應知識頁面的圖表示） |
| 圖邊管理 | 建立、啟用、停用、移除 GraphEdge（節點間的關聯） |
| 自動連結 | 透過 AutoLinkUseCase 自動偵測並建立 WikiLink |
| Wiki 連結抽取 | 從知識內容中抽取 `[[頁面]]` 樣式連結 |
| 圖視圖設定 | 管理知識圖譜的視覺化佈局設定（ViewConfig） |

---

## 聚合根（Aggregate Roots）

| Aggregate | 說明 |
|-----------|------|
| `WikiGraph` | 知識圖譜整體，包含所有節點與邊的集合 |
| `GraphNode` | 圖中的知識節點，代表一個 WikiPage 的圖表示 |
| `GraphEdge` | 連接兩個節點的有向邊，代表知識關聯 |

---

## 通用語言（Ubiquitous Language）

| 術語 | 英文 | 說明 |
|------|------|------|
| Wiki 頁面 | WikiPage | 知識圖譜中的知識單元（節點的業務概念） |
| 知識圖譜 | WikiGraph | 由 WikiPage 與 WikiLink 組成的有向圖 |
| Wiki 連結 | WikiLink | 兩個 WikiPage 之間的有向關聯（邊的業務概念） |
| 圖節點 | GraphNode | WikiPage 在圖中的內部表示（draft / active / archived） |
| 圖邊 | GraphEdge | WikiLink 在圖中的內部表示（pending / active / inactive / removed） |
| 反向連結 | Backlink | 指向某節點的所有入向邊集合 |
| 關聯類型 | RelationType | 邊的語意類型（reference / related / parent-child 等） |
| 連結類型 | LinkType | 連結的種類（inline / block / embed） |
| 視圖設定 | ViewConfig | 圖譜的視覺化佈局與顯示偏好 |

---

## 狀態機（State Machines）

### GraphNode
```
draft  ──[ACTIVATE]──▶  active  ──[ARCHIVE]──▶  archived
                        archived ──[RESTORE]──▶  active
                        （guard: active edges 必須先移除才能 ARCHIVE）
```

### GraphEdge
```
pending ──[ACTIVATE]──▶  active   （guard: 兩端節點均為 active）
active  ──[DEACTIVATE]──▶ inactive
inactive ──[ACTIVATE]──▶  active
active/pending ──[REMOVE]──▶ removed
```

---

## 領域事件（Domain Events）

| 事件 | 觸發條件 |
|------|----------|
| `wiki.node_created` | 新 GraphNode 建立時 |
| `wiki.node_activated` | GraphNode 從 draft 轉為 active 時 |
| `wiki.node_archived` | GraphNode 被封存時 |
| `wiki.edge_created` | 新 GraphEdge 建立時 |
| `wiki.edge_activated` | GraphEdge 從 pending 轉為 active 時 |
| `wiki.link_extracted` | 從知識內容自動抽取連結時 |

---

## 依賴關係

- **上游（依賴）**：`knowledge/api`（知識頁面來源）、`workspace/api`（工作區範圍）
- **下游（被依賴）**：`search/api`（圖結構搜尋索引）、`notebook/api`（知識關聯輔助推理）

---

## 目錄結構

```
modules/wiki/
├── api/                  # 公開 API 邊界
│   ├── index.ts
│   └── wiki-api.ts
├── application/          # Use Cases
│   ├── link-extractor.service.ts
│   └── use-cases/
│       └── auto-link.use-case.ts
├── domain/               # Aggregates, Entities, Repositories
│   ├── entities/
│   │   ├── graph-node.ts
│   │   ├── link.ts
│   │   └── view-config.ts
│   └── repositories/
│       └── GraphRepository.ts
├── infrastructure/       # 圖資料庫適配器
│   └── InMemoryGraphRepository.ts
└── README.md / AGENT.md
```

---

## Mermaid 圖表

| 檔案 | 說明 |
|------|------|
| `Graph-Flow.mermaid` | GraphNode / GraphEdge 生命週期狀態機 |
| `Graph-UI.mermaid` | UI 組合與 API 邊界（App Router → api/ → Vis.js） |
| `Graph-Tree.mermaid` | MDDD 目錄結構與邊界規則 |
| `Graph-Sequence.mermaid` | 節點建立與邊連結的序列圖 |
| `Graph-ERD.mermaid` | 實體關聯圖（GraphNode / GraphEdge / GraphMetadata） |

---

## 架構參考

- 系統設計文件：`docs/architecture/domain-model.md`
- 通用語言：`docs/architecture/ubiquitous-language.md`
- 事件目錄：`docs/architecture/domain-events.md`
- AI 知識平台架構：`docs/decision-architecture/architecture/ai-knowledge-platform-architecture.md`
