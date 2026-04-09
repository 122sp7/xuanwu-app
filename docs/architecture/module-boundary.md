# Module Boundary（模組邊界）

<!-- change: Add content/api/events.ts and workspace-flow/api/listeners.ts public interface examples; PR-NUM -->

本文件說明 Xuanwu App 的 MDDD 模組邊界規則、API 邊界設計，以及 import 規範的強制機制。

> **相關文件：** [`../ddd/bounded-contexts.md`](../ddd/bounded-contexts.md) · [`context-map.md`](./context-map.md) · [`../reference/specification/system-overview.md`](../reference/specification/system-overview.md)

---

## 核心原則

> **任何跨模組存取，必須且只能透過目標模組的 `api/index.ts`。**

```
modules/
  workspace/
    api/           ← 唯一合法的對外 import 點
    domain/        ← 禁止跨模組直接 import
    application/   ← 禁止跨模組直接 import
    infrastructure/← 禁止跨模組直接 import
    interfaces/    ← 禁止跨模組直接 import
```

---

## 層級依賴方向

```
interfaces/   →   application/   →   domain/   ←   infrastructure/
     ↑                                                      ↑
   (UI/Transport)   (Use Cases)      (Entities/Repos)   (Firebase/Genkit)
```

| 層級 | 允許依賴 | 禁止依賴 |
|------|---------|---------|
| `interfaces/` | `application/`、`domain/`（本模組）、外部模組 `api/` | 外部模組任何內部層 |
| `application/` | `domain/`（本模組） | `interfaces/`、外部模組內部層 |
| `domain/` | 無外部依賴 | Firebase SDK、React、HTTP client、任何外部框架 |
| `infrastructure/` | `domain/`（本模組，實作 interface） | `application/`、`api/`、外部模組 `domain/` |
| `api/` | `application/`、`domain/`、`interfaces/` queries（本模組） | 外部模組內部層 |

---

## `api/index.ts` 公開邊界設計

每個模組的 `api/index.ts` 是**公開契約（Public API Surface）**，包含：

```typescript
// modules/<context>/api/index.ts 的典型結構

// 1. Server Actions（write-side）
export { createKnowledgePage, updateKnowledgeBlock } from "../interfaces/_actions/knowledge.actions";

// 2. Query 函式（read-side）
export { getKnowledgePages, getKnowledgePage } from "../interfaces/queries/knowledge.queries";

// 3. DTO / 契約型別
export type { ApproveKnowledgePageDto } from "../application/dto/knowledge.dto";
export type { KnowledgePage } from "../domain/entities/knowledge-page.entity";

// 4. Facade（聚合多個 use case 的門面）
export { knowledgeFacade } from "./knowledge-facade";
```

### 特殊邊界規則

| 模組 | 特殊規則 |
|------|---------|
| `search/api` | **禁止**匯出 `"use client"` UI 元件（如 `RagView`、`RagQueryView`）。Client 端請從 root barrel `modules/search` 匯出 |
| `identity/api` | **禁止**匯出 `"use client"` hooks/components，因 `account/application` 在 Server 端 import identity/api |
| `knowledge/api` | 目前同時匯出 editor UI 與 store 型別；跨域整合時應優先使用 facade、actions、queries、event contracts |
| `workspace/infrastructure` | `FirebaseWikiWorkspaceRepository` **禁止** import `@/modules/workspace/api`（循環依賴），改用 relative import `FirebaseWorkspaceRepository` |

---

## Import 規範

### ✅ 允許的 import 模式

```typescript
// 跨模組：走 api/ 邊界
import { createKnowledgePage } from "@/modules/knowledge/api";
import { getWorkspaceById } from "@/modules/workspace/interfaces/api";
import { deriveSlugCandidate } from "@/modules/shared/api";

// Package alias
import type { CommandResult, DomainError } from "@shared-types";
import { cn } from "@shared-utils";
import { Button } from "@ui-shadcn/ui/button";
import { getFirebaseFirestore } from "@integration-firebase";

// 同模組內部：可用相對路徑
import type { KnowledgePage } from "../domain/entities/knowledge-page.entity";
import { FirebaseKnowledgePageRepository } from "../infrastructure/firebase/FirebaseKnowledgePageRepository";
```

### ❌ 禁止的 import 模式

```typescript
// ❌ 跨模組直接 import 他模組內部層
import { KnowledgePage } from "@/modules/knowledge/domain/entities/knowledge-page.entity";
import { FirebaseWorkspaceRepository } from "@/modules/workspace/infrastructure/firebase/FirebaseWorkspaceRepository";

// ❌ 使用舊版 @/ 直接 import shared/libs
import { cn } from "@/shared/utils";
import { Button } from "@/ui/components/button";

// ❌ domain 層 import 框架
// 在 domain/ 中 import firebase/react/axios 等 → 嚴格禁止
import { collection } from "firebase/firestore";    // ❌ 在 domain/ 中
```

---

## Package Alias 規範

| Alias | 指向 | 用途 |
|-------|------|------|
| `@shared-types` | `packages/shared-types/` | `CommandResult`, `DomainError`, `ID`, `Timestamp` |
| `@shared-utils` | `packages/shared-utils/` | `cn()`, 通用工具函式 |
| `@ui-shadcn` | `packages/ui-shadcn/` | shadcn/ui 元件 |
| `@ui-vis` | `packages/ui-vis/` | 視覺化元件 |
| `@integration-firebase` | `packages/integration-firebase/` | Firebase SDK 初始化 |
| `@integration-http` | `packages/integration-http/` | HTTP 整合 |
| `@lib-uuid` | `packages/lib-uuid/` | UUID 產生工具 |
| `@lib-xstate` | `packages/lib-xstate/` | 狀態機與整合 Hook |

---

## client/server 邊界管理

Next.js App Router 的 `"use server"` 與 `"use client"` 邊界與模組 API 邊界的交集：

```
"use server" 代碼（Server Actions、Server Components）
  └── 可 import: modules/<any>/api（前提：api 不含 "use client" 匯出）
  └── 可 import: @shared-types、@integration-firebase

"use client" 代碼（Client Components、Hooks）
  └── 可 import: modules/<any>/api（一般用途）
  └── 特殊：modules/search UI 元件從 modules/search（root barrel）import
  └── 禁止 import: "use server" 函式（Server Actions 除外）
```

**模組 API 匯出分類：**

| 類別 | 位置 | Server 端可用 | Client 端可用 |
|------|------|:---:|:---:|
| Server Actions | `interfaces/_actions/` | ✅ | ✅（透過 `"use server"` 包裹） |
| Query 函式（async） | `interfaces/queries/` | ✅ | ✅ |
| Query Hooks（`use*`） | `interfaces/hooks/` | ❌ | ✅ |
| React Components | `interfaces/components/` | ❌ | ✅ |
| Domain 型別 | `api/contracts.ts` | ✅ | ✅ |

---

## 邊界執行機制

### ESLint 規則

邊界規則透過 `eslint.config.mjs` 中的 restricted-import 規則強制執行：

```javascript
// eslint.config.mjs（示意）
rules: {
  "no-restricted-imports": ["error", {
    patterns: [
      {
        group: ["@/modules/*/domain/*", "@/modules/*/application/*", "@/modules/*/infrastructure/*"],
        message: "Cross-module imports must go through /api boundary."
      }
    ]
  }]
}
```

**Lint 基準：** 0 errors，117 warnings（jsdoc/unused-vars/naming 類警告）

---

## 模組清單（18 個有界上下文）

| # | 模組 | 類別 | 主要職責 |
|---|------|------|---------|
| 1 | `knowledge` | Core Domain | Knowledge page、block、version、approval lifecycle |
| 2 | `knowledge-base` | Core Domain | Article、category、verification 與組織級知識資產 |
| 3 | `ai` | Supporting | Ingestion job、chunking/indexing handoff |
| 4 | `knowledge-collaboration` | Supporting | Comment、permission、version snapshot |
| 5 | `knowledge-database` | Supporting | Database、record、view 與 relation data work |
| 6 | `notebook` | Supporting | Ask/cite、summary、knowledge generation |
| 7 | `search` | Supporting | Retrieval、citation context、RAG query |
| 8 | `source` | Supporting | External source、file、ingestion boundary |
| 9 | `workspace-audit` | Supporting | 稽核與 traceability |
| 10 | `workspace-feed` | Supporting | 動態牆、回應、反應 |
| 11 | `workspace-flow` | Supporting | Task、Issue、Invoice workflow |
| 12 | `workspace-scheduling` | Supporting | 排程需求與容量協調 |
| 13 | `identity` | Generic | 認證與 token lifecycle |
| 14 | `account` | Generic | 帳戶語意、個人化與策略 |
| 15 | `organization` | Generic | 租戶、team、member 治理 |
| 16 | `workspace` | Generic | 工作區容器與成員邊界 |
| 17 | `notification` | Generic | 通知與偏好設定 |
| 18 | `shared` | Shared Kernel | EventRecord、Slug 工具、共享原語 |

---

## 跨模組 API 邊界範例：knowledge ↔ workspace-flow 事件整合

`knowledge` 與 `workspace-flow` 之間的事件驅動整合必須透過各自的 `api/` 公開邊界，以下為公開介面範例：

### `modules/knowledge/api/events.ts`（計畫中）

```typescript
// modules/knowledge/api/events.ts
// 匯出 knowledge 模組的公開事件契約，供其他模組（如 workspace-flow）訂閱

export type {
  KnowledgePageApprovedEvent,
  KnowledgeDomainEvent,
} from "../domain/events/knowledge.events";

// 事件類型常數（供訂閱者 switch/case 使用）
export const KNOWLEDGE_EVENT_TYPES = {
  PAGE_APPROVED: "knowledge.page_approved",
  PAGE_CREATED: "knowledge.page_created",
  BLOCK_UPDATED: "knowledge.block_updated",
} as const;
```

### `modules/workspace-flow/api/listeners.ts`（計畫中）

```typescript
// modules/workspace-flow/api/listeners.ts
// 定義 workspace-flow 模組對外暴露的事件監聽介面
// 供 Process Manager、Cloud Functions Trigger 或 Event Bus 使用

import type { KnowledgePageApprovedEvent } from "@/modules/knowledge/api";
import { KnowledgeToWorkflowMaterializer } from "../application/process-managers/knowledge-to-workflow-materializer";

/**
 * 處理 knowledge.page_approved 事件
 * 觸發點：Cloud Functions Firestore Trigger 或 Event Bus Consumer
 */
export async function handleKnowledgePageApproved(
  event: KnowledgePageApprovedEvent,
): Promise<void> {
  const materializer = new KnowledgeToWorkflowMaterializer(
    new FirebaseTaskRepository(),
    new FirebaseInvoiceRepository(),
  );
  await materializer.handle(event);
}

// 監聽器描述（供 Event Bus 註冊使用）
export const WORKSPACE_FLOW_EVENT_LISTENERS = [
  {
    eventType: "knowledge.page_approved",
    handler: handleKnowledgePageApproved,
    description: "Materializes Task and Invoice from approved KnowledgePage",
  },
] as const;
```

**使用規則：**
- `workspace-flow` 只能從 `@/modules/knowledge/api` import 事件型別，**不得**直接 import `knowledge/domain/`。
- `knowledge` 不得直接呼叫 `workspace-flow` 的 Use Case，只能透過 Event Bus 解耦。
- `listeners.ts` 是 `workspace-flow/api` 的一部分，供外部（Cloud Functions、Trigger、tests）安全呼叫。

---

## 已知邊界例外（Documented Exceptions）

下列邊界例外均已有充分理由，並於代碼中標注：

| 位置 | 例外 | 原因 |
|------|------|------|
| `workspace/infrastructure/FirebaseWikiWorkspaceRepository.ts` | 使用相對 import 而非 `workspace/api` | 避免循環依賴 |
| `search/index.ts` (root barrel) | 匯出 `"use client"` 元件（如 `RagQueryView`） | 供 Client 端使用的根 barrel，非 api/ |
| `knowledge/api/index.ts` | 同時匯出 editor components 與 store 型別 | 目前 route composition 仍透過此公開表面組裝知識編輯體驗 |

---

## 新模組建立 Checklist

新建 `modules/<new-context>/` 時必須完成：

- [ ] 建立 `api/index.ts`（立即定義公開契約）
- [ ] 建立 `domain/`（entities、value-objects、repositories interfaces）
- [ ] 建立 `application/use-cases/`
- [ ] 建立 `infrastructure/`（Firebase 實作）
- [ ] 建立 `interfaces/`（queries、hooks、components、actions）
- [ ] 建立 `README.md`（職責說明）
- [ ] 更新 `docs/ddd/bounded-contexts.md`（Canonical）
- [ ] 更新 `.github/terminology-glossary.md` 與 `modules/<context>/ubiquitous-language.md`
- [ ] 更新 `docs/architecture/domain-implementation-target.md`
- [ ] 更新 `.github/agents/knowledge-base.md`
