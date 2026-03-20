---
title: Wiki module development guide
description: Developer guide for contributing to the wiki module — module structure, adding wiki pages, knowledge sidebar wiring, RAG pipeline integration, and testing patterns.
---

# Wiki 模組開發指南

> **文件版本**：v1.0.0
> **最後更新**：2026-03-20
> **目標讀者**：參與 `modules/wiki` 實作的後端/全端工程師

---

## 前置閱讀

在開始任何 Wiki 相關功能前，請先閱讀：

1. **架構規範**：`docs/architecture/wiki.md`
2. **開發契約**：`docs/reference/development-contracts/wiki-contract.md`
3. **知識庫架構**：`docs/architecture/knowledge.md`
4. **整體架構指南**：`ARCHITECTURE.md`

---

## 1. 模組結構（目標）

```
modules/wiki/
├── domain/
│   ├── entities/
│   │   ├── WikiPage.ts           # 頁面實體
│   │   └── KnowledgeNode.ts      # 側邊欄知識節點
│   ├── repositories/
│   │   ├── WikiPageRepository.ts      # port interface
│   │   └── KnowledgeNodeRepository.ts # port interface
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
│   │   └── wiki-page.actions.ts   # "use server" — Next.js Server Actions
│   ├── queries/
│   │   └── wiki.queries.ts        # 查詢函式
│   └── components/
│       ├── WikiSidebar.tsx         # 🔑 側邊欄（組織 + 工作區知識）
│       ├── WikiPageView.tsx        # 頁面內容渲染
│       └── WikiKnowledgeSearch.tsx # RAG 搜尋 UI
├── index.ts                        # 模組公開 API
└── README.md
```

### 依賴方向（嚴格）

```
interfaces (actions / queries / components)
    ↓
application (use-cases)
    ↓
domain (entities / ports)
    ↑
infrastructure (Firestore adapters)
```

> ❗ 禁止 domain 直接 import infrastructure，禁止 application 直接 import UI 元件。

---

## 2. 新增 Wiki 頁面

### 2.1 Domain entity

在 `modules/wiki/domain/entities/WikiPage.ts` 定義實體：

```typescript
export type WikiPageScope = "organization" | "workspace" | "private";

export type WikiPageStatus = "draft" | "published" | "archived";

export interface WikiPage {
  pageId: string;
  organizationId: string;
  workspaceId: string | null;
  title: string;
  content: string;
  scope: WikiPageScope;
  status: WikiPageStatus;
  parentPageId: string | null;
  order: number;
  isArchived: boolean;
  createdBy: string;
  createdAtISO: string;
  updatedAtISO: string;
}
```

### 2.2 Port interface

在 `modules/wiki/domain/repositories/WikiPageRepository.ts` 定義 port：

```typescript
import type { WikiPage } from "../entities/WikiPage";

export interface WikiPageRepository {
  create(page: Omit<WikiPage, "pageId" | "createdAtISO" | "updatedAtISO">): Promise<WikiPage>;
  findById(pageId: string): Promise<WikiPage | null>;
  listByOrganization(organizationId: string): Promise<WikiPage[]>;
  listByWorkspace(organizationId: string, workspaceId: string): Promise<WikiPage[]>;
  update(pageId: string, patch: Partial<Pick<WikiPage, "title" | "content" | "status" | "order">>): Promise<void>;
  archive(pageId: string): Promise<void>;
}
```

### 2.3 Use case

在 `modules/wiki/application/use-cases/create-wiki-page.use-case.ts`：

```typescript
import type { WikiPageRepository } from "@/modules/wiki/domain/repositories/WikiPageRepository";
import type { WikiPage } from "@/modules/wiki/domain/entities/WikiPage";

export async function createWikiPageUseCase(
  repo: WikiPageRepository,
  input: {
    organizationId: string;
    workspaceId: string | null;
    title: string;
    scope: WikiPage["scope"];
    createdBy: string;
  }
): Promise<WikiPage> {
  return repo.create({
    ...input,
    content: "",
    status: "draft",
    parentPageId: null,
    order: 0,
    isArchived: false,
  });
}
```

### 2.4 Infrastructure adapter

在 `modules/wiki/infrastructure/firebase/FirebaseWikiPageRepository.ts` 實作 port，使用 `@/infrastructure/firebase` 的 Firestore SDK：

```typescript
import { db } from "@/infrastructure/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// ...實作 WikiPageRepository interface
```

Firestore collection path：`/wiki_pages/{organizationId}/pages/{pageId}`

### 2.5 Server Action

在 `modules/wiki/interfaces/_actions/wiki-page.actions.ts`：

```typescript
"use server";

import { createWikiPageUseCase } from "@/modules/wiki/application/use-cases/create-wiki-page.use-case";
// ...inject infrastructure adapter, call use case, return result
```

---

## 3. Wiki 側邊欄（知識節點）

### 3.1 知識節點來源

側邊欄的知識節點來自兩個來源，通過 use cases 聚合：

| 來源 | Use Case | Firestore 集合 |
|------|----------|---------------|
| Organization knowledge docs | `getOrganizationKnowledgeNodes` | `/knowledge_base/{orgId}/workspaces/*/documents` |
| Workspace knowledge docs | `getWorkspaceKnowledgeNodes` | `/knowledge_base/{orgId}/workspaces/{wsId}/documents` |
| Wiki pages | `listWikiSidebar` | `/wiki_pages/{orgId}/pages` |

### 3.2 WikiSidebar 元件職責

`modules/wiki/interfaces/components/WikiSidebar.tsx`：

- 透過 `wiki.queries.ts` 讀取 `KnowledgeNode[]` 清單
- 渲染三個區塊：
  1. 🏢 **組織知識庫**：cross-workspace 文件 + RAG 搜尋入口
  2. 🗂️ **工作區知識**：依工作區分組的文件節點
  3. 📝 **Wiki 頁面**：共用 / 私人 / 封存
- 每個節點點擊後導覽至對應頁面或展開 drawer

### 3.3 遷移指引

現有的兩個 Tab 元件將逐步遷移至側邊欄：

| 現有元件 | 遷移目標 | 遷移方式 |
|----------|----------|----------|
| `OrganizationKnowledgeTab` | WikiSidebar 組織知識庫區塊 | 將查詢邏輯移至 `getOrganizationKnowledgeNodes` use case |
| `WorkspaceKnowledgeTab` | WikiSidebar 工作區知識區塊 | 將查詢邏輯移至 `getWorkspaceKnowledgeNodes` use case |

遷移時保持現有 Tab 正常運作（不直接刪除），待側邊欄驗收後再移除舊元件。

---

## 4. RAG 管線整合

### 4.1 Ingestion Pipeline（資料進來）

Ingestion 由 `lib/firebase/functions-python` 中的 Cloud Functions 處理，與 wiki 模組的介接點：

1. **觸發點**：`modules/file` 上傳成功後，在 Firestore `documents/{docId}` 建立 `status: "uploaded"` 記錄
2. **Cloud Functions 監聽** `documents` onCreate 事件，開始 Parsing → Chunking → Embedding
3. **狀態回寫**：Cloud Functions 更新 `documents/{docId}.status = "ready"` 並寫入 `chunks`
4. **Wiki 側邊欄感知**：`getOrganizationKnowledgeNodes` / `getWorkspaceKnowledgeNodes` 查詢時，`status = "ready"` 的文件才顯示為可搜尋節點

### 4.2 RAG 查詢（Query Pipeline）

查詢 flow 由 `modules/ai` 的 Genkit Flow 處理：

```
WikiKnowledgeSearch.tsx (用戶輸入)
    ↓
wiki-page.actions.ts (Server Action: "use server")
    ↓
modules/ai → Genkit Flow (queryKnowledgeFlow)
    ↓
Query Embedding → Firestore Vector Search
    ↓
Top-K chunks 組裝 prompt
    ↓
Genkit LLM → streaming 回傳
    ↓
WikiKnowledgeSearch.tsx (串流顯示)
```

### 4.3 必填查詢過濾

呼叫 `modules/ai` RAG flow 時，**必須**傳入：

```typescript
{
  organizationId: string;   // 組織隔離
  isLatest: true;           // 排除廢棄版本
  userRoles: string[];      // RBAC 過濾 (accessControl in userRoles)
  // 可選
  workspaceId?: string;
  taxonomy?: string;
  language?: string;
}
```

缺少任一必填參數，RAG flow 應拒絕執行並回傳 `400 Bad Request`。

### 4.4 RAG Checklist（ingestion 前確認）

依 `rag-pipeline` skill 提供的 checklist 確認：

```
來源類型：wiki page / knowledge document
所有者模組：modules/wiki / modules/knowledge
租戶可見性：organizationId + workspaceId（可選）

處理：
- 正規化規則：去除 HTML 標籤、段落合併、多餘空白清理
- chunking 策略：滑動視窗 512 tokens，50 tokens overlap
- metadata 欄位：docId, chunkIndex, taxonomy, page, organizationId, workspaceId, isLatest
- embedding 模型：text-embedding-3-small（記錄於 embeddingModel 欄位）
- 索引目標：Firestore chunks collection + vector index

Retrieval：
- 查詢入口：WikiKnowledgeSearch → Server Action → Genkit Flow
- 過濾：organizationId + isLatest + accessControl（必填）；taxonomy（選填）
- reranking：Cross-Encoder（P1 強化）
- citation：pageNumber + displayName
```

---

## 5. 常見問題與陷阱

| 問題 | 原因 | 解法 |
|------|------|------|
| 側邊欄顯示重複文件節點 | `isLatest` 未過濾，顯示了舊版 chunks | 確認 query 強制加 `isLatest: true` |
| RAG 查詢跨組織資料洩漏 | 缺少 `organizationId` 過濾 | use case 層強制注入 `organizationId` |
| Firestore Vector Search 沒有結果 | Vector index 尚未建立 | 執行 `firestore.indexes.json` 中定義的 vector index 建立指令 |
| Wiki 頁面新增後側邊欄未刷新 | Client Component 未訂閱 Firestore real-time | 在 `wiki.queries.ts` 使用 `onSnapshot` 或觸發 `router.refresh()` |
| Embedding 模型版本不一致 | 部分 chunks 用舊模型建立 | 每個 chunk 記錄 `embeddingModel`，查詢時過濾同一模型版本 |

---

## 6. 驗收標準

在進入下一個開發迭代之前，需通過以下驗收：

- [ ] `WikiPage` entity 與 `KnowledgeNode` entity TypeScript types 已定義
- [ ] `WikiSidebar` 元件渲染組織知識庫 + 工作區知識 + Wiki 頁面三個區塊
- [ ] `createWikiPage` Server Action 可建立 draft 頁面並寫入 Firestore
- [ ] `listWikiSidebar` query 回傳含組織知識節點的清單（`status: "ready"` 文件）
- [ ] RAG 搜尋入口在側邊欄可見，並可轉發查詢到 Genkit Flow（stub 可接受）
- [ ] `npm run lint && npm run build` 通過，無新增 TypeScript 型別錯誤

---

## 7. 相關文件

| 文件 | 路徑 |
|------|------|
| Wiki 架構規範 | `docs/architecture/wiki.md` |
| Wiki 開發契約 | `docs/reference/development-contracts/wiki-contract.md` |
| Wiki 使用手冊 | `docs/wiki/user-manual.md` |
| Knowledge 架構規範 | `docs/architecture/knowledge.md` |
| Knowledge 開發契約 | `docs/reference/development-contracts/knowledge-contract.md` |
| RAG Ingestion ADR | `docs/adr/ADR-005-rag-ingestion-execution-contract.md` |
| RAG Query ADR | `docs/adr/ADR-006-rag-query-execution-contract.md` |
