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
