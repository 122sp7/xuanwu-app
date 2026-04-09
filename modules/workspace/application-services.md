# workspace — Application Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件定義 workspace application layer 的目標契約。Application layer 負責承接 driving ports、協調 use cases、DTO、domain services、output ports 與 domain event publishing，不承載 React UI state，也不作為跨模組偷渡 internal implementation 的入口。

從六邊形架構看，application layer 位在 domain model 外層、adapter 內層：它負責接住 inbound requests、呼叫 domain model 與 ports，並協調 outbound integration，但不應吞掉 aggregate 本身的規則。

從依賴反轉看，application layer 應向下依賴 `domain/` 抽象與 `ports/output/`，由 `infrastructure/` 提供實作；UI、Route Handlers、CLI 等 entrypoints 則經由 `ports/input/` 依賴 application layer，而不是直接跨進 repository implementation。

## Application Folder Contract

| 目錄 | 角色 | 放什麼 |
|---|---|---|
| `application/use-cases/` | 單一 use case 入口 | 一個 user goal 對應的一段協調流程 |
| `application/services/` | 跨 use case / 跨 aggregate 流程協調 | process manager、saga-style orchestration、較長流程 |
| `application/dtos/` | 邊界資料形狀 | input DTO、output DTO、query filter DTO |

## 依賴箭頭（Application 視角）

```txt
interfaces/*
	-> ports/input
	-> application/use-cases
	-> application/services
	-> domain/services
	-> domain/aggregates + domain/entities + domain/value-objects
	-> ports/output
	-> infrastructure/*
```

## Use Case / Service / DTO 分工

| 類型 | 主要責任 | 不該放的內容 |
|---|---|---|
| Use Case | 單一使用案例的 command / query 協調 | 長流程狀態、純業務規則、UI state |
| Application Service | 跨多步驟或跨多 use case 的流程編排 | invariant、value object 規則、Firebase 直接呼叫 |
| DTO | 進出 application layer 的資料形狀 | domain decision、repository implementation |

## Application Layer 職責

- 協調 command-side use cases
- 協調 query-side use cases / projection builders
- 呼叫 output ports 與必要的 domain service
- 在持久化成功後觸發 domain event publishing
- 保持 input / output 契約穩定，讓 `interfaces/` 可以薄適配

## Ports / Adapters / Drivers / Read Models

- Driver / 外部驅動器：Browser UI、Route Handlers、CLI / Cron、其他 bounded context 對 `interfaces/api/` 的呼叫者，以及未來可能的事件 subscriber / job trigger
- Driving Adapters：`interfaces/api/`、`interfaces/cli/`、`interfaces/web/`
- Driving Ports：`ports/input/`
- Driven Ports：`ports/output/`
- Driven Adapters：Firebase repositories、event bus / event store integration 等外部技術實作
- Read Models：application layer 在 query-side 協調產出的 `WorkspaceMemberView`、`Wiki*Node` 等讀取模型

## 本文件涉及的 DDD 概念

- Output Port（輸出端口）→ 介面；application layer 依賴的是 output port，而不是 infrastructure adapter 類別
- Domain Service（領域服務）→ 類別 / 函式；只有當規則不屬於 aggregate / value object 時才由 application layer 協作呼叫
- Application Service（應用服務）→ 類別 / 函式；專門協調多 use case 或跨 aggregate 流程
- Factory（工廠）→ 類別 / 函式；用來建立 aggregate、value object、domain event 等有效模型
- Domain Event（領域事件）→ 事件類別、訊息物件；application layer 可在持久化成功後發布，但事件語言本身屬於 domain

## 在整體 Domain 裡的位置

- 這些 application services 只服務 `workspace` 這個 bounded context
- 它們不代表整個 generic subdomain 的所有流程，更不應直接編排其他 bounded context 的內部實作
- 若流程跨越多個 bounded context，應明確透過 `interfaces/api/`、published language 或更高層的 composition orchestration 協作

## Event-Driven 與長流程定位

- 若 workspace 未來出現多步驟、跨事件的長流程協調，預設先放入 `application/services/`，而不是直接塞進 aggregate 或 domain service
- 只有當流程追蹤本身成為領域概念時，才考慮引入 tracker aggregate 或對應 domain model
- 目前 workspace application layer 會協調事件發布，但尚未引入專屬的 long-running process executive / saga state object

## Command-side Use Cases

| Use Case | 目的 | 備註 |
|---|---|---|
| `CreateWorkspaceUseCase` | 建立工作區 | 最小建立流程 |
| `CreateWorkspaceWithCapabilitiesUseCase` | 建立工作區並掛載能力 | 透過 `WorkspaceRepository` + `WorkspaceCapabilityRepository` 協作 |
| `UpdateWorkspaceSettingsUseCase` | 更新名稱、可見性、生命週期與 supporting records | 目前是主要設定更新入口 |
| `DeleteWorkspaceUseCase` | 刪除工作區 | 應搭配生命週期與下游資料政策檢視 |
| `MountCapabilitiesUseCase` | 掛載工作區能力 | 僅依賴 `WorkspaceCapabilityRepository` |
| `GrantTeamAccessUseCase` | 為 workspace 授權 team access | 僅依賴 `WorkspaceAccessRepository` |
| `GrantIndividualAccessUseCase` | 為 workspace 新增 direct grant | 僅依賴 `WorkspaceAccessRepository` |
| `CreateWorkspaceLocationUseCase` | 建立工作區位置節點 | 僅依賴 `WorkspaceLocationRepository` |

## Query-side Use Cases / Projection Builders / Read Model Builders

| Use Case / Function | 目的 |
|---|---|
| `FetchWorkspaceMembersUseCase` | 組合 `WorkspaceMemberView[]` |
| `buildWikiContentTree` | 組合工作區導覽樹 projection |

這些輸出是 read model / projection，不是 aggregate。

## Factories 與 Composition Points

- Domain event factories 應放在 `domain/events/` 或 `domain/factories/`，不放在 UI 或 page component
- Aggregate / Value Object factories 是類別 / 函式，用來建立有效 domain object，不應散落在 React component 中
- UI draft factories 應留在 `interfaces/web/` 或其他 UI-oriented layer，不應假裝成 application service
- Route Handlers、CLI handlers 與 query wrappers 是 driving adapter，不是 application service 本體

## 非目標

- 不保存 React component state
- 不直接 new infrastructure adapter 作為主要協作方式
- 不把 `WorkspaceDetailScreen` 的 tab composition 寫進 application layer
- 不把純業務規則塞進 `application/services/`

## 實作對位

### 目前 use-case 檔案

- `application/use-cases/workspace-lifecycle.use-cases.ts`
- `application/use-cases/workspace-capabilities.use-cases.ts`
- `application/use-cases/workspace-access.use-cases.ts`
- `application/use-cases/workspace-member.use-cases.ts`
- `application/use-cases/wiki-content-tree.use-case.ts`
- `application/use-cases/workspace.use-cases.ts`（barrel only）

### 收斂方向

- `interfaces/api/`、`interfaces/cli/`、`interfaces/web/` 保持 thin driving adapters
- `ports/input/` 收斂 inbound contracts
- `application/services/` 作為跨 use case / 跨 aggregate 流程容器
- 應用層用語與 `aggregates.md`、`repositories.md`、`domain-events.md` 同步
