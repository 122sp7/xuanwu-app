# Domain Implementation Target

## 目的

本文件定義專案在 MDDD 下應實現的領域數量與範圍，作為模組規劃與落地追蹤基準。

## 來源依據

- docs/guides/explanation/architecture.md
- modules 目錄現況（bounded contexts）
- AGENTS.md 的模組化與邊界規範

## 結論

專案完整目標為 18 個領域（bounded contexts）。

`wiki-beta` 不作為最終獨立領域，定位為過渡期整合殼層，需依代碼職責拆分回正式領域。

## 18 個目標領域

1. account
2. agent
3. asset
4. content
5. event
6. identity
7. knowledge
8. knowledge-graph
9. namespace
10. notification
11. organization
12. retrieval
13. shared
14. workspace
15. workspace-audit
16. workspace-feed
17. workspace-flow
18. workspace-scheduling

## wiki-beta 分解原則（依代碼性質）

`modules/wiki-beta` 目前屬於混合職責模組，應分解到以下領域：

1. content
- pages、block editor、content tree、頁面編輯互動

2. asset
- libraries、documents、檔案清單與資源管理

3. knowledge
- 文件語意層、知識索引前置資料、知識庫視圖整合

4. knowledge-graph
- page relation、backlinks、taxonomy 或 graph 結構化關聯

5. retrieval
- rag query、檢索流程、context assembly、回答編排

6. workspace
- workspace 視圖組裝與工作區範圍上下文

## wiki-beta 分解對照（use-case 粗映射）

- `wiki-beta-pages.use-case.ts` -> content
- `wiki-beta-content-tree.use-case.ts` -> content + knowledge-graph
- `wiki-beta-libraries.use-case.ts` -> asset
- `wiki-beta-rag.use-case.ts` -> retrieval + knowledge
- `interfaces/components/WikiBeta*View.tsx` -> 對應領域 interfaces，保留 API-only 使用

## 過渡策略

1. 先凍結 `wiki-beta` 新能力開發，只允許修復。
2. 新功能直接落在目標領域，不再新增 `wiki-beta` 內部職責。
3. 逐步搬移 use-case、repository、interfaces 到目標領域。
4. 以 `wiki-beta/api` 作為過渡 facade，最終下線。

## 邊界規則

- 每個領域自有：domain、application、infrastructure、interfaces。
- 跨領域互動只能透過目標領域的 api 邊界。
- 禁止直接依賴他領域內部層（domain/application/infrastructure/interfaces）。

## 分期建議

- Phase 1（核心可用）: 8 個領域
  - identity, organization, workspace, content, knowledge, retrieval, notification, event
- Phase 2（協作與治理）: 6 個領域
  - account, asset, namespace, workspace-feed, workspace-flow, workspace-audit
- Phase 3（排程與智能能力）: 4 個領域
  - workspace-scheduling, agent, shared, knowledge-graph
- Phase 4（收斂與下線）: wiki-beta 分解完成
  - wiki-beta 殼層下線

## 驗收標準

- 每個領域具有明確 api 出口。
- 跨領域依賴可被追蹤為 api-to-api。
- 不存在跨領域內部層 import。
- 新增能力優先放入既有領域，避免無必要新增領域。
