# 系統全局規格（System Overview Specification）

> **規格文件類型**：本文件描述 Xuanwu 的產品定位、目標用戶、核心能力、 bounded-context 拓樸、整合方式與運行時邊界。

---

## 1. 系統定位

Xuanwu 是一個面向個人與組織協作的 Knowledge Platform。它的產品目標是把分散的文件、筆記、知識頁面、知識庫文章、結構化資料與外部來源整合進同一個可治理的工作區系統，讓知識不只被保存，還能被驗證、檢索、推理，並進一步轉化為可執行的工作成果。

系統採用 Modular Monolith 的 Module-Driven Domain Design 架構，以 `knowledge` 與 `knowledge-base` 為核心域，透過 `workspace` 與 `organization` 建立治理與協作邊界，並以 `source`、`ai`、`search`、`notebook` 等支援域建立從外部內容攝入到檢索與研究生成的完整閉環。

### 1.1 核心價值主張

| 面向 | 價值 |
|---|---|
| **知識沉澱** | 以頁面、區塊、文章、資料庫與來源集合沉澱知識資產 |
| **知識治理** | 透過工作區、組織、審批、驗證、權限與稽核建立可治理性 |
| **語意檢索** | 透過 ingestion、chunking、indexing 與 retrieval 建立可追溯查詢能力 |
| **研究與生成** | 在 notebook 工作流中支援 ask/cite、摘要、洞察與知識生成 |
| **知識落地執行** | 將知識進一步轉化為工作流程、排程、動態與協作執行成果 |

---

## 2. 目標用戶

| 用戶類型 | 說明 | 核心需求 |
|---|---|---|
| **個人知識工作者** | 以個人帳號管理內容、來源與 AI 研究流程 | 頁面管理、來源整理、問答、摘要、知識生成 |
| **組織協作者** | 在組織帳號與工作區中共同維護知識與執行流程 | 共享知識、工作區協作、文章驗證、檢索與引用 |
| **組織管理員** | 負責成員、權限、治理與稽核可見性 | 組織管理、權限設定、稽核追查、政策治理 |

---

## 3. 核心能力

### 3.1 核心知識域

| 能力 | 說明 | Owner |
|---|---|---|
| Knowledge Pages | Notion-like 頁面、區塊、版本、審批與內容生命週期 | `knowledge` |
| Knowledge Base | 組織級 wiki / SOP / article 與分類樹、驗證狀態 | `knowledge-base` |
| Knowledge Collaboration | 留言、權限、版本快照 | `knowledge-collaboration` |
| Knowledge Database | 結構化資料庫、record、view、relation | `knowledge-database` |

### 3.2 來源、檢索與推理

| 能力 | 說明 | Owner |
|---|---|---|
| Source Ingestion | 外部文件、附件、來源集合與 ingestion handoff | `source` |
| AI Ingestion Pipeline | job 管理、chunk/index 準備與 worker handoff | `ai` |
| Semantic Search | retrieval、citation context、查詢品質回饋 | `search` |
| Notebook Workflow | ask/cite、摘要、研究、知識生成流程 | `notebook` |

### 3.3 協作與治理

| 能力 | 說明 | Owner |
|---|---|---|
| Identity & Account | 身份、token lifecycle、帳戶語意與個人化 | `identity`, `account` |
| Organization Governance | 組織、團隊、成員與租戶治理 | `organization` |
| Workspace Container | 工作區、工作區成員與模組組裝邊界 | `workspace` |
| Workspace Feed | 工作區動態與互動可見性 | `workspace-feed` |
| Workspace Flow | Task / Issue / Invoice 狀態機與知識物化流程 | `workspace-flow` |
| Workspace Scheduling | 排程、需求、容量協調 | `workspace-scheduling` |
| Workspace Audit | append-only 稽核軌跡 | `workspace-audit` |
| Notification | 通知偏好與輸出訊號 | `notification` |

---

## 4. 架構規格

### 4.1 Bounded Context 模型

Xuanwu 由多個具明確邊界的 bounded context 組成。每個 context 都擁有自己的 ubiquitous language、domain model、application use cases 與 infrastructure adapters。跨 context 溝通只允許透過以下兩種方式：

1. 目標 context 的 public `api/` surface
2. Published Domain Events 與其他明確事件契約

### 4.2 當前上下文分類

| 類別 | Contexts |
|---|---|
| **Core Domain** | `knowledge`, `knowledge-base` |
| **Supporting Subdomain** | `ai`, `knowledge-collaboration`, `knowledge-database`, `notebook`, `search`, `source`, `workspace-audit`, `workspace-feed`, `workspace-flow`, `workspace-scheduling` |
| **Generic Subdomain** | `identity`, `account`, `organization`, `workspace`, `notification` |
| **Shared Kernel** | `shared` |

完整地圖請見 [../../ddd/bounded-contexts.md](../../ddd/bounded-contexts.md)。

### 4.3 運行時邊界

| 運行時 | 職責 | 技術 |
|---|---|---|
| **Next.js** | UI、auth/session orchestration、route composition、Server Actions、workspace-scoped interaction flow | Next.js 16, React 19, TypeScript |
| **py_fn** | parsing、chunking、embedding、背景 ingestion 工作 | Python worker runtime |

### 4.4 Anti-Corruption Boundary

外部內容來源不直接寫入核心域模型。外部文件、第三方資料來源、AI/infra 服務契約，必須透過 `source` workflow 與各 bounded context 的 infrastructure adapters 轉譯後再進入系統，避免外部概念污染核心知識模型。

---

## 5. 整合方式

| 整合類型 | 說明 |
|---|---|
| Firebase | auth、firestore、storage 與 app hosting/integration capability |
| Python worker | 文件解析、chunking、embedding、worker-side pipeline |
| AI orchestration | Genkit 與相關模型/flow capability |
| Search / vector infrastructure | 語意檢索、citation context 與 retrieval support |

---

## 6. 系統級驗收目標

| 代號 | 標準 |
|---|---|
| S1 | 使用者可登入並進入 workspace-first shell |
| S2 | 使用者可建立或切換個人/組織帳號與工作區 |
| S3 | 使用者可建立知識頁面、文章、資料庫與來源集合 |
| S4 | 來源內容可經 ingestion pipeline 進入可檢索狀態 |
| S5 | ask/cite 或 notebook workflow 可回傳 answer 與 traceable citations |
| S6 | 管理員可治理組織成員、權限、稽核與工作區範圍 |
| S7 | 知識可進一步物化為 workflow、schedule、feed 等執行層結果 |
