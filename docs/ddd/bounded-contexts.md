# Bounded Contexts — Xuanwu App

> **理論依據：** Vaughn Vernon《Implementing Domain-Driven Design》第 2–3 章

本文件定義 Xuanwu App 全部 **16 個有界上下文（Bounded Contexts）** 的邊界、職責與整合模式概覽。每個 BC 對應 `modules/` 下的一個目錄。

---

## 四層架構

```
┌──────────────────────────────────────────────────────────────────────┐
│  AI Layer                                                             │
│  ai  ·  notebook  ·  search                                          │
├──────────────────────────────────────────────────────────────────────┤
│  Knowledge Graph Layer                                               │
│  wiki                                                                │
├──────────────────────────────────────────────────────────────────────┤
│  Content / Source Layer                                              │
│  knowledge  ·  source                                                │
├──────────────────────────────────────────────────────────────────────┤
│  Platform Foundation Layer                                           │
│  identity  ·  account  ·  organization  ·  workspace                 │
│  workspace-{flow,scheduling,audit,feed}  ·  notification  ·  shared  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 1. Platform Foundation Layer

### `identity` — 身份驗證上下文

| | |
|---|---|
| **Domain Type** | Generic Subdomain |
| **模組路徑** | `modules/identity/` |
| **核心聚合** | `Identity` |
| **主要職責** | Firebase Auth 封裝：signIn / signOut / token 刷新 |
| **邊界規則** | `api/` 不得匯出 `"use client"` 元件（被 `account` 伺服器端 use-cases 引入） |
| **詳細文件** | [`docs/ddd/identity/`](./identity/) |

### `account` — 帳戶設定檔上下文

| | |
|---|---|
| **Domain Type** | Generic Subdomain |
| **模組路徑** | `modules/account/` |
| **核心聚合** | `Account`, `AccountPolicy` |
| **主要職責** | 用戶 profile 管理、存取控制政策、custom claims |
| **詳細文件** | [`docs/ddd/account/`](./account/) |

### `organization` — 組織上下文

| | |
|---|---|
| **Domain Type** | Generic Subdomain |
| **模組路徑** | `modules/organization/` |
| **核心聚合** | `Organization` |
| **主要職責** | 多租戶管理：Organization、MemberReference、Team、PartnerInvite |
| **詳細文件** | [`docs/ddd/organization/`](./organization/) |

### `workspace` — 工作區上下文

| | |
|---|---|
| **Domain Type** | Generic Subdomain |
| **模組路徑** | `modules/workspace/` |
| **核心聚合** | `Workspace`, `WorkspaceMember`, `WikiContentTree` |
| **主要職責** | 工作區容器：建立/歸檔、成員管理、Wiki 內容樹結構 |
| **特殊邊界** | `workspace/infrastructure` 禁止 import `workspace/api`（循環依賴） |
| **詳細文件** | [`docs/ddd/workspace/`](./workspace/) |

### `notification` — 通知上下文

| | |
|---|---|
| **Domain Type** | Generic Subdomain |
| **模組路徑** | `modules/notification/` |
| **核心聚合** | `NotificationEntity` |
| **主要職責** | 系統通知分發（info / alert / success / warning） |
| **詳細文件** | [`docs/ddd/notification/`](./notification/) |

### `shared` — 共享核心

| | |
|---|---|
| **Domain Type** | Shared Kernel |
| **模組路徑** | `modules/shared/` |
| **核心型別** | `DomainEvent`, `EventRecord`, `SlugUtils` |
| **主要職責** | 跨模組共用基礎型別；`DomainEvent.occurredAt` 為 ISO string |
| **詳細文件** | [`docs/ddd/shared/`](./shared/) |

---

## 2. Content / Source Layer

### `knowledge` — 知識內容上下文

| | |
|---|---|
| **Domain Type** | **Core Domain** |
| **模組路徑** | `modules/knowledge/` |
| **核心聚合** | `KnowledgePage`, `ContentBlock`, `ContentVersion` |
| **主要職責** | KnowledgePage CRUD、Block Editor、版本歷史、AI 審批流 |
| **關鍵事件** | `knowledge.page_approved`（觸發 workspace-flow 物化） |
| **詳細文件** | [`docs/ddd/knowledge/`](./knowledge/) |

### `source` — 文件來源上下文

| | |
|---|---|
| **Domain Type** | Supporting Subdomain |
| **模組路徑** | `modules/source/` |
| **核心聚合** | `SourceDocument`（File.ts）, `WikiLibrary` |
| **主要職責** | 檔案上傳、版本快照、保留政策、RAG 文件登記 |
| **Runtime 邊界** | Next.js 負責上傳 UX；`py_fn/` 負責 Embedding 生成 |
| **詳細文件** | [`docs/ddd/source/`](./source/) |

---

## 3. Knowledge Graph Layer

### `wiki` — 知識圖譜上下文

| | |
|---|---|
| **Domain Type** | **Core Domain** |
| **模組路徑** | `modules/wiki/` |
| **核心聚合** | `GraphNode`, `GraphEdge` |
| **主要職責** | 知識節點（draft→active→archived）與邊（pending→active→inactive→removed）生命週期 |
| **詳細文件** | [`docs/ddd/wiki/`](./wiki/) |

---

## 4. AI Layer

### `ai` — AI 攝入管線上下文

| | |
|---|---|
| **Domain Type** | Supporting Subdomain |
| **模組路徑** | `modules/ai/` |
| **核心聚合** | `IngestionJob`, `IngestionDocument`, `IngestionChunk` |
| **主要職責** | RAG 攝入 Job 生命週期（uploaded → parsing → embedding → indexed） |
| **詳細文件** | [`docs/ddd/ai/`](./ai/) |

### `notebook` — AI 對話上下文

| | |
|---|---|
| **Domain Type** | Supporting Subdomain |
| **模組路徑** | `modules/notebook/` |
| **核心聚合** | `Thread`, `Message` |
| **主要職責** | 對話 Thread 管理，封裝 Genkit AI 回應生成 |
| **詳細文件** | [`docs/ddd/notebook/`](./notebook/) |

### `search` — RAG 語意檢索上下文

| | |
|---|---|
| **Domain Type** | Supporting Subdomain |
| **模組路徑** | `modules/search/` |
| **核心聚合** | `RagQuery`, `RagQueryFeedback` |
| **主要職責** | 向量搜尋（VectorStore port）、RAG answer 生成、查詢反饋收集 |
| **詳細文件** | [`docs/ddd/search/`](./search/) |

---

## 5. Workspace Operations Layer

### `workspace-flow` — 工作流程上下文

| | |
|---|---|
| **Domain Type** | Supporting Subdomain |
| **模組路徑** | `modules/workspace-flow/` |
| **核心聚合** | `Task`, `Issue`, `Invoice` |
| **主要職責** | Task / Issue / Invoice 狀態機、守衛規則、ContentToWorkflowMaterializer |
| **詳細文件** | [`docs/ddd/workspace-flow/`](./workspace-flow/) |

### `workspace-scheduling` — 排程上下文

| | |
|---|---|
| **Domain Type** | Supporting Subdomain |
| **模組路徑** | `modules/workspace-scheduling/` |
| **核心聚合** | `WorkDemand` |
| **主要職責** | 工作需求建立（draft→open→in_progress→completed）、日曆視圖 |
| **詳細文件** | [`docs/ddd/workspace-scheduling/`](./workspace-scheduling/) |

### `workspace-audit` — 稽核上下文

| | |
|---|---|
| **Domain Type** | Supporting Subdomain |
| **模組路徑** | `modules/workspace-audit/` |
| **核心聚合** | `AuditLog`（append-only） |
| **主要職責** | 工作區與組織稽核記錄查詢（只讀，永不修改） |
| **詳細文件** | [`docs/ddd/workspace-audit/`](./workspace-audit/) |

### `workspace-feed` — 動態牆上下文

| | |
|---|---|
| **Domain Type** | Supporting Subdomain |
| **模組路徑** | `modules/workspace-feed/` |
| **核心聚合** | `WorkspaceFeedPost` |
| **主要職責** | 工作區社交動態：post / reply / repost、互動（like/view/bookmark/share） |
| **詳細文件** | [`docs/ddd/workspace-feed/`](./workspace-feed/) |

---

## Integration Pattern 一覽

| 上游 BC | 下游 BC | 整合模式 | 說明 |
|---------|---------|----------|------|
| `identity` | `account` | Customer/Supplier | identity 提供 uid，account 消費 |
| `account` | `organization` | Customer/Supplier | organization.members 參照 account |
| `organization` | `workspace` | Customer/Supplier | workspace 關聯組織或帳戶 |
| `knowledge` | `workspace-flow` | Published Language (Events) | `knowledge.page_approved` 觸發 Task/Invoice 物化 |
| `knowledge` | `wiki` | Customer/Supplier | wiki 訂閱 knowledge 頁面事件以同步 GraphNode |
| `source` | `ai` | Customer/Supplier | 上傳完成後交付 IngestionJob |
| `ai` | `search` | Customer/Supplier | Embedding 完成後更新向量索引 |
| `search` | `notebook` | Customer/Supplier | notebook 查詢 search 檢索結果 |
| `workspace` | `workspace-{flow,scheduling,audit,feed}` | Conformist | 子模組遵從 workspace 的 workspaceId |
| 所有模組 | `shared` | Shared Kernel | 共用 DomainEvent、EventRecord 型別 |

---

## 架構參考

- 子域分類：[`subdomains.md`](./subdomains.md)
- 詳細 BC 文件：各子目錄 `README.md`
- 通用語言：各 bounded context 的 `ubiquitous-language.md`
- 上下文關係圖：各 bounded context 的 `context-map.md`
