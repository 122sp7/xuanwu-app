# AGENT.md — workspace BC

> **文件優先原則**
> `workspace` 後續重構先以本文件與 companion docs 為準，再用文件去壓代碼收斂。
>
> **強制開發規範**
> 本 BC 領域開發必須使用 Serena 指令：
>
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

## 文件位置基線

```txt
modules/workspace/
├── api/                        ← Canonical public boundary（contracts / facade / ui）
│
├── domain/                     ← 核心業務邏輯
│   ├── aggregates/             ← 聚合根
│   ├── entities/               ← Entity / Value Object
│   ├── value-objects/
│   ├── events/                 ← Domain Events
│   ├── factories/              ← Domain Factories
│   └── services/               ← Domain Services（純業務邏輯）
│
├── application/                ← Use Case 層
│   ├── dtos/                   ← Input / Output DTO
│   ├── services/               ← Application Services（協調 Use Case 流程）
│   └── use-cases/              ← 單一 Use Case（呼叫 Domain Services + Output Ports）
│
├── ports/                      ← Hexagonal Ports
│   ├── input/                  ← Driving Ports（供 UI / API / CLI 呼叫）
│   └── output/                 ← Driven Ports（Repository / External Service 抽象）
│
├── infrastructure/             ← Adapters / Output Port 實作
│   ├── events/                 ← Event Dispatcher / PubSub 實作
│   └── firebase/               ← Firestore / Storage / Genkit Adapter
│
└── interfaces/                 ← Driving Adapters（外部入口）
	├── api/                    ← Adapter implementation（contracts / facades / queries / actions / runtime）
	├── cli/                    ← CLI / Cron Job → Input Port
	└── web/                    ← shadcn UI + navigation/state/view-models（components / hooks / navigation / state / utils / view-models）
```

## 戰略層級（Domain / Subdomain / Bounded Context）

- `Xuanwu` 是整體 business domain
- `workspace` 所對應的問題空間在戰略分類上屬於 generic subdomain
- `modules/workspace/` 是承載這組語言、模型、應用流程與 adapter 的 bounded context
- `context-map.md` 描述 bounded context 與其他 bounded context 的關係；`aggregates.md`、`repositories.md`、`domain-events.md` 描述的是此 bounded context 內部的 tactical model
- Subdomain 是問題空間；Bounded Context 是語言、模型與整合邊界。兩者不可混同，也不保證一對一
- 這組文件是以 `workspace` 為中心的 selected view，不試圖重畫整個 Xuanwu domain

## Tactical 對位

- Aggregate Root：`Workspace`
- Driving Adapters：`interfaces/api/`、`interfaces/cli/`、`interfaces/web/`
- Driving Ports：`ports/input/`
- Application Layer：`application/use-cases/`、`application/services/`、`application/dtos/`
- Domain Services：`domain/services/`
- Domain Models：`domain/aggregates/`、`domain/entities/`、`domain/value-objects/`
- Driven Ports：`ports/output/`（`WorkspaceRepository`、`WorkspaceCapabilityRepository`、`WorkspaceAccessRepository`、`WorkspaceLocationRepository`、`WorkspaceQueryRepository`、`WikiWorkspaceRepository`、`WorkspaceDomainEventPublisher`）
- Driven Adapters：`infrastructure/firebase/`、`infrastructure/events/`
- Projection / Read Model：`WorkspaceMemberView`、`WikiAccountContentNode`、`WikiWorkspaceContentNode`、`WikiContentItemNode`
- Read Projections：`WorkspaceMemberView`、`WikiAccountContentNode`、`WikiWorkspaceContentNode`
- Domain Events：`WorkspaceCreated`、`WorkspaceLifecycleTransitioned`、`WorkspaceVisibilityChanged`

## 六邊形交互順序（Runtime）

```txt
interfaces/api ─┐
interfaces/cli ─┤
interfaces/web ─┘
	 │ call
	 ▼
   ports/input
	 │ call
	 ▼
 application/use-cases
	 │ call
	 ▼
 application/services
	 │ call
	 ▼
  domain/services
	 │ use
	 ▼
  domain/aggregates/entities
	 │
	 └─► ports/output ──► infrastructure/* (Firebase / Genkit / Events)
```

### 說明

1. `interfaces/` 驅動系統，呼叫 Input Port。
2. `ports/input/` 是 Input Port 介面定義。
3. `application/use-cases/` 處理單一 use case，呼叫 Domain Services + Output Ports。
4. `application/services/` 協調多個 use case 或較長流程。
5. `ports/output/` 是 Output Port 介面，供 Application 呼叫外部資源。
6. `infrastructure/` 實作 Output Ports。
7. `domain/` 保持純業務邏輯，不依賴 Application 或 Infrastructure。

目前實際入口對位：

- `api/`：模組正式對外公開邊界（cross-module 與 app composition 應從這裡進入）
- `interfaces/api/`：同步 adapter implementation（contracts / facades / queries / actions / runtime）
- `interfaces/web/`：Web UI 與 hooks 進入點
- `ports/index.ts`：公開 port 抽象（input/output 聚合匯出）

## 六邊形依賴方向（Compile-time）

- `interfaces -> ports/input -> application -> domain`
- `application -> ports/output`
- `infrastructure -> ports/output`（實作 ports）
- `domain` 不可依賴 `interfaces`、`application`、`infrastructure`
- `modules/workspace/ports` 只放 port 抽象匯出，不放 adapter 實作

## DDD 概念對位（文件讀法）

- Entity（實體）→ 類別 / 物件；在 workspace 中例如 `WorkspaceLocation`、`Capability`
- Value Object（值對象）→ 類別 / 物件；在 workspace 中例如 `WorkspaceLifecycleState`、`WorkspaceVisibility`、`WorkspaceName`、`Address`
- Aggregate / Aggregate Root（聚合 / 聚合根）→ 類別 / 物件；此 BC 的 write-side aggregate root 是 `Workspace`
- Repository（倉儲）→ 介面或類別；`ports/output/` 暴露 port，`infrastructure/` 類別負責資料存取
- Ports（端口）→ 介面；宣告 bounded context 核心與外部協作的接縫
- Adapters（適配器）→ 類別 / 函式 / 模組；把 driver 或外部系統轉成 port 可接受的契約
- 外部系統 / 驅動器（Driver）→ 從 bounded context 外部發起工作的角色 / 系統，例如 UI、Server Action、其他 context 呼叫者
- 投影 / Read Model → 查詢用途的物件；服務讀取與呈現，不承擔 write-side invariant
- Domain Service（領域服務）→ 類別 / 函式；僅在規則不自然屬於 aggregate 或 value object 時才新增
- Application Service（應用服務）→ 類別 / 函式；協調多個 use case 或跨 aggregate 流程
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
| `Domain Service` | Flow Service、Handler（當你描述純邏輯時） |
| `Application Service` | Domain Service（當你描述流程協調時） |
| `ports/input` | Controller Layer（當你描述 port contract 時） |
| `ports/output` | Firebase Layer（當你描述抽象介面時） |

## 邊界規則

### ✅ 允許

```typescript
import { getWorkspaceById, WorkspaceDetailScreen } from "@/modules/workspace/api";
import type { WorkspaceRepository } from "@/modules/workspace/ports";
```

### ❌ 禁止

```typescript
import { FirebaseWorkspaceRepository } from "@/modules/workspace/infrastructure/firebase/FirebaseWorkspaceRepository";
import { CreateWorkspaceUseCase } from "@/modules/workspace/application/use-cases/workspace.use-cases";
```

## 分層守衛

- `api/index.ts`、`api/contracts.ts`、`api/facade.ts`、`api/ui.ts` 是 curated public surface；可以聚合公開符號，但不可回頭依賴 `app/` 或偷帶入 domain/application 決策
- `interfaces/api/`、`interfaces/cli/`、`interfaces/web/` 只做 driving adapter，不處理 domain 決策
- `application/use-cases/` 處理單一 use case，不吞進純業務規則
- `application/services/` 只負責流程，不替代 domain service
- `infrastructure/` 禁止 import `interfaces/`
- `FirebaseWikiWorkspaceRepository` 與 `FirebaseWorkspaceRepository` 之間維持本地相對路徑依賴，不透過模組公開入口繞回
- `modules/workspace` 內禁止 `import { X as Y } from ...` 的 alias import；若出現命名衝突，應調整符號命名或改為 namespace import 以維持通用語言一致性

## 六邊形對位

- Domain Model 在 bounded context 的核心：`domain/`
- Application layer 包在 domain model 外層：`application/`
- Driving Adapters 是進入此 bounded context 的入口：`interfaces/api/`、`interfaces/cli/`、`interfaces/web/`
- `ports/input/` 是 driving contract 的位置
- `ports/output/` 是內核朝外的 driven ports；adapter 可以替換，但 domain model 不應感知 Firebase / HTTP / React
- `interfaces/api/` 是公開邊界背後的同步 adapter implementation；真正的 cross-module surface 是 `api/`
- 依賴方向維持 inward：`interfaces/` 與 `infrastructure/` 可以依賴 `application/`、`domain/`，但 `domain/` 不反向依賴外部技術
- 若採事件驅動整合，incoming / outgoing events 也是 bounded context 邊界的一部分，不改變 domain model 必須位於中心的原則
- Browser UI、Route Handlers、CLI、其他 bounded context 對 `interfaces/api/` 的呼叫者，都是此 hexagon 的 drivers；它們透過 adapters 進入，不直接碰 domain model
- `WorkspaceMemberView` 與 `Wiki*Node` 屬於 read model / projection，位於 query-side，不應回頭冒充 aggregate

## Tactical 建模守則

- `WorkspaceMemberView` 是 read projection，應放在 query-side DTO，而不是 aggregate、entity 或 value object
- `WikiContentTree` 相關型別目前應放在 `application/dtos/`，不是 write-side aggregate
- `WorkspaceLifecycleState` 的 canonical 值是 `preparatory | active | stopped`，不是 `active | archived`
- 若要新增跨 aggregate 規則，先判斷是否真的需要 domain service；不要用 application service 假裝 aggregate
- 若要新增跨 use case 長流程，先放進 `application/services/`，不要把流程協調塞進 `domain/services/`

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

| [domain/aggregates/AGENT.md](./domain/aggregates/AGENT.md) | aggregate root 應放什麼、不該放什麼 |
| [domain/services/AGENT.md](./domain/services/AGENT.md) | 純業務邏輯的 domain service 規則 |
| [application/dtos/AGENT.md](./application/dtos/AGENT.md) | application DTO 邊界規則 |
| [application/services/AGENT.md](./application/services/AGENT.md) | application service 流程職責 |
| [ports/input/AGENT.md](./ports/input/AGENT.md) | input port contract 位置說明 |
| [ports/output/AGENT.md](./ports/output/AGENT.md) | output port contract 位置說明 |