# Domain Implementation Target

## 目的

本文件定義專案在 MDDD 下應實現的領域數量與範圍，作為模組規劃與落地追蹤基準。

## 來源依據

- docs/guides/explanation/architecture.md
- modules 目錄現況（bounded contexts）
- AGENTS.md 的模組化與邊界規範

## 結論

專案目前已實現 **16 個有界上下文**（bounded contexts），對應 `modules/` 下的 16 個目錄。

**已完成的模組整合：**
- `modules/wiki-beta` — 已分解完畢，職責已遷移至各目標領域（見下表）。
- `modules/namespace` — 已刪除；Slug 工具遷移至 `modules/shared/domain/slug-utils.ts`。
- `modules/event` — 已刪除；Event-store 原語遷移至 `modules/shared`（`EventRecord`、`PublishDomainEventUseCase` 等）。

**已完成的功能里程碑：**
- Auto-link 觸發管道 — `knowledge-graph/application/use-cases/auto-link.use-case.ts` 已實作，支援 `content.page_created` → GraphNode + hierarchy Link，以及 `content.block-updated` → WikiLink → explicit Link。
- RAG Feedback Loop — `retrieval/domain/entities/RagQueryFeedback.ts` + `SubmitRagQueryFeedbackUseCase` + `FirebaseRagQueryFeedbackRepository` 已實作，收集使用者對 RAG 答案的品質評分。

## 16 個目前有界上下文

1. account
2. agent
3. asset
4. content
5. identity
6. knowledge
7. knowledge-graph
8. notification
9. organization
10. retrieval
11. shared
12. workspace
13. workspace-audit
14. workspace-feed
15. workspace-flow
16. workspace-scheduling

## wiki-beta 分解完成對照

`modules/wiki-beta` 已完成分解，各職責的最終歸屬：

| 原 wiki-beta 職責 | 分解目標模組 | 實現位置 |
| --- | --- | --- |
| WikiBetaPage（頁面實體） | `content` | `modules/content/domain/entities/wiki-beta-page.types.ts` |
| WikiBetaLibrary（資料庫實體） | `asset` | `modules/asset/domain/entities/wiki-beta-library.types.ts` |
| WikiBetaContentTree（工作區視圖） | `workspace` | `modules/workspace/domain/entities/WikiBetaContentTree.ts` |
| wiki-beta-pages.use-case | `content` | `modules/content/application/use-cases/wiki-beta-pages.use-case.ts` |
| wiki-beta-libraries.use-case | `asset` | `modules/asset/application/use-cases/wiki-beta-libraries.use-case.ts` |
| wiki-beta-rag.use-case | `retrieval` | `modules/retrieval/application/use-cases/wiki-beta-rag.use-case.ts` |
| wiki-beta-content-tree.use-case | `workspace` | `modules/workspace/application/use-cases/wiki-beta-content-tree.use-case.ts` |
| WikiBetaRagTypes | `retrieval` | `modules/retrieval/domain/entities/WikiBetaRagTypes.ts` |
| Firebase repositories | `content`, `asset`, `retrieval` | 各模組 `infrastructure/repositories/` 或 `infrastructure/firebase/` |

UI 路由 `app/(shell)/wiki-beta/*` 仍維持原路徑不變（使用者可見路徑），但其 Server Action 與資料依賴皆透過目標模組的 `api/` 邊界取用。

## namespace / event 遷移對照

| 原模組 | 職責 | 遷移位置 |
| --- | --- | --- |
| `namespace` | `deriveSlugCandidate`, `isValidSlug` | `modules/shared/domain/slug-utils.ts`（透過 `modules/shared/api` 匯出） |
| `event` | `EventRecord`, `IEventStoreRepository`, `IEventBusRepository` | `modules/shared/domain/event-record.ts` |
| `event` | `PublishDomainEventUseCase` | `modules/shared/application/publish-domain-event.ts` |
| `event` | `InMemoryEventStoreRepository`, `NoopEventBusRepository` | `modules/shared/infrastructure/` |

## 邊界規則

- 每個領域自有：domain、application、infrastructure、interfaces。
- 跨領域互動只能透過目標領域的 `api/` 邊界。
- 禁止直接依賴他領域內部層（domain/application/infrastructure/interfaces）。

## 驗收標準

- 每個領域具有明確 api 出口。
- 跨領域依賴可被追蹤為 api-to-api。
- 不存在跨領域內部層 import。
- 新增能力優先放入既有領域，避免無必要新增領域。

---

## MVP v1.0 里程碑範圍

下表明確區分「v1.0 必須上線」與「未來迭代」，避免 scope creep。

### ✅ v1.0 必須（Must Have）

| 功能領域 | 模組 | 狀態 |
|---------|------|------|
| 使用者登入 / 登出 | `identity` | ✅ 完成 |
| 帳戶 Profile 管理 | `account` | ✅ 完成 |
| 組織與成員管理 | `organization` | ✅ 完成 |
| 工作區建立與生命週期 | `workspace` | ✅ 完成 |
| 頁面與 Block 編輯器 | `content` | ✅ 完成 |
| 檔案上傳與 RAG 文件登錄 | `asset` | ✅ 完成 |
| RAG 攝入管線（Python） | `knowledge` + `py_fn` | ✅ 完成 |
| RAG 向量搜索與答案生成 | `retrieval` | ✅ 完成 |
| RAG 品質回饋（Feedback） | `retrieval` | ✅ 完成 |
| Knowledge Graph Auto-link | `knowledge-graph` | ✅ 完成 |
| 通知派送 | `notification` | ✅ 完成 |
| 稽核日誌 | `workspace-audit` | ✅ 完成 |

### 🟡 v1.1 計畫（Should Have）

| 功能領域 | 模組 | 備註 |
|---------|------|------|
| Task / Issue 工作流 | `workspace-flow` | 核心付費功能，排 v1.1 |
| Invoice 計費流程 | `workspace-flow` | 須搭配 Subscription 模型 |
| 排程需求管理 | `workspace-scheduling` | 月曆視圖 |
| 動態牆社群互動 | `workspace-feed` | 完整 notification 連通後上線 |

### 🟢 未來迭代（Nice to Have）

| 功能領域 | 建議位置 | 備註 |
|---------|---------|------|
| Global Search | `modules/search/` | Firestore 複合索引或 Algolia |
| Notion-style Database | `content/domain/entities/ContentDatabase.ts` | Block DB 視圖 |
| Collaboration（即時協作） | `modules/collaboration/` | Firebase Realtime DB / CRDT |
| Plan/Subscription/Quota | `modules/billing/` 或 `organization` | SaaS 訂閱定價 |
| AI Auto-indexing（Block 更新觸發重新 Embed） | `knowledge` | content.block-updated 事件觸發 |
