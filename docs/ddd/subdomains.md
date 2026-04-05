# Subdomains — Xuanwu App

> **理論依據：** Vaughn Vernon《Implementing Domain-Driven Design》第 2 章 Strategic Design

本文件依照 IDDD 策略設計原則，將 Xuanwu App 的所有業務能力分類為 **核心域（Core Domain）**、**支援子域（Supporting Subdomain）** 與 **通用子域（Generic Subdomain）**。

---

## 一、分類依據

| 分類 | 定義 | 投資策略 |
|------|------|----------|
| **Core Domain** | 企業競爭優勢所在，直接體現產品核心價值 | 最高投入，自行建構，精細建模 |
| **Supporting Subdomain** | 支撐核心域運作，對業務重要但非差異化競爭點 | 中等投入，可自建或定制，務實建模 |
| **Generic Subdomain** | 商品化能力，所有同類產品都需要 | 低投入，優先採用成熟方案，最小化自定義 |

---

## 二、核心域（Core Domain）

核心域是 Xuanwu App 的**差異化競爭優勢**，代表知識平台的核心價值主張。

### `knowledge` — 知識內容管理

**戰略重要性：** ⭐⭐⭐ 最高

Xuanwu 的核心產品功能是「結構化知識創作與協作」。`knowledge` 域擁有 KnowledgePage 的完整生命週期——建立、區塊編輯、版本歷史、審批流程。這是用戶每天最高頻互動的域，決定產品體驗的成敗。

**為何是核心域：**
- 知識頁面的 Block Editor 體驗是核心差異點
- ContentVersion 版本歷史是知識管理的核心能力
- `content.page_approved` 事件驅動 AI 物化流程，是 AI×知識 融合的關鍵接縫

**模組：** `modules/knowledge/`

---

### `wiki` — 知識圖譜

**戰略重要性：** ⭐⭐⭐ 最高

Wiki-style 知識圖譜（GraphNode / GraphEdge）是 Xuanwu 差異於一般文件工具的核心特性，提供知識之間的結構性關聯，支援 Backlink 與 Graph Traversal。

**為何是核心域：**
- 知識圖譜可視化是產品的核心視覺記憶點
- 自動連結（AutoLink）是 AI 輔助知識組織的核心能力
- 圖譜遍歷是未來 AI 推理的結構基礎

**模組：** `modules/wiki/`

---

## 三、支援子域（Supporting Subdomain）

支援子域對核心域的運作不可或缺，但不直接體現產品差異化。

### `ai` — AI 攝入管線

**職責：** 管理 IngestionJob 的完整生命週期（uploaded → parsing → embedding → indexed），協調 `py_fn/` Python worker 的執行。

**為何是支援域：** 攝入管線是核心 RAG 能力的基礎設施，重要但可被同類系統替換。

**模組：** `modules/ai/`

---

### `notebook` — AI 對話生成

**職責：** 管理對話 Thread / Message，提供 GenerateNotebookResponse 介面，封裝 Genkit AI 模型呼叫。

**模組：** `modules/notebook/`

---

### `search` — RAG 語意檢索

**職責：** 向量搜尋（VectorStore port）、RAG answer 生成、RagQueryFeedback 收集，提供 Wiki RAG 查詢介面。

**模組：** `modules/search/`

---

### `source` — 文件來源管理

**職責：** 檔案上傳生命週期（upload-init / upload-complete）、版本快照（FileVersion）、保留政策（RetentionPolicy）、RAG 文件登記（RagDocument）、WikiLibrary 集合管理。

**模組：** `modules/source/`

---

### `workspace-flow` — 工作流程狀態機

**職責：** Task / Issue / Invoice 三條業務線的狀態轉換機、守衛規則、Process Manager（ContentToWorkflowMaterializer）。

**模組：** `modules/workspace-flow/`

---

### `workspace-scheduling` — 工作需求排程

**職責：** WorkDemand 建立與狀態管理（draft → open → in_progress → completed），提供日曆視圖與截止日期追蹤。

**模組：** `modules/workspace-scheduling/`

---

### `workspace-audit` — 稽核紀錄

**職責：** Append-only 稽核記錄查詢，工作區與組織範圍的稽核可見性。

**模組：** `modules/workspace-audit/`

---

### `workspace-feed` — 工作區動態牆

**職責：** WorkspaceFeedPost 建立（post / reply / repost），互動記錄（like / view / bookmark / share），提供工作區社交動態流。

**模組：** `modules/workspace-feed/`

---

## 四、通用子域（Generic Subdomain）

通用子域是「每個系統都需要」的基礎能力，優先採用現成方案，最小化定制。

### `identity` — 身份驗證

**職責：** Firebase Authentication 的 domain 封裝，signIn / signOut / token 刷新。

**通用性：** OAuth/Firebase Auth 是業界標準，無差異化空間。

**模組：** `modules/identity/`

---

### `account` — 帳戶與個人設定

**職責：** Account profile 管理、AccountPolicy 存取控制策略、custom claims 更新。

**模組：** `modules/account/`

---

### `organization` — 組織（多租戶）

**職責：** Organization 建立、MemberReference 管理、Team 分組、PartnerInvite 邀請流程。

**模組：** `modules/organization/`

---

### `workspace` — 工作區容器

**職責：** Workspace 建立/歸檔、WorkspaceMember 管理、WikiContentTree 樹狀結構、Wiki 工作區關聯。

**模組：** `modules/workspace/`

---

### `notification` — 通知

**職責：** 系統通知分發（info / alert / success / warning），支援 push 與 in-app 通知。

**模組：** `modules/notification/`

---

### `shared` — 共享核心

**職責：** 跨模組共用的基礎型別（EventRecord、DomainEvent base、Slug 工具）。不是一個完整的業務域，是 IDDD 的 **Shared Kernel** 模式。

**模組：** `modules/shared/`

---

## 五、子域分類摘要表

| 子域 | 分類 | 模組 | 戰略重要性 |
|------|------|------|-----------|
| 知識內容管理 | **Core** | `knowledge` | ⭐⭐⭐ |
| 知識圖譜 | **Core** | `wiki` | ⭐⭐⭐ |
| AI 攝入管線 | Supporting | `ai` | ⭐⭐ |
| AI 對話生成 | Supporting | `notebook` | ⭐⭐ |
| RAG 語意檢索 | Supporting | `search` | ⭐⭐ |
| 文件來源管理 | Supporting | `source` | ⭐⭐ |
| 工作流程狀態機 | Supporting | `workspace-flow` | ⭐⭐ |
| 工作需求排程 | Supporting | `workspace-scheduling` | ⭐ |
| 稽核紀錄 | Supporting | `workspace-audit` | ⭐ |
| 工作區動態牆 | Supporting | `workspace-feed` | ⭐ |
| 身份驗證 | Generic | `identity` | — |
| 帳戶設定 | Generic | `account` | — |
| 組織多租戶 | Generic | `organization` | — |
| 工作區容器 | Generic | `workspace` | — |
| 通知 | Generic | `notification` | — |
| 共享核心 | Generic (Shared Kernel) | `shared` | — |

---

## 架構參考

- 詳細邊界定義：[`bounded-contexts.md`](./bounded-contexts.md)
- 通用語言根文件：`docs/architecture/ubiquitous-language.md`
- 上下文關係圖：`docs/architecture/context-map.md`
