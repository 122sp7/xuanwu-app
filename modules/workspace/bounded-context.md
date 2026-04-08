# Bounded Context — workspace

`modules/workspace/` 是 Xuanwu 中承載 workspace 語言、模型、應用流程與 adapter 的 bounded context。

全域 bounded-context 地圖由 [docs/ddd/bounded-contexts.md](../../docs/ddd/bounded-contexts.md) 擁有；本文件只描述 `workspace` 這個本地 bounded context 的細節，不重複整份全域地圖。

## Boundaries

### 這個 bounded context 擁有的語言

- `Workspace`
- `workspaceId`
- `WorkspaceLifecycleState`
- `WorkspaceVisibility`
- 與工作區範圍直接相關的 aggregate、value object、domain event language

### 這個 bounded context 不擁有的語言

- 組織成員、團隊與治理真相來源：由 `organization` 擁有
- 知識內容與知識工作流：由 `knowledge`、`knowledge-base`、`notebook` 等擁有
- 事件儲存與 event bus 基礎設施：由 `shared` 與對應 integration layers 擁有
- 頁面 tab 組裝與 route composition：屬於 UI / interface composition，不是 bounded-context boundary 本體

## Collaboration Surface

workspace 以兩種主要方式與其他 bounded contexts 協作：

1. 同步公開邊界：`api/`
2. Published Language：`workspaceId`、生命週期／可見性語言與 domain events

在本地執行路徑上，read models / projections 也是 bounded context 對 drivers 提供的重要讀取 surface，但它們不是對外 published language 的全部。

更完整的外部關係請看 [context-map.md](./context-map.md)。

## Internal Structure

從六邊形架構看，這個 bounded context 的內部切面如下：

| 區域 | 角色 |
|---|---|
| `domain/` | aggregate、entity、value object、domain event language |
| `application/` | use cases 與 orchestration |
| `interfaces/` | driving adapters：Server Actions、queries、UI composition |
| `infrastructure/` | driven adapters：Firebase 與其他外部技術整合 |

這個分層是 bounded context 的內部結構，不應和 strategic context map 混為一談。

## Drivers, Ports, Adapters, and Read Models

### Drivers / 外部驅動器

- Browser UI
- Next.js Server Actions 與 query entrypoints
- 其他 bounded context 經由 `api/` 的呼叫者
- 未來可能的 incoming event handlers / scheduled jobs

### Ports / 端口

- 內核朝外的 driven ports 主要是 `domain/repositories/` 介面
- `api/` 是對外穩定 collaboration surface，但不等於把所有內部 ports 直接公開

### Adapters / 適配器

- Driving Adapters：`interfaces/` 下的 actions、queries、UI-oriented composition
- Driven Adapters：`infrastructure/` 下的 Firebase 與事件整合實作

### Projections / Read Models

- `WorkspaceMemberView`
- `WikiAccountContentNode`
- `WikiWorkspaceContentNode`
- `WikiContentItemNode`

它們服務查詢與呈現，不是 write-side aggregate，也不是 infrastructure adapter。

## Ownership Guardrails

- 跨模組 consumer 應透過 `@/modules/workspace/api` 協作
- `domain/` 不感知 React、Firebase SDK、HTTP client
- `infrastructure/` 不透過 `api/` 反向回繞
- `WorkspaceMemberView` 與 `Wiki*Node` 是 query-side projection，不是此 bounded context 的 write-side aggregate

## Related Local Docs

- [README.md](./README.md) — 總覽與 tactical summary
- [context-map.md](./context-map.md) — 對外關係與 integration patterns
- [aggregates.md](./aggregates.md) — bounded context 內部核心模型
- [repositories.md](./repositories.md) — ports 與 adapters
