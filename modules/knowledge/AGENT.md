# AGENT.md — knowledge BC

## 模組定位

`knowledge` 是 Core Domain，管理 KnowledgePage 的完整生命週期。`knowledge.page_approved` 是平台的核心整合事件，觸發 workspace-flow 物化流程。

`knowledge` 對應 Notion 的核心功能集：Pages（KnowledgePage）、Blocks（ContentBlock）、Wiki/Knowledge Base（KnowledgeCollection with spaceType="wiki"，帶頁面驗證與所有權）。**Databases（spaceType="database"）的完整 Schema/Record/View 生命週期由 `knowledge-database` BC 擁有（D1 決策）；`knowledge` 僅持有 KnowledgeCollection.id 作為 opaque reference。**

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `KnowledgePage` | Page、Document |
| `ContentBlock` | Block、Node、Element |
| `ContentVersion` | Version、Snapshot、History |
| `BlockType` | Type、ContentType |
| `KnowledgeCollection` | Database、Collection、Table |
| `WikiSpace` | KB、KnowledgeBase（直接稱呼） |
| `PageVerificationState` | verified、needs_review（需透過型別） |
| `PageOwner` (`ownerId`) | Owner、Responsible |

> `WikiPage` 是歷史 wiki-module 術語；`knowledge` BC 不使用 `WikiPage` 作為通用語言。
> `WikiSpace` 在 `knowledge` BC 代表 `spaceType="wiki"` 的 `KnowledgeCollection`，與已移除的歷史 wiki 模組無關。

## 邊界規則

### ✅ 允許
```typescript
import { knowledgeApi } from "@/modules/knowledge/api";
import type { KnowledgePageDTO, ContentBlockDTO } from "@/modules/knowledge/api";
```

### ❌ 禁止
```typescript
import { ContentPage } from "@/modules/knowledge/domain/entities/content-page.entity";
import { KnowledgePageCreatedEvent } from "@/modules/knowledge/domain/events/knowledge.events";
import type { Article } from "@/modules/knowledge-base/domain/entities/Article";
```

## page_approved 事件規則

`knowledge.page_approved` 必須包含：
- `extractedTasks[]` — 供 workspace-flow 建立 Task
- `extractedInvoices[]` — 供 workspace-flow 建立 Invoice
- `actorId`, `causationId`, `correlationId` — 追蹤鏈

## 驗證命令

```bash
npm run lint
npm run build
```
