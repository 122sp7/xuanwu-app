# Subdomains — Xuanwu App

> **理論依據：** Vaughn Vernon《Implementing Domain-Driven Design》第 2 章 Strategic Design  
> **產品定位：** Xuanwu 是一個以知識為核心的 Knowledge Platform / Second Brain。

本文件將 Xuanwu App 的能力劃分為 **Core Domain**、**Supporting Subdomain** 與 **Generic Subdomain / Shared Kernel**，用於指導投資順序、建模深度與邊界嚴格度。

---

## 分類原則

| 分類 | 定義 | 投資策略 |
|---|---|---|
| **Core Domain** | 直接承載產品差異化價值 | 最高投入、精細建模、優先保護語言與聚合邊界 |
| **Supporting Subdomain** | 支撐核心價值落地，但不是產品獨特賣點 | 務實建模、重視整合與可靠性 |
| **Generic Subdomain** | 常見平台能力，偏向商品化 | 優先封裝現成方案、最小必要客製化 |
| **Shared Kernel** | 多個上下文共同依賴的穩定共享核心 | 嚴格控制變更、避免膨脹為隱性大模組 |

---

## Core Domain

### `knowledge` — 知識內容管理

Xuanwu 的第一核心域。它承擔 Notion-like 的知識建立、編輯、版本化與審批流程，是使用者最直接感知的產品價值。

**為何是核心域：**
- 承載 Knowledge Page / Block Editor 的主體體驗
- 決定知識如何被保存、版本化、審批與再利用
- `knowledge.page_approved` 是整個平台向下游協作擴散的關鍵事件

### `knowledge-base` — 組織知識庫 / Wiki / SOP

Xuanwu 的第二核心域。負責組織或團隊級別的公開知識文章管理，支援層級分類、Backlink、SOP 文件與頁面驗證機制。

**為何是核心域：**
- 承載組織知識的可信度、可發現性與共享體驗
- `VerificationState` 機制讓知識庫保持準確性品質
- 與 `knowledge`（個人筆記）共同構成平台的知識差異化壁壘

---

## Supporting Subdomains

### `knowledge-collaboration`
負責知識協作基礎設施：留言討論（Comment）、細粒度存取控制（Permission）、版本快照（Version）。不擁有知識內容，透過 `contentId` 與內容 BC 協作。

### `knowledge-database`
提供結構化資料庫能力（Database / Record / View）。對應 Notion Database，支援 Table / Board / Calendar / Timeline / Gallery 等多視圖展示，並透過 Relation 欄位建立資料關聯。

### `source`
負責接入外部文件、上傳與來源登記，是知識進入平台的入口。

### `ai`
負責攝入 job 與 worker handoff，確保來源文件可以被解析、切塊、向量化並交付檢索層。

### `search`
負責語意檢索、引用與 RAG 查詢，是 AI 問答品質的基礎支撐。

### `notebook`
負責以 NotebookLM-like 互動方式把檢索結果轉成摘要、回答、洞察與對話經驗。

### `workspace-flow`
負責把知識內容轉成可執行的任務、問題與發票流程，讓知識平台可進一步驅動協作執行。

### `workspace-scheduling`
負責工作需求與排程，將協作項目放入時間與容量視角管理。

### `workspace-audit`
負責 append-only 稽核可見性，確保工作區與組織範圍內的重要行為可追溯。

### `workspace-feed`
負責工作區動態流與互動紀錄，提升知識協作的可見性與社交流動。

---

## Generic Subdomains / Shared Kernel

### `identity`
封裝身份驗證與 session 起點，屬於標準平台能力。

### `account`
承接個人檔案、偏好與帳戶政策，是 identity 之上的個人化設定層。

### `organization`
提供多租戶組織、成員與團隊治理，是平台級協作基礎。

### `workspace`
提供工作區容器、成員與內容樹，是所有知識與協作能力的歸屬邊界。

### `notification`
負責通知與提醒分發，屬典型平台配套能力。

### `shared`
作為 Shared Kernel，提供跨模組穩定共享的事件、值物件與基礎型別，不承載單一業務流程。

---

## 子域分類總表

| Context | 分類 | 主要價值 |
|---|---|---|
| `knowledge` | **Core** | 個人筆記 Page + Block 生命週期 |
| `knowledge-base` | **Core** | 組織知識庫 Article + Category + 驗證機制 |
| `knowledge-collaboration` | Supporting | Comment / Permission / Version 協作基礎 |
| `knowledge-database` | Supporting | Database / Record / View 結構化資料 |
| `source` | Supporting | 文件接入與來源治理 |
| `ai` | Supporting | 攝入管線協調與 worker handoff |
| `search` | Supporting | 語意檢索與 RAG |
| `notebook` | Supporting | 摘要、問答、洞察互動 |
| `workspace-flow` | Supporting | Task / Issue / Invoice 流程 |
| `workspace-scheduling` | Supporting | 排程與時間容量管理 |
| `workspace-audit` | Supporting | 稽核與追溯 |
| `workspace-feed` | Supporting | 工作區動態與互動 |
| `identity` | Generic | 身份驗證 |
| `account` | Generic | 個人帳戶與偏好 |
| `organization` | Generic | 多租戶治理 |
| `workspace` | Generic | 協作容器 |
| `notification` | Generic | 通知分發 |
| `shared` | Shared Kernel | 穩定共享核心 |

---

## 架構參考

- 邊界與整合：[`bounded-contexts.md`](./bounded-contexts.md)
- 各 BC 詳細文件：`docs/ddd/<context>/README.md`
- 通用語言：各 bounded context 的 `ubiquitous-language.md`
- 上下文關係圖：各 bounded context 的 `context-map.md`
