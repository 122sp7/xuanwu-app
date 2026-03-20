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

Ingestion 由 `libs/firebase/functions-python` 中的 Cloud Functions 處理，與 wiki 模組的介接點：

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

### 4.4 documentId 生成（Next.js 上傳端）

```typescript
// modules/file/application/services/generate-document-id.ts
import { v4 as uuidv4 } from "uuid";

/**
 * 生成 canonical documentId。
 * 規則：固定前綴 "doc_" + 16 位 hex = 20 chars。
 * 不可變：一旦寫入 Firestore，任何後續操作（rename/reprocess/version）都不得改變此 ID。
 */
export function generateDocumentId(): string {
  return `doc_${uuidv4().replace(/-/g, "").slice(0, 16)}`;
}

// 生成 Storage canonical path
export function buildStoragePath(params: {
  organizationId: string;
  workspaceId: string;
  documentId: string;
  extension: string;          // 含點，例如 ".pdf"
}): string {
  const { organizationId, workspaceId, documentId, extension } = params;
  return (
    `organizations/${organizationId}` +
    `/workspaces/${workspaceId}` +
    `/documents/${documentId}` +
    `/raw/source${extension}`
  );
}
```

**儲存路徑範例**：
```
organizations/org_abc/workspaces/ws_xyz/documents/doc_4b2a1c3d8e9f0a12/raw/source.pdf
organizations/org_abc/workspaces/ws_xyz/documents/doc_7c9e3f1a2b4d6e8f/raw/source.docx
```

衍生檔案（由 ingestion worker 寫入）：
```
.../documents/{documentId}/derived/normalized.md
.../documents/{documentId}/derived/layout.json
```

---

### 4.5 OpenAI Embedding API 呼叫（Python worker）

```python
# libs/firebase/functions-python/ingestion/embedding.py
import os
import time
import openai

OPENAI_EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
OPENAI_EMBEDDING_DIMENSIONS = 1536
OPENAI_BATCH_SIZE = 20          # 每批最多 20 個 chunk（避免超出 rate limit）
MAX_RETRY_ON_RATE_LIMIT = 5
MAX_RETRY_ON_SERVER_ERROR = 3

def embed_chunks_batch(texts: list[str]) -> list[list[float]]:
    """
    呼叫 OpenAI Embeddings API。
    - OPENAI_API_KEY 由 Cloud Functions secrets 注入。
    - 回傳 list[float[1536]]。
    """
    client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])

    for attempt in range(MAX_RETRY_ON_RATE_LIMIT):
        try:
            response = client.embeddings.create(
                model=OPENAI_EMBEDDING_MODEL,
                input=texts,
                dimensions=OPENAI_EMBEDDING_DIMENSIONS,
            )
            return [item.embedding for item in response.data]
        except openai.RateLimitError:
            if attempt == MAX_RETRY_ON_RATE_LIMIT - 1:
                raise
            time.sleep(2 ** attempt)   # exponential backoff: 1s, 2s, 4s, 8s, 16s
        except openai.APIStatusError as e:
            if e.status_code >= 500 and attempt < MAX_RETRY_ON_SERVER_ERROR - 1:
                time.sleep(2)
                continue
            raise

def embed_all_chunks(chunk_texts: list[str]) -> list[list[float]]:
    """批次嵌入，自動分批避免超出 API 限制。"""
    results = []
    for i in range(0, len(chunk_texts), OPENAI_BATCH_SIZE):
        batch = chunk_texts[i:i + OPENAI_BATCH_SIZE]
        results.extend(embed_chunks_batch(batch))
    return results
```

設置 API Key（Firebase CLI）：
```bash
firebase functions:secrets:set OPENAI_API_KEY
# 驗證：
firebase functions:secrets:access OPENAI_API_KEY
```

---

### 4.6 Firestore Vector Index 建立

`firestore.indexes.json` 中必須包含以下設定（在第一次 embedding 寫入前部署）：

```json
{
  "indexes": [
    {
      "collectionGroup": "chunks",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "organizationId", "order": "ASCENDING" },
        { "fieldPath": "isLatest",       "order": "ASCENDING" },
        { "fieldPath": "taxonomy",       "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": [
    {
      "collectionGroup": "chunks",
      "fieldPath": "embedding",
      "indexes": [],
      "vectorConfig": {
        "dimension": 1536,
        "flat": {}
      }
    }
  ]
}
```

部署索引：
```bash
firebase deploy --only firestore:indexes
```

> ❗ 若 vector index 尚未建立就執行 `findNearest()`，Firestore 會回傳錯誤。
> 請在 CI/CD pipeline 中確保 index 部署先於 ingestion worker 啟動。

---

### 4.7 Taxonomy 標注（Python worker）

```python
# libs/firebase/functions-python/ingestion/taxonomy.py
import openai

TAXONOMY_ENUM = [
    "规章制度", "技術文件", "產品手冊", "操作指南",
    "政策文件", "訓練教材", "研究報告", "其他",
]

def classify_taxonomy(text_excerpt: str) -> str:
    """
    使用 LLM 對整份文件的前 2000 字進行 taxonomy 分類。
    必須在 chunking 之前完成。
    """
    client = openai.OpenAI()
    prompt = (
        "請根據以下文件節錄，從下列分類中選擇最合適的一個，"
        f"只回傳分類名稱，不要解釋：\n分類：{', '.join(TAXONOMY_ENUM)}\n\n"
        f"文件節錄：\n{text_excerpt[:2000]}"
    )
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=20,
    )
    result = response.choices[0].message.content.strip()
    return result if result in TAXONOMY_ENUM else "其他"
```

---

### 4.8 RAG Checklist（ingestion 前確認）

依 `rag-pipeline` skill 提供的 checklist 確認：

```
來源類型：wiki page / knowledge document
所有者模組：modules/wiki / modules/knowledge
租戶可見性：organizationId + workspaceId（可選）

處理：
- 正規化規則：去除 HTML 標籤、段落合併、多餘空白清理
- chunking 策略：滑動視窗 512 tokens，50 tokens overlap
- taxonomy：由 LLM 在 chunking 前完成 document-level 分類（必填）
- embedding 模型：text-embedding-3-small（1536-dim，記錄於 embeddingModel 欄位）
- batch size：每批 ≤ 20 chunks
- 索引目標：Firestore chunks collection + vector index（維度 1536）

Retrieval：
- 查詢入口：WikiKnowledgeSearch → Server Action → Genkit Flow
- 必填過濾：organizationId + isLatest + accessControl
- 選填過濾：taxonomy, workspaceId, language
- reranking：Cross-Encoder（P1 強化）
- citation：pageNumber + displayName + taxonomy
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
| Wiki UI/UX 規格 | `docs/wiki/ui-ux.md` |
| Knowledge 架構規範 | `docs/architecture/knowledge.md` |
| Knowledge 開發契約 | `docs/reference/development-contracts/knowledge-contract.md` |
| RAG Ingestion ADR | `docs/adr/ADR-005-rag-ingestion-execution-contract.md` |
| RAG Query ADR | `docs/adr/ADR-006-rag-query-execution-contract.md` |

---

## 8. `core/wiki-core` 開發指引

> 本節專門對象：實作或加入 `core/wiki-core` 域層的工程師。
> 如果您只是使用 `@/core/wiki-core` export，請參考第 7 節並閱讀 wiki-contract.md。

### 8.1 專案目錄結構與依賴方向

```
core/wiki-core/
├── domain/                   ← 純 TypeScript，無任何框架 / SDK import
│   ├── entities/
│   │   ├── wiki-document.entity.ts              # WikiDocument class
│   │   └── workspace-knowledge-summary.entity.ts # WorkspaceKnowledgeSummary
│   ├── repositories/              # Domain ports（不含實作）
│   │   ├── iembedding.repository.ts
│   │   ├── iknowledge-summary.repository.ts
│   │   ├── iretrieval.repository.ts
│   │   └── iwiki-document.repository.ts
│   ├── services/
│   │   └── derive-knowledge-summary.ts          # 純函式
│   └── value-objects/
│       ├── access-control.vo.ts
│       ├── content-status.vo.ts
│       ├── embedding.vo.ts
│       ├── search-filter.vo.ts
│       ├── taxonomy.vo.ts
│       ├── usage-stats.vo.ts
│       ├── vector.vo.ts
│       └── wiki-document-summary.vo.ts
├── application/
│   └── use-cases/
│       ├── create-wiki-document.ts              # 骨架實作
│       └── get-workspace-knowledge-summary.use-case.ts
├── infrastructure/
│   ├── persistence/
│   │   ├── config.ts                            # Upstash env vars
│   │   ├── upstash-redis.ts
│   │   └── upstash-vector.ts
│   └── repositories/
│       └── upstash-wiki-document.repository.ts  # 骨架實作
├── interfaces/
│   └── api/
│       └── wiki.controller.ts                   # 骨架實作
└── index.ts                               # 全部公開 API export
```

**依賴方向（嚴格）**
```
interfaces (api / controller)
    ↓
application (use-cases)
    ↓
domain (entities / repositories / services / value-objects)
    ↑
infrastructure (persistence / repositories)
```

> ❗ 禁止 domain 直接 import infrastructure，禁止 application 直接 import UI 元件。
> 禁止 `core/wiki-core` import `@/modules/*`。

### 8.2 新増 Domain Entity / Value Object

**安全查核清單**

```bash
# 確認沒有 modules/* 依賴
npx grep -r "from '@/modules" core/wiki-core/
# 應輸出空白
```

**新嫝 value object 範例**

```typescript
// core/wiki-core/domain/value-objects/my-concept.vo.ts

export class MyConcept {
  constructor(public readonly value: string) {
    if (!value.trim()) throw new Error('MyConcept cannot be empty')
  }

  equals(other: MyConcept): boolean {
    return this.value === other.value
  }
}
```

完成後在 `index.ts` 新增 export：
```typescript
// 加入 Domain: Value Objects 區段
export { MyConcept } from './domain/value-objects/my-concept.vo'
```

### 8.3 完善 `CreateWikiDocumentUseCase`

目前骨架缺：ID 生成、taxonomy 標注、embedding 呼叫。以下為設計指引：

```typescript
export class CreateWikiDocumentUseCase {
  constructor(
    private readonly repo: IWikiDocumentRepository,
    private readonly embedder: IEmbeddingRepository,  // 待加入
  ) {}

  async execute(dto: CreateWikiDocumentDTO): Promise<WikiDocument> {
    // 1. 生成 documentId（doc_ + 16 hex—見 wiki-contract.md documentId 生成規則）
    const id = generateDocumentId()  // 'doc_' + crypto random 8 bytes hex

    // 2. Taxonomy 標注（如來自輸入，否則使用預設）
    const taxonomy = dto.taxonomy ?? new Taxonomy('技術文件', [], 'default')

    // 3. 建立實體
    const entity = new WikiDocument(id, dto.title, dto.content, 'DRAFT', new Date())

    // 4. 進行 embedding（非同步 via worker 或直接 API）
    const embedding = await this.embedder.embed({ text: dto.content, documentId: id })

    // 5. 儲存（必須包含 embedding.values 以律 vector index）
    await this.repo.save(entity)
    return entity
  }
}
```

### 8.4 實作 `OpenAIEmbeddingRepository`（TS 端）

> Python 端已在 `libs/firebase/functions-python/app/rag_ingestion/infrastructure/openai/embedder.py`。
> 以下為 TypeScript 端相同合約的 Next.js server-side 適配器實作指引。

```typescript
// core/wiki-core/infrastructure/repositories/openai-embedding.repository.ts
import OpenAI from 'openai'
import type { IEmbeddingRepository, EmbedTextDTO } from '../../domain/repositories/iembedding.repository'
import type { Embedding } from '../../domain/value-objects/embedding.vo'
import { Embedding as EmbeddingVO } from '../../domain/value-objects/embedding.vo'

const MAX_BATCH = 20
const DEFAULT_MODEL = 'text-embedding-3-small'
const DEFAULT_DIMENSIONS = 1536

export class OpenAIEmbeddingRepository implements IEmbeddingRepository {
  private readonly client: OpenAI
  private readonly model: string
  private readonly dimensions: number

  constructor(apiKey: string, model = DEFAULT_MODEL, dimensions = DEFAULT_DIMENSIONS) {
    this.client = new OpenAI({ apiKey })
    this.model = model
    this.dimensions = dimensions
  }

  async embed(dto: EmbedTextDTO): Promise<Embedding> {
    const [result] = await this.embedBatch([dto])
    return result
  }

  async embedBatch(dtos: EmbedTextDTO[]): Promise<Embedding[]> {
    if (dtos.length > MAX_BATCH) throw new Error(`Max batch size is ${MAX_BATCH}`)
    const response = await this.client.embeddings.create({
      model: this.model,
      input: dtos.map((d) => d.text),
    })
    return response.data.map((item) =>
      new EmbeddingVO({ values: item.embedding, model: this.model, dimensions: this.dimensions }),
    )
  }
}
```

短路全部在 `infrastructure/` ，導入 `index.ts` 时加到 Infrastructure 區段。

### 8.5 執行 `npm run lint` 設設

```bash
cd /home/runner/work/xuanwu-app/xuanwu-app
npm run lint          # ESLint + TypeScript 檢查
npm run build         # 完整 Next.js 編譯合成
```

任何更動 `core/wiki-core` 公開 export 後，必須過 `npm run build` 檢查，以確保 `@/core/knowledge-core` shim 與 `@/modules/knowledge` shim 仍正常轉灯。

### 8.6 接管 `modules/knowledge` shim

目前 `modules/knowledge` 的 domain + application 層是窄導入 shim：

```typescript
// modules/knowledge/domain/index.ts 和 application/index.ts
export * from '@/core/wiki-core'
```

UI 啟用 `@/modules/knowledge` 為實際引用路徑直到 `modules/wiki` 建立並接管。
不要直接刪除此 shim，隔離 wiki-page.tsx 與 WorkspaceWikiTab.tsx 不受影響。
