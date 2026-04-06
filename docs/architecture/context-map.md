# Context Map（上下文關係圖）

<!-- change: Refresh context map to current bounded-context topology; PR-NUM -->

本文件描述 Xuanwu App 目前 bounded contexts 之間的關係與互動模式。

> **相關文件：** [`../ddd/bounded-contexts.md`](../ddd/bounded-contexts.md) · [`module-boundary.md`](./module-boundary.md) · [`../reference/specification/system-overview.md`](../reference/specification/system-overview.md)

---

## 全局上下文關係圖

```
identity ──► account ──► organization ──► workspace
              │            │
              │            ├──► workspace-feed
              │            ├──► workspace-flow
              │            ├──► workspace-scheduling
              │            └──► workspace-audit
              │
workspace ──hosts──► knowledge ──promote──► knowledge-base
  │               │   │                    │
  │               │   └──► knowledge-collaboration
  │               │
  │               └──► knowledge-database
  │
  └──► source ──registers──► ai ──ingestion_completed──► search ──► notebook

shared ──► all contexts (event store primitives, slugs, shared domain contracts)
notification ──consumes platform / workflow signals for user-facing delivery
```

---

## 上下文互動關係詳細說明

### Foundation 與治理邊界

- `identity` 提供已驗證身份；`account` 承接帳戶語意與個人化。
- `organization` 擁有 tenant / team / member 關係；`workspace` 是協作容器與模組掛載邊界。
- `workspace-feed`、`workspace-flow`、`workspace-scheduling`、`workspace-audit` 都以 `workspaceId` 為基礎鍵，但各自擁有自己的狀態與資料模型。

### 核心知識與知識資產

- `knowledge` 擁有 Knowledge Page、Block、Version 與 Approval lifecycle。
- `knowledge-base` 承接被提升為組織級文章、SOP、Wiki-like assets 的內容。
- `knowledge-collaboration` 承接評論、權限與版本快照；不反向擁有 `knowledge` 本身。
- `knowledge-database` 承接結構化 database / record / view 模型，並與頁面體驗並列存在。

### 來源、攝入、檢索、Notebook

- `source` 是外部文件與來源的 anti-corruption entrypoint。
- `ai` 承接 ingestion job、stage progression 與 `py_fn/` worker handoff。
- `search` 消費 `ai` 已準備好的 ingestion 結果，提供 retrieval、citation context、answer generation。
- `notebook` 透過 `search/api` 取得查詢結果，組裝 ask/cite、summary 與 knowledge generation 體驗。

### 物化流程（Materialization Flow）

```
[source / external documents]
    │ register
    ▼
[ai ingestion pipeline]
    │ indexed / ready
    ▼
[search retrieval]
    │ ask/cite context
    ▼
[notebook research flow]

[knowledge page draft]
    │ user review / approve
    ▼
[knowledge.page_approved]
    │ causationId + correlationId
    ▼
[workspace-flow materializer]
    ├── Task (sourceReference → KnowledgePage)
    └── Invoice (sourceReference → KnowledgePage)
```

---

## 跨上下文關係模式（DDD Patterns）

| 上游 | 下游 | 關係模式 | 說明 |
|------|------|---------|------|
| `identity` | `account` | **Customer/Supplier** | account 依賴 identity/api 的 uid |
| `account` | `organization` | **Published Language** | MemberReference 是公開合約 |
| `organization` | `workspace` | **Conformist** | workspace 遵從 organization 的帳戶模型 |
| `workspace` | `workspace-flow/feed/audit` | **Open Host Service** | workspace 提供標準化 workspaceId 鍵 |
| `workspace` | `knowledge` | **Customer/Supplier** | workspace 提供知識內容的容器與可見性邊界 |
| `knowledge` | `knowledge-base` | **Customer/Supplier** | knowledge page 可被提升為 article / SOP asset |
| `knowledge` | `workspace-flow` | **Published Language** | 透過 `knowledge.page_approved` 派生任務與發票 |
| `source` | `ai` | **Customer/Supplier** | source 提供待攝入文件與來源集合 |
| `ai` | `search` | **Published Language** | 透過 ingestion 完成事件與 index-ready 狀態協作 |
| `search` | `notebook` | **Customer/Supplier** | notebook 呼叫 `search/api` 執行 ask/cite 與 retrieval |
| `shared` | 所有模組 | **Shared Kernel** | EventRecord + Slug 工具共享原語 |

---

## 禁止的跨上下文依賴

下列依賴方向違反 MDDD 架構規則，**嚴格禁止**：

```
❌ ai layer → platform foundation (繞過 Content/KG 層)
❌ infrastructure/ 直接 import 另一模組的 domain/
❌ domain/ 直接 import 另一模組的 application/ 或 interfaces/
❌ workspace/infrastructure 從 workspace/api import（循環依賴）
```

---

## 跨上下文通訊規則

| 通訊類型 | 方式 | 範例 |
|---------|------|------|
| **同步查詢** | 透過目標模組的 `api/index.ts` | `import { getWorkspaceById } from "@/modules/workspace/api"` |
| **命令觸發** | 透過目標模組的 `api/index.ts` Server Action | `import { createKnowledgePage } from "@/modules/knowledge/api"` |
| **非同步事件** | `shared` 模組的 Event Store + Event Bus | `PublishDomainEventUseCase.execute()` |
| **Python 管線** | Firestore 文件狀態機（`uploaded → processing → ready`） | `IngestionJob.status` 輪詢/訂閱 |
