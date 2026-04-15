# Notion Module

`src/modules/notion` 是蒸餾自 `modules/notion` 的精簡等價版，以 `src/modules/template` 骨架為基線。
保留 **4 個 core** 子域：**knowledge**（頁面生命週期）、**authoring**（建立/驗證/分類）、**collaboration**（留言/權限快照）、**knowledge-database**（結構化多視圖）。taxonomy 與 relations 為近期 Tier 2，可後補。

## 領域定位

| 項目 | 內容 |
|---|---|
| **DDD 分類** | Core Product Domain |
| **定位** | 通用內容操作系統（類 Notion）|
| **核心價值** | 內容建模能力：block-based editor + 結構化資料 + 協作 + 版本 |
| **不做** | AI inference（交給 `ai`）、knowledge RAG（交給 `notebooklm`）|
| **依賴方向** | 被 workspace 組裝；可被 notebooklm ingest；下游只能 reference，不可寫入 |

## 蒸餾來源

`modules/notion`（6 個 core-first 子域）→ `src/modules/notion`（4 core + 2 near-term）

## 目錄結構

```
src/modules/notion/
  index.ts                                    ← 模組對外唯一入口（具名匯出）
  domain/
    index.ts
    entities/
      KnowledgePage.ts                        ← aggregate root（頁面）
      ContentBlock.ts                         ← 頁面內容節點
      Collection.ts                           ← knowledge-database 容器
      CollectionEntry.ts                      ← 結構化資料列
    value-objects/
      KnowledgePageId.ts
      CollectionId.ts
      PageStatus.ts                           ← "draft" | "published" | "archived"
      TaxonomyTag.ts                          ← 近期 Tier 2（taxonomy）
    services/
      PublicationPolicyService.ts             ← 發布可見性規則（domain rule）
    repositories/
      KnowledgePageRepository.ts             ← domain port
      CollectionRepository.ts               ← domain port
    events/
      KnowledgePageCreated.ts
      KnowledgePagePublished.ts
      KnowledgePageArchived.ts
      CollectionEntryAdded.ts
  application/
    index.ts
    use-cases/
      create-knowledge-page.use-case.ts
      update-knowledge-page.use-case.ts
      publish-knowledge-page.use-case.ts
      archive-knowledge-page.use-case.ts
      create-collection.use-case.ts
      add-collection-entry.use-case.ts
    dto/
      KnowledgePageDTO.ts
      CollectionDTO.ts
      CollectionEntryDTO.ts
  adapters/
    inbound/
      index.ts
      http/                                   ← notion HTTP endpoints
      rpc/                                    ← tRPC routers
    outbound/
      index.ts
      firestore/
        FirestoreKnowledgePageAdapter.ts      ← implements KnowledgePageRepository
        FirestoreCollectionAdapter.ts         ← implements CollectionRepository
```

## Barrel 結構

| Barrel | 覆蓋範圍 |
|---|---|
| `index.ts` | domain + application 的公開符號 |
| `domain/index.ts` | entities, value-objects, services, repositories, events |
| `application/index.ts` | use-cases + dto |
| `adapters/inbound/index.ts` | http, rpc |
| `adapters/outbound/index.ts` | firestore/ |

所有 barrel 使用 `export { X }` / `export type { X }`，嚴禁 `export *`。

## 蒸餾範圍

| src 概念 | 蒸餾自 modules/notion | 狀態 |
|---|---|---|
| KnowledgePage aggregate | subdomains/knowledge/domain/ | ✅ 保留 |
| ContentBlock | subdomains/authoring/domain/ | ✅ 保留 |
| Collection + CollectionEntry | subdomains/knowledge-database/domain/ | ✅ 保留 |
| PublicationPolicyService | subdomains/knowledge/domain/ | ✅ 保留 |
| TaxonomyTag | subdomains/taxonomy(近期) | ✅ 輕量保留（VO only） |
| RelationRef, backlink | subdomains/relations(近期) | ❌ 後補 |
| publishing, knowledge-versioning | gap subdomains | ❌ 跳過 |
| automation, templates, external-knowledge-sync | 非 core | ❌ 跳過 |

## 依賴方向

```
adapters/inbound → application → domain ← adapters/outbound
```

`domain/` 絕對不依賴 Firestore SDK、React 或任何外部框架。

## Published Language Token

`KnowledgePage`（不是 `Doc` 或 `Wiki`）是跨模組引用知識內容時使用的 token。
下游（notebooklm）只能以 reference 消費，不可直接修改 KnowledgePage 狀態。

## 外部消費方式

```ts
// types
import type { KnowledgePageDTO, PageStatus } from "@/src/modules/notion";

// server-only
import { createKnowledgePage, publishKnowledgePage } from "@/src/modules/notion";
```

原始 API 合約參考：`modules/notion/api/index.ts`。
