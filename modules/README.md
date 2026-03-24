# Modules Architecture Notes

## 1. module 通用結構（完整模板）

```text
module-name/
│
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   ├── services/
│   └── events/
│
├── application/
│   ├── use-cases/
│   ├── commands/
│   ├── queries/
│   └── dto/
│
├── infrastructure/
│   ├── persistence/
│   ├── firestore/
│   ├── search/
│   └── external/
│
├── interfaces/
│   ├── actions/
│   ├── api/
│   └── controllers/
│
└── index.ts
```

## 2. content 模組範例（Notion Block / Page / Database）

```text
content/
├── domain/
│   ├── entities/
│   │   ├── Page.ts
│   │   ├── Block.ts
│   │   └── Database.ts
│   ├── value-objects/
│   └── repositories/
├── application/
│   ├── use-cases/
│   └── dto/
├── infrastructure/      # 可以呼叫 packages/firestore
└── interfaces/
```

## 3. 整體專案結構（Next.js + Firebase + Genkit）

```text
src/
│
├── app/                     # Next.js App Router
├── modules/                 # MDDD Domains（完全獨立）
├── packages/                # Infrastructure / 共用套件（Firestore / Genkit / Vector / Search）
├── interfaces/              # API / Server Actions
└── workflows/               # Genkit AI Flow
```

## 4. modules（9 Domains，每個領域獨立）

```text
modules/
│
├── account/                 # 帳號 / 身分 / 訂閱
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── interfaces/
│
├── workspace/               # 工作空間 / 成員 / 權限
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── interfaces/
│
├── content/                 # Notion Block / Page / Database
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── Page.ts
│   │   │   ├── Block.ts
│   │   │   └── Database.ts
│   │   ├── value-objects/
│   │   └── repositories/
│   ├── application/
│   │   ├── use-cases/
│   │   └── dto/
│   ├── infrastructure/      # 可以呼叫 packages/firestore
│   └── interfaces/
│
├── graph/                   # Wiki Knowledge Graph
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   └── interfaces/
│
├── search/                  # 搜尋 / Index
├── ai/                      # NotebookLM / RAG
├── collaboration/           # Comments / Activity / Notifications / Version
├── workflow/                # 自動化 / 排程 / Triggers
└── storage/                 # Files / Attachments / Images
```

## 5. 每個 module 的標準 MDDD 分層（獨立領域）

```text
module-name/
│
├── domain/                  # Business Logic
│   ├── entities/
│   ├── value-objects/
│   ├── repositories/
│   ├── services/
│   └── events/
│
├── application/             # Use Cases
│   ├── use-cases/
│   ├── commands/
│   ├── queries/
│   └── dto/
│
├── infrastructure/          # 只能使用 packages/* 或呼叫外部 API
│
├── interfaces/              # API / Server Actions
└── index.ts
```

## 6. packages（共用套件 / 系統層）

```text
packages/
│
├── firebase/                # Firestore / Auth / Storage 封裝
├── genkit/                  # AI Flow / Embedding 封裝
├── vector/                  # Vector DB / Upstash 封裝
└── search/                  # Full-text / Elastic / Algolia 封裝
```

每個 module **只能透過 packages 提供的接口**，不直接 import 其他 module，確保領域隔離。

## 7. workflows（Genkit AI Flow，跨 module）

```text
workflows/
│
├── rag/                     # Retrieval + LLM
├── auto-tag/
├── auto-link/
└── embeddings/
```

## 8. Next.js App Router 建議平行路由對應模組

```text
/workspace
    /@editor        ← content
    /@graph         ← graph
    /@chat          ← ai
    /@database      ← workspace / storage
    /@collab        ← collaboration
    /@workflow      ← workflow
```

## 9. 說明

1. **完全領域隔離**：module 之間只透過 API 或 packages 封裝通訊。
2. **Infrastructure -> packages/**：提供 Firebase、Genkit、Vector DB 封裝，所有 module 都透過 packages 使用。
3. **Workflows**：AI Flow 與 RAG 等邏輯可以集中，模組呼叫 API。
4. **MDDD 實踐**：每個 module 保持 domain + application + infrastructure + interfaces，確保可維護、可測試、可部署。
