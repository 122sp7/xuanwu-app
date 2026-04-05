# Bounded Contexts — Xuanwu App

> **理論依據：** Vaughn Vernon《Implementing Domain-Driven Design》第 2–3 章  
> **產品定位：** Knowledge Platform / Second Brain，以 **Knowledge** 為核心、**Knowledge Base** 為組織知識、**AI** 為推理層。

本文件定義 Xuanwu App 目前採用的 **18 個有界上下文（Bounded Contexts）**。  
Notion、Wiki、NotebookLM 在這裡是**產品能力映射**，不是 1:1 的程式模組名稱：

- **Notion-like 層**：知識儲存、編輯、工作區協作、來源接入、結構化資料庫
- **Knowledge Base 層**：組織知識庫、分類、驗證、Backlink
- **NotebookLM-like 層**：檢索、摘要、問答、推理

---

## 系統層級映射

| 系統層級 | 產品隱喻 | 主要 Bounded Context | 說明 |
|---|---|---|---|
| Knowledge UI / Storage Layer | Notion-like | `knowledge`, `source`, `workspace` | 管理個人知識頁面、來源文件、工作區容器 |
| Knowledge Base Layer | Wiki / SOP-like | `knowledge-base` | 組織知識庫、Article 分類、SOP 驗證 |
| Knowledge Ops Layer | 協作 | `knowledge-collaboration`, `knowledge-database` | 版本、權限、留言、結構化資料庫 |
| AI Reasoning Layer | NotebookLM-like | `notebook`, `search`, `ai` | 執行檢索、引用、摘要、問答與攝入管線協調 |
| Platform Foundation Layer | 平台基礎 | `identity`, `account`, `organization`, `notification`, `shared` | 支撐身份、帳戶、組織、通知與共享核心 |
| Workspace Operations Layer | 協作營運 | `workspace-flow`, `workspace-scheduling`, `workspace-audit`, `workspace-feed` | 支撐任務、排程、稽核與工作區動態 |

---

## 子域分類摘要

| 分類 | Bounded Context |
|---|---|
| **Core Domain** | `knowledge`, `knowledge-base` |
| **Supporting Subdomain** | `knowledge-collaboration`, `knowledge-database`, `ai`, `notebook`, `search`, `source`, `workspace-flow`, `workspace-scheduling`, `workspace-audit`, `workspace-feed` |
| **Generic Subdomain / Shared Kernel** | `identity`, `account`, `organization`, `workspace`, `notification`, `shared` |

---

## Bounded Context Catalog

| Context | Domain Type | 系統角色 | 主要職責 | 主要協作 |
|---|---|---|---|---|
| `identity` | Generic | 身份入口 | 驗證、登入、token 生命週期 | `account`, `organization`, `workspace` |
| `account` | Generic | 個人帳戶層 | 個人設定檔、偏好、存取政策 | `identity`, `organization` |
| `organization` | Generic | 多租戶治理 | 組織、成員、團隊、夥伴邀請 | `account`, `workspace` |
| `workspace` | Generic | 協作容器 | 工作區、成員、內容樹、子模組整合 | `organization`, `knowledge`, `knowledge-base`, `workspace-*` |
| `notification` | Generic | 通知分發 | 系統訊息、提醒、成功/警告通知 | 全域消費 |
| `shared` | Shared Kernel | 共享核心 | 共用事件、值物件、工具與跨域基礎型別 | 全域依賴 |
| `knowledge` | **Core** | 個人知識內容層 | 知識頁面、Block 編輯、審批事件 | `workspace`, `knowledge-collaboration`, `source`, `search`, `notebook` |
| `knowledge-base` | **Core** | 組織知識庫層 | Article、Category、驗證機制、Backlink | `workspace`, `knowledge`, `knowledge-collaboration`, `notification`, `workspace-feed` |
| `knowledge-collaboration` | Supporting | 協作基礎設施層 | Comment、Permission、Version 快照 | `knowledge`, `knowledge-base`, `knowledge-database`, `workspace-audit`, `notification` |
| `knowledge-database` | Supporting | 結構化資料層 | Database、Record、View（Table/Board/Calendar/Timeline/Gallery） | `workspace`, `knowledge`, `knowledge-base`, `knowledge-collaboration` |
| `source` | Supporting | 來源接入層 | 文件上傳、來源登記、保留政策、攝入交接 | `workspace`, `knowledge`, `ai` |
| `ai` | Supporting | AI 攝入協調層 | Ingestion job、worker handoff、索引前處理 | `source`, `search`, `notebook` |
| `notebook` | Supporting | NotebookLM-like 互動層 | 對話、摘要、洞察、引用式問答 | `search`, `knowledge`, `knowledge-base`, `ai` |
| `search` | Supporting | 語意檢索層 | 向量搜尋、RAG 查詢、答案與反饋 | `ai`, `notebook`, `knowledge-base`, `knowledge` |
| `workspace-flow` | Supporting | 工作流程層 | Task / Issue / Invoice 狀態機與物化 | `knowledge`, `workspace`, `workspace-audit`, `workspace-feed` |
| `workspace-scheduling` | Supporting | 協作排程層 | 工作需求、日曆視圖、截止與容量安排 | `workspace`, `workspace-flow` |
| `workspace-audit` | Supporting | 稽核追蹤層 | Append-only 稽核紀錄與查詢 | `workspace`, `organization`, `workspace-flow` |
| `workspace-feed` | Supporting | 工作區動態層 | 工作區貼文、回覆、互動事件流 | `workspace`, `workspace-flow`, `notification` |

---

## 典型依賴與協作方式

```text
Identity → Account → Organization → Workspace
                              ├─→ Knowledge ─────────────────────┐
                              ├─→ Knowledge Base ─────────────── │─→ Search ─→ Notebook
                              ├─→ Knowledge Collab / Database ───┘
                              ├─→ Source ───→ AI ────────────────────────────┘
                              └─→ Workspace Operations
                                   ├─ workspace-flow
                                   ├─ workspace-scheduling
                                   ├─ workspace-audit
                                   └─ workspace-feed
```

---

## 整合原則

1. **Cross-module access 必須走 `api/`**，不得 reach-through 到其他模組內部層。  
2. **Core Domain** 以 `knowledge`（個人筆記）與 `knowledge-base`（組織知識庫）為核心雙主域，其他上下文支撐其儲存、協作、結構化資料與推理能力。  
3. **事件整合優先於同步耦合**：例如 `knowledge.page_approved` 驅動 `workspace-flow` 物化。  
4. **外部系統透過 Anti-Corruption Layer 整合**：例如 Firebase、Vector Store、Genkit、Python worker。  
5. **Runtime split 必須維持**：Next.js 負責使用者互動與協調；`py_fn/` 負責重型 ingestion / embedding。  

---

## 詳細文件

- 子域分類：[`subdomains.md`](./subdomains.md)
- 各 BC 詳細文件：`docs/ddd/<context>/README.md`
- 通用語言：各 bounded context 的 `ubiquitous-language.md`
- 上下文關係圖：各 bounded context 的 `context-map.md`
