# AGENT.md — workspace BC

> **強制開發規範**  
> 本 BC 領域開發必須使用 Serena 指令：
> ```
> serena
> #use skill serena-mcp
> #use skill alistair-cockburn
> #use skill iddd-implementing-ddd
> #use skill xuanwu-app-skill
> #use skill context7

> ```

## 模組定位

`workspace` 是協作容器 bounded context，也是 Xuanwu 中的 generic subdomain。

它負責定義「工作區作為協作範圍」的核心語言與公開邊界，讓其他 bounded context 以 `workspaceId` 對齊範圍、生命週期與可見性。

`workspace` 不負責知識內容本身、組織成員真相來源、事件儲存基礎設施，也不把 UI tab 組裝視為 context map。

## 戰略層級（Domain / Subdomain / Bounded Context）

- `Xuanwu` 是整體 business domain
- `workspace` 所對應的問題空間在戰略分類上屬於 generic subdomain
- `modules/workspace/` 是承載這組語言、模型、應用流程與 adapter 的 bounded context
- `context-map.md` 描述 bounded context 與其他 bounded context 的關係；`aggregates.md`、`repositories.md`、`domain-events.md` 描述的是此 bounded context 內部的 tactical model
- Subdomain 是問題空間；Bounded Context 是語言、模型與整合邊界。兩者不可混同，也不保證一對一
- 這組文件是以 `workspace` 為中心的 selected view，不試圖重畫整個 Xuanwu domain

## Tactical 對位

- Aggregate Root：`Workspace`
- Driven Ports：`WorkspaceRepository`、`WorkspaceCapabilityRepository`、`WorkspaceAccessRepository`、`WorkspaceLocationRepository`、`WorkspaceQueryRepository`、`WikiWorkspaceRepository`、`WorkspaceDomainEventPublisher`
- Driving Adapters：`interfaces/_actions/`、`interfaces/queries/`、UI composition 與其他進入點
- Driven Adapters：`FirebaseWorkspaceRepository`、`FirebaseWorkspaceQueryRepository`、`FirebaseWikiWorkspaceRepository`、`SharedWorkspaceDomainEventPublisher`
- Projection / Read Model：`WorkspaceMemberView`、`WikiAccountContentNode`、`WikiWorkspaceContentNode`、`WikiContentItemNode`
- Read Projections：`WorkspaceMemberView`、`WikiAccountContentNode`、`WikiWorkspaceContentNode`
- Repository Ports：`WorkspaceRepository`、`WorkspaceCapabilityRepository`、`WorkspaceAccessRepository`、`WorkspaceLocationRepository`、`WorkspaceQueryRepository`、`WikiWorkspaceRepository`
- Domain Event Port：`WorkspaceDomainEventPublisher`
- Domain Events：`WorkspaceCreated`、`WorkspaceLifecycleTransitioned`、`WorkspaceVisibilityChanged`

## 六邊形交互順序（Runtime）

1. Driver 進入：UI / Server Actions / 其他 bounded context 呼叫 `api/`
2. Driving Adapter 轉換：`interfaces/*` 轉 command/query
3. Application Use Case 協調流程
4. Domain Model 套用 invariant（`Workspace` aggregate + value objects）
5. 透過 Driven Ports 呼叫外部能力（repositories / event publisher）
6. Infrastructure Adapters 實作 ports（Firebase / shared event publishing）

## 六邊形依賴方向（Compile-time）

- `interfaces -> application -> domain`
- `infrastructure -> domain`（實作 ports）
- `domain` 不可依賴 `interfaces`、`application`、`infrastructure`
- `modules/workspace/ports` 只放 port 抽象匯出，不放 adapter 實作

## DDD 概念對位（文件讀法）

- Entity（實體）→ 類別 / 物件；在 workspace 中例如 `WorkspaceLocation`、`Capability`
- Value Object（值對象）→ 類別 / 物件；在 workspace 中例如 `WorkspaceLifecycleState`、`WorkspaceVisibility`、`WorkspaceName`、`Address`
- Aggregate / Aggregate Root（聚合 / 聚合根）→ 類別 / 物件；此 BC 的 write-side aggregate root 是 `Workspace`
- Repository（倉儲）→ 介面或類別；`domain/repositories/` 定義 port，`infrastructure/` 類別負責資料存取
- Ports（端口）→ 介面；宣告 bounded context 核心與外部協作的接縫
- Adapters（適配器）→ 類別 / 函式 / 模組；把 driver 或外部系統轉成 port 可接受的契約
- 外部系統 / 驅動器（Driver）→ 從 bounded context 外部發起工作的角色 / 系統，例如 UI、Server Action、其他 context 呼叫者
- 投影 / Read Model → 查詢用途的物件；服務讀取與呈現，不承擔 write-side invariant
- Domain Service（領域服務）→ 類別 / 函式；僅在規則不自然屬於 aggregate 或 value object 時才新增
- Factory（工廠）→ 類別 / 函式；負責建立 aggregate、value object 或 domain event 訊息
- Domain Event（領域事件）→ 事件類別、訊息物件；例如 `WorkspaceCreatedEvent`

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Workspace` | Project、Space、Room |
| `WorkspaceLifecycleState` | WorkspaceStatus、ArchivedState |
| `WorkspaceVisibility` | VisibilityMode、DiscoveryState |
| `workspaceId` | projectId、spaceId |
| `accountId` | ownerId（在 workspace BC 內） |
| `WorkspaceMemberView` | `WorkspaceMember`（當你描述 read model 時） |
| `WikiAccountContentNode` / `WikiWorkspaceContentNode` | `WikiContentTree`（當你描述 aggregate 時） |

## 邊界規則

### ✅ 允許

```typescript
import { getWorkspaceById, WorkspaceDetailScreen } from "@/modules/workspace/api";
import type { WorkspaceEntity } from "@/modules/workspace/api";
```

### ❌ 禁止

```typescript
import { FirebaseWorkspaceRepository } from "@/modules/workspace/infrastructure/firebase/FirebaseWorkspaceRepository";
import { CreateWorkspaceUseCase } from "@/modules/workspace/application/use-cases/workspace.use-cases";
```

## 分層守衛

- `index.ts` 只能是薄入口；跨模組 consumer 應優先使用 `@/modules/workspace/api`
- `api/` 只能公開穩定 surface，不得直接變成 infrastructure 捷徑
- `interfaces/` 可使用本模組的 application/query adapters，但跨模組一律只能走對方 `api/`
- `infrastructure/` 禁止 import `api/`
- `FirebaseWikiWorkspaceRepository` 與 `FirebaseWorkspaceRepository` 之間維持本地相對路徑依賴，不透過模組公開入口繞回

## 六邊形對位

- Domain Model 在 bounded context 的核心：`domain/`
- Application layer 包在 domain model 外層：`application/`
- Driving Adapters 是進入此 bounded context 的入口：`interfaces/`、Server Actions、query wrappers、UI composition
- Driven Adapters 是對外技術整合：`infrastructure/`
- Repository ports 是內核朝外的 driven ports；adapter 可以替換，但 domain model 不應感知 Firebase / HTTP / React
- `api/` 是此 bounded context 對外暴露的穩定入口；它是公開邊界，不是把內部 layers 攤平
- 依賴方向維持 inward：`interfaces/` 與 `infrastructure/` 可以依賴 `application/`、`domain/`，但 `domain/` 不反向依賴外部技術
- 若採事件驅動整合，incoming / outgoing events 也是 bounded context 邊界的一部分，不改變 domain model 必須位於中心的原則
- Browser UI、Server Actions、其他 bounded context 對 `api/` 的呼叫者，都是此 hexagon 的 drivers；它們透過 adapters 進入，不直接碰 domain model
- `WorkspaceMemberView` 與 `Wiki*Node` 屬於 read model / projection，位於 query-side，不應回頭冒充 aggregate

## Tactical 建模守則

- `WorkspaceMemberView` 是 read projection，不是 aggregate、entity 或 value object
- `WikiContentTree.ts` 目前承載的是導覽/查詢模型，不是 write-side aggregate
- `WorkspaceLifecycleState` 的 canonical 值是 `preparatory | active | stopped`，不是 `active | archived`
- 若要新增跨 aggregate 規則，先判斷是否真的需要 domain service；不要用 application service 假裝 aggregate

## 驗證命令

```bash
npm run lint
npm run build
```

## 詳細文件

| 文件 | 說明 |
|---|---|
| [README.md](./README.md) | 模組定位與 tactical model 總覽 |
| [subdomain.md](./subdomain.md) | workspace 為何屬於 generic subdomain，以及哪些內容不是 subdomain 本體 |
| [bounded-context.md](./bounded-context.md) | workspace 作為 bounded context 的邊界、drivers、ports、adapters 與 read model |
| [ubiquitous-language.md](./ubiquitous-language.md) | workspace BC 的通用語言、read model 與 hexagonal 元術語 |
| [aggregates.md](./aggregates.md) | aggregate、entity、value object 與 read model / projection 對位 |
| [repositories.md](./repositories.md) | driven ports、repository adapters 與 query/read model 持久化邊界 |
| [domain-events.md](./domain-events.md) | workspace 領域事件契約、事件驅動整合與 projection 關係 |
| [application-services.md](./application-services.md) | application layer use cases、drivers、ports、adapters 與 read model orchestration |
| [domain-services.md](./domain-services.md) | domain service 與 ports/adapters/drivers/read models 的區別 |
| [context-map.md](./context-map.md) | workspace 與其他 bounded context 的 integration patterns |
| [ports/README.md](./ports/README.md) | workspace ports 清單、交互順序與依賴方向 |