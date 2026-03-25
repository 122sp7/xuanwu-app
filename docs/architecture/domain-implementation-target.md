# Domain Implementation Target

## 目的

本文件定義專案在 MDDD 下應實現的領域數量與範圍，作為模組規劃與落地追蹤基準。

## 來源依據

- docs/guides/explanation/architecture.md
- modules 目錄現況（bounded contexts）
- AGENTS.md 的模組化與邊界規範

## 結論

專案完整目標為 19 個領域（bounded contexts）。

## 19 個目標領域

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
14. wiki-beta
15. workspace
16. workspace-audit
17. workspace-feed
18. workspace-flow
19. workspace-scheduling

## 邊界規則

- 每個領域自有：domain、application、infrastructure、interfaces。
- 跨領域互動只能透過目標領域的 api 邊界。
- 禁止直接依賴他領域內部層（domain/application/infrastructure/interfaces）。

## 分期建議

- Phase 1（核心可用）: 8 個領域
  - identity, organization, workspace, content, knowledge, retrieval, notification, event
- Phase 2（協作與治理）: 6 個領域
  - account, asset, namespace, workspace-feed, workspace-flow, workspace-audit
- Phase 3（排程與智能能力）: 5 個領域
  - workspace-scheduling, wiki-beta, agent, shared, knowledge-graph

## 驗收標準

- 每個領域具有明確 api 出口。
- 跨領域依賴可被追蹤為 api-to-api。
- 不存在跨領域內部層 import。
- 新增能力優先放入既有領域，避免無必要新增領域。
