# Context Map（上下文關係圖）

本文件描述 Xuanwu App 16 個有界上下文之間的關係與互動模式。

> **相關文件：** [`bounded-contexts.md`](./bounded-contexts.md) · [`module-boundary.md`](./module-boundary.md)

---

## 全局上下文關係圖

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ AI Layer                                                                      │
│  ┌──────────┐    RAG 查詢    ┌──────────────┐   對話編排  ┌──────────┐      │
│  │ knowledge│──── chunks ──►│  retrieval   │◄──────────►│  agent   │      │
│  │(攝入管線) │               │(向量搜索/生成)│             │(Genkit)  │      │
│  └──────────┘               └──────────────┘             └──────────┘      │
│       ▲                             ▲                                        │
│       │                             │                                        │
├───────┼─────────────────────────────┼──────────────────────────────────────┤
│ Knowledge Graph Layer               │                                        │
│  ┌──────────────────┐               │                                        │
│  │  knowledge-graph │ Backlink/     │                                        │
│  │  (GraphNode/Link)│ Graph Traversal                                        │
│  └──────────────────┘               │                                        │
│       ▲                             │                                        │
│       │ page_created/block_updated  │                                        │
├───────┼─────────────────────────────┼──────────────────────────────────────┤
│ Content / UI Layer                  │                                        │
│  ┌──────────┐        ┌──────────┐   │                                        │
│  │ content  │──embeds►│  asset   │──► RagDocument ─────────────────────────►│
│  │(Page/Blk)│        │(File/Lib)│                                            │
│  └──────────┘        └──────────┘                                            │
│       ▲                   ▲                                                   │
│       │                   │                                                   │
├───────┼───────────────────┼──────────────────────────────────────────────────┤
│ Platform Foundation Layer │                                                   │
│  ┌──────────┐  ┌──────────┐   ┌──────────────┐   ┌──────────────────────┐  │
│  │ identity │  │ account  │   │ organization │   │  workspace           │  │
│  │(Firebase │─►│(Profile) │◄──│(Tenant/Team) │──►│  + workspace-audit   │  │
│  │  Auth)   │  └──────────┘   └──────────────┘   │  + workspace-feed    │  │
│  └──────────┘                                      │  + workspace-flow    │  │
│                                                     │  + workspace-sched. │  │
│                      ┌──────────────────────┐      │  + notification      │  │
│                      │ shared               │      └──────────────────────┘  │
│                      │(EventRecord/Slug)    │                                 │
│                      └──────────────────────┘                                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 上下文互動關係詳細說明

### Platform Foundation 層內部關係

```
identity ──認證→ account
  │
  └── 提供 uid，account 使用 identity/api 查詢已驗證使用者

account ──profile for→ organization (members)
  │
  └── Organization.members[] 中的 MemberReference 參照 Account id

account ──owns→ workspace
  │
  └── WorkspaceEntity.accountId 關聯至帳戶/組織

organization ──contains→ workspace
  │
  └── WorkspaceEntity.accountId + accountType="organization"
```

**關係模式：** Customer/Supplier — `identity` 是上游供應者，`account` 是下游消費者。

---

### Workspace Layer 內部關係

```
workspace ──hosts→ workspace-feed
  │  workspace ──hosts→ workspace-flow
  │  workspace ──hosts→ workspace-scheduling
  │  workspace ──hosts→ workspace-audit
  │
  └── 以 workspaceId 作為外鍵關聯，各子模組各自管理資料

workspace-flow.task.created ──event→ workspace-audit
  └── 稽核日誌訂閱 workspace-flow 事件（計畫中）
```

---

### Content Layer 關係

```
workspace ──hosts→ content (via WikiBetaContentTree)
  └── workspace.domain.entities.WikiBetaContentTree 持有頁面 ID 層級結構

content ──page link events→ knowledge-graph (Auto-link, 計畫中)
  └── content.block-updated → LinkExtractor → knowledge-graph.addLink()

content ──embeds chunks→ knowledge (RAG ingestion)
  └── ContentBlock.text → py_fn 攝入管線 → IngestionChunk

workspace ──hosts→ asset (Files & Libraries)
  └── asset.File 以 workspaceId 歸屬

content ──page approved events→ workspace-flow (Materialization)
  └── content.page_approved → 生成 Task / Invoice 並帶入 causationId

content (Database View) ──reads→ workspace-flow
  └── 透過 ID 參照動態嵌入任務與發票狀態，單向讀取。
```

---

### AI Layer 關係

```
knowledge ──ingested chunks→ retrieval
  └── py_fn 攝入後將 vectors 寫入 Firestore；retrieval 透過向量搜索讀取

retrieval ──answer generation→ agent
  └── agent.application.use-cases.AnswerRagQueryUseCase
      委派至 retrieval 模組的 RagRetrievalRepository + RagGenerationRepository

asset ──RAG document→ knowledge
  └── RegisterUploadedRagDocumentUseCase → IngestionJob 建立
```

---

## 跨上下文關係模式（DDD Patterns）

| 上游 | 下游 | 關係模式 | 說明 |
|------|------|---------|------|
| `identity` | `account` | **Customer/Supplier** | account 依賴 identity/api 的 uid |
| `account` | `organization` | **Published Language** | MemberReference 是公開合約 |
| `organization` | `workspace` | **Conformist** | workspace 遵從 organization 的帳戶模型 |
| `workspace` | `workspace-flow/feed/audit` | **Open Host Service** | workspace 提供標準化 workspaceId 鍵 |
| `content` | `knowledge-graph` | **Event-driven** | 透過 ContentUpdatedEvent 解耦 |
| `content` | `knowledge` | **Event-driven** | 透過 py_fn 攝入管線解耦 |
| `content` | `workspace-flow` | **Event-driven / Customer-Supplier** | 透過 `content.page_approved` 派生任務，並透過 ID 關聯視圖 |
| `knowledge` | `retrieval` | **Shared Kernel** | 共享 chunk schema（Firestore 文件結構） |
| `retrieval` | `agent` | **Customer/Supplier** | agent 呼叫 retrieval/api 執行 RAG |
| `asset` | `knowledge` | **Customer/Supplier** | 上傳後觸發 IngestionJob |
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
| **命令觸發** | 透過目標模組的 `api/index.ts` Server Action | `import { createContentPage } from "@/modules/content/api"` |
| **非同步事件** | `shared` 模組的 Event Store + Event Bus | `PublishDomainEventUseCase.execute()` |
| **Python 管線** | Firestore 文件狀態機（`uploaded → processing → ready`） | `IngestionJob.status` 輪詢/訂閱 |
