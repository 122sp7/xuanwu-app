# workspace — 協作容器上下文

> **Domain Type:** Generic Subdomain  
> **模組路徑:** `modules/workspace/`  
> **定位:** 協作範圍、生命週期與工作區公開邊界

## Strategic Role

`workspace` 是 Xuanwu 的協作容器 bounded context。它提供工作區作為協作範圍的 identity、生命週期與可見性語言，讓知識、來源、工作流、稽核、動態與排程等上下文可以用同一個 `workspaceId` 對齊範圍。

它是 generic subdomain，不是產品差異化核心；真正差異化的知識內容、檢索與協作語意由其他 bounded context 擁有。

## 主要職責

| 能力 | 說明 |
|---|---|
| Workspace 容器生命週期 | 建立工作區、更新設定、管理 `preparatory | active | stopped` 狀態 |
| 協作範圍語言 | 提供 `workspaceId`、`WorkspaceVisibility` 與工作區範圍識別語言 |
| 工作區公開邊界 | 透過 `api/` 暴露穩定查詢、命令入口與 UI composition surface |
| Read-side Projections | 組合工作區成員檢視與工作區導覽節點等查詢模型 |

## 不屬於此 Context 的責任

- `organization` 擁有組織成員、團隊與組織治理真相來源
- `knowledge` / `knowledge-base` / `source` / `notebook` 擁有內容與知識工作流語意
- `shared` 擁有跨 bounded context 的事件基底與 event publishing 基礎設施
- UI tab 組裝屬於 interface composition，不等於 context map

## Tactical Model Summary

| 類型 | 目前契約 |
|---|---|
| Aggregate Root | `Workspace` |
| Supporting Domain Objects | `WorkspaceLocation`、`Capability`、`WorkspaceGrant`、`WorkspacePersonnel` |
| Read Projections | `WorkspaceMemberView`、`WikiAccountContentNode`、`WikiWorkspaceContentNode` |
| Write-side Port | `WorkspaceRepository` |
| Read-side Ports | `WorkspaceQueryRepository`、`WikiWorkspaceRepository` |
| Domain Services | 目前沒有獨立 service；規則仍以 aggregate / application orchestration 為主 |
| Domain Events | `WorkspaceCreated`、`WorkspaceLifecycleTransitioned`、`WorkspaceVisibilityChanged` 為目標契約 |

## DDD 概念導讀

| 概念 | 在 workspace 中的程式型態 | 主要查看文件 |
|---|---|---|
| Entity（實體） | 類別 / 物件 | `aggregates.md` |
| Value Object（值對象） | 類別 / 物件 | `aggregates.md`、`ubiquitous-language.md` |
| Aggregate / Aggregate Root（聚合 / 聚合根） | 類別 / 物件 | `aggregates.md` |
| Repository（倉儲） | 介面或類別（負責資料存取） | `repositories.md` |
| Domain Service（領域服務） | 類別 / 函式 | `domain-services.md` |
| Factory（工廠） | 類別 / 函式 | `application-services.md`、`domain-events.md` |
| Domain Event（領域事件） | 事件類別、訊息物件 | `domain-events.md`、`context-map.md` |

## 實作備註

- 目前程式中仍有一些 supporting records 與 read projections 混置於 `domain/entities/`；本文件定義的是收斂方向
- `WorkspaceMemberView` 與 `WikiContentTree` 型別不得再被描述成 aggregate 或 value object
- `index.ts` 的目標是薄入口；跨模組 consumer 應優先依賴 `@/modules/workspace/api`

## 詳細文件

| 文件 | 說明 |
|---|---|
| [ubiquitous-language.md](./ubiquitous-language.md) | workspace BC 的通用語言與禁止術語 |
| [aggregates.md](./aggregates.md) | aggregate、entity、value object 與 read projection 對位 |
| [application-services.md](./application-services.md) | application layer use cases、query orchestration 與 factory 落點 |
| [repositories.md](./repositories.md) | write/read repository ports 與 infrastructure adapters |
| [domain-services.md](./domain-services.md) | domain service 何時需要、目前是否存在 |
| [domain-events.md](./domain-events.md) | workspace 領域事件契約與發佈規則 |
| [context-map.md](./context-map.md) | workspace 與其他 bounded context 的 integration patterns |
