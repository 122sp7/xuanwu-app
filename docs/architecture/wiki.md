---
title: Wiki architecture
description: Target architecture for the Wiki module — modern enterprise knowledge hub with sidebar navigation, organization knowledge, workspace knowledge, and full RAG pipeline integration.
---

# Wiki 現代知識中樞架構規範

> **文件編號**：XUANWU-WIKI-SPEC-001
> **適用系統**：xuanwu-app — 現代型企業知識中樞
> **版本**：v1.0.0
> **最後更新**：2026-03-20
> **維護責任方**：Wiki Module Owner / 平台架構委員會

---

## 0. 目前已上線範圍

目前已上線的是 Wiki UI stub，作為後續完整知識中樞實作的入口：

- **Wiki 頁面 stub**：`app/(shell)/wiki/page.tsx`
  - 功能：靜態框架（首頁 / 工作區 / 共用 / 私人 / 封存）
  - 尚無真實持久化，無側邊欄知識節點
- **Knowledge 模組**：`modules/knowledge/`
  - 目前以 read-side summary 呈現 organization 與 workspace 層級知識狀況
  - Organization 知識：`modules/knowledge/interfaces/components/OrganizationKnowledgeTab.tsx`
  - Workspace 知識：`modules/knowledge/interfaces/components/WorkspaceKnowledgeTab.tsx`
- **知識庫架構**：`docs/architecture/knowledge.md`
- **知識庫契約**：`docs/reference/development-contracts/knowledge-contract.md`

### 0.1 本輪交付目標

本輪先在 `docs/` 建立完整 Wiki 設計文件：

| 文件 | 路徑 |
|------|------|
| 架構設計（本文件） | `docs/architecture/wiki.md` |
| 開發契約 | `docs/reference/development-contracts/wiki-contract.md` |
| 開發指南 | `docs/wiki/development-guide.md` |
| 使用手冊 | `docs/wiki/user-manual.md` |

### 0.2 本輪不在交付範圍

- Wiki 頁面的真實持久化（Firestore `wiki_pages` 集合）
- Organization / Workspace Knowledge 往 Wiki 側邊欄的完整遷移 UI
- 真正的 RAG 全流程（向量搜尋 + LLM 回答生成）
- Wiki 協作編輯（多人同步）
- Wiki 版本歷史 UI

---

## 1. 核心設計原則

| 原則 | 說明 |
|------|------|
| **知識中樞化** | Wiki 是整個組織的企業知識庫入口，不僅是筆記工具 |
| **知識遷移** | Organization Knowledge 與 Workspace Knowledge 皆透過 Wiki 側邊欄呈現 |
| **RAG 驅動** | 所有知識文件均可進入 RAG 全流程，支援語意搜尋與 AI 回答生成 |
| **多層知識範圍** | Organization 層（企業級）/ Workspace 層（專案級）/ Private 層（個人） |
| **Firestore 雙角色** | Firestore 同時承擔結構化 DB 與向量 DB 職責（中小型系統最適） |
| **Genkit 編排** | AI 流程透過 Genkit Flow 統一編排，不散落在 UI 或 repository 層 |

---

## 2. Wiki 整體架構

### 2.1 模組邊界

```
app/(shell)/wiki/
    ↓ (page rendering + layout)
modules/wiki/
├── domain/           ← Wiki 頁面實體 / 知識節點 / ports
├── application/      ← 新增頁面 / 查詢頁面 / 知識遷移 use-cases
├── infrastructure/   ← Firestore adapters (wiki_pages, knowledge_nodes)
└── interfaces/       ← Server Actions / queries / React components（含側邊欄）

modules/knowledge/    ← 知識文件 / RAG pipeline 資料模型（現有）
modules/ai/           ← Genkit Flow 編排（RAG query pipeline）
lib/firebase/functions-python/  ← Cloud Functions（ingestion worker）
```

### 2.2 側邊欄知識節點架構

Wiki 側邊欄分為三個知識層次：

```
Wiki 側邊欄
├── 📌 首頁
├── 🏢 組織知識庫 (Organization Knowledge)
│   ├── 跨工作區文件總覽
│   ├── 分類瀏覽 (taxonomy)
│   └── 快速 RAG 搜尋入口
├── 🗂️ 工作區知識 (Workspace Knowledge)
│   ├── [工作區 A] 文件清單
│   ├── [工作區 B] 文件清單
│   └── ...
├── 📝 Wiki 頁面
│   ├── 共用頁面
│   └── 私人頁面
└── 🗑️ 封存
```

---

## 3. 全流程企業 RAG 架構

### 3.1 Ingestion Pipeline（資料進來）

```
[Next.js 上傳檔案]
        ↓
[Firebase Storage（raw file）]
        ↓
[Firestore 建立文件 metadata（status: uploaded）]
        ↓
[Cloud Functions (Python) 觸發]
        ↓
[下載檔案 / 讀取]
        ↓
[Parsing（PDF / DOCX / HTML → text）]
        ↓
[Cleaning（normalize / 去雜訊）]
        ↓
[Document-level Taxonomy（整份文件分類）]
        ↓
[Structuring（chunk 切分）]
        ↓
[Chunk-level Metadata（docId / chunkId / taxonomy / page / tags）]
        ↓
[Embedding（每個 chunk 向量化）]
        ↓
[Firestore（chunks collection + embedding）]
        ↓
[建立 Vector Index（Firestore vector index）]
        ↓
[更新文件狀態：ready]
```

### 3.2 Query Pipeline（查詢 / RAG）

```
[Next.js（User Query）]
        ↓
[Route Handler / Server Action]
        ↓
[Genkit Flow（Query Preprocess）]
        ↓
[Query Embedding]
        ↓
[Firestore Vector Search（Top-K + filter taxonomy）]
        ↓
[取得 Top-K chunks]
        ↓
[Context 組裝（prompt building）]
        ↓
[Genkit LLM（回答生成）]
        ↓
[Streaming 回傳（Next.js UI）]
```

### 3.3 Optional 強化（企業必備）

| 強化項目 | 說明 | 優先級 |
|----------|------|--------|
| Hybrid Search | Vector Search + Keyword Search (BM25) → re-rank | P1 |
| Re-ranking | Cross-Encoder / LLM rerank → Top-N 精排 | P1 |
| Cache | Query Hash → Firestore / Redis Cache，命中直接回應 | P2 |
| Feedback Loop | 👍👎 寫入 Firestore，調整 ranking / prompt | P2 |

---

## 4. Firestore 資料結構

### 4.1 Wiki 頁面集合 (`wiki_pages`)

**Collection Path**：`/wiki_pages/{organizationId}/pages/{pageId}`

| 欄位名 | 類型 | 必填 | 說明 |
|--------|------|------|------|
| `pageId` | `string` | ✅ | UUID v4 |
| `organizationId` | `string` | ✅ | 所屬組織 |
| `workspaceId` | `string` | ❌ | 所屬工作區（null = 組織層） |
| `title` | `string` | ✅ | 頁面標題 |
| `content` | `string` | ❌ | 頁面內容（Markdown） |
| `scope` | `"organization" \| "workspace" \| "private"` | ✅ | 知識範疇 |
| `parentPageId` | `string` | ❌ | 父頁面 ID（階層結構） |
| `order` | `number` | ✅ | 側邊欄排序 |
| `isArchived` | `boolean` | ✅ | 是否封存 |
| `createdBy` | `string` | ✅ | 建立者 accountId |
| `createdAtISO` | `string` | ✅ | ISO-8601 |
| `updatedAtISO` | `string` | ✅ | ISO-8601 |

### 4.2 知識文件集合（沿用 knowledge 模組）

沿用 `docs/architecture/knowledge.md` 定義的資料結構：

| Collection Path | 說明 |
|-----------------|------|
| `/knowledge_base/{organizationId}/workspaces/{workspaceId}/documents/{documentId}` | 文件 metadata + 狀態 |
| `/knowledge_base/{organizationId}/workspaces/{workspaceId}/chunks/{chunkId}` | 切塊 + embedding vector |

### 4.3 RAG 關鍵欄位（chunks）

| 欄位名 | 用途 |
|--------|------|
| `embedding` | 🔥 向量搜尋 |
| `taxonomy` | 🔥 過濾用分類 |
| `organizationId` | 組織隔離 |
| `workspaceId` | 工作區隔離 |
| `isLatest` | 排除廢棄版本 |

---

## 5. 關鍵技術觀念

### 5.1 Taxonomy（分類）
- 在 Parsing 後、Chunking 前於 document-level 標注
- 繼承至每個 chunk，供 Vector Search 過濾用
- 分類表由組織管理員統一維護

### 5.2 Embedding
- 在 ingestion 階段計算（一次性成本）
- 使用 Genkit 整合的嵌入模型（如 `text-embedding-3-small`）
- 維度資訊記錄於 `embeddingModel` 欄位

### 5.3 Vector Search
- 在 query 階段執行（每次查詢）
- 透過 Firestore Vector Search（中小型，`organizationId` + `isLatest` 過濾）
- 大規模可遷移至 Pinecone / Vertex AI Vector Search

### 5.4 Firestore 雙角色
- 作為結構化 DB：儲存 wiki_pages / documents metadata
- 作為 Vector DB：儲存 chunks + embedding（中小型系統最適）

### 5.5 Genkit 角色
- Flow orchestration：Ingestion + Query 流程統一編排
- LLM 呼叫：回答生成
- Tool calling：搜尋工具 / 日誌工具

---

## 6. 模組結構（目標）

```
modules/wiki/
├── domain/
│   ├── entities/
│   │   ├── WikiPage.ts          # 頁面實體
│   │   └── KnowledgeNode.ts     # 知識節點（側邊欄節點）
│   ├── repositories/
│   │   ├── WikiPageRepository.ts
│   │   └── KnowledgeNodeRepository.ts
│   └── index.ts
├── application/
│   └── use-cases/
│       ├── create-wiki-page.use-case.ts
│       ├── list-wiki-sidebar.use-case.ts
│       ├── get-organization-knowledge-nodes.use-case.ts
│       └── get-workspace-knowledge-nodes.use-case.ts
├── infrastructure/
│   └── firebase/
│       ├── FirebaseWikiPageRepository.ts
│       └── FirebaseKnowledgeNodeRepository.ts
├── interfaces/
│   ├── _actions/
│   │   └── wiki-page.actions.ts
│   ├── queries/
│   │   └── wiki.queries.ts
│   └── components/
│       ├── WikiSidebar.tsx           # 🔑 側邊欄（組織 + 工作區知識節點）
│       ├── WikiPageView.tsx          # 頁面內容
│       └── WikiKnowledgeSearch.tsx   # RAG 搜尋 UI
└── index.ts
```

---

## 7. 一句話總結

```
資料進來：Parsing → Taxonomy → Chunk → Embedding → 存 Firestore

使用者發問：Query → Embedding → Vector Search → LLM 回答

Wiki 側邊欄：Organization Knowledge + Workspace Knowledge → 統一知識入口
```

---

## 8. 變更記錄

| 版本 | 日期 | 變更說明 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-03-20 | 初版建立，涵蓋 Wiki 目標架構、RAG 全流程、Firestore 資料結構、模組結構規劃 | xuanwu-app 架構委員會 |
