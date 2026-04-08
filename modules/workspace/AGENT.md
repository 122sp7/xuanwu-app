# AGENT.md — workspace BC

> **強制開發規範**  
> 本 BC 領域開發必須使用 Serena 指令：
> ```
> serena
> #use skill xuanwu-app-skill
> #use skill serena-mcp
> #use skill context7
> #use skill alistair-cockburn
> #use skill iddd-implementing-ddd

> ```

## 模組定位

`workspace` 是協作容器 bounded context，也是 Xuanwu 中的 generic subdomain。

它負責定義「工作區作為協作範圍」的核心語言與公開邊界，讓其他 bounded context 以 `workspaceId` 對齊範圍、生命週期與可見性。

`workspace` 不負責知識內容本身、組織成員真相來源、事件儲存基礎設施，也不把 UI tab 組裝視為 context map。

## Tactical 對位

- Aggregate Root：`Workspace`
- Read Projections：`WorkspaceMemberView`、`WikiAccountContentNode`、`WikiWorkspaceContentNode`
- Repository Ports：`WorkspaceRepository`、`WorkspaceCapabilityRepository`、`WorkspaceAccessRepository`、`WorkspaceLocationRepository`、`WorkspaceQueryRepository`、`WikiWorkspaceRepository`
- Planned Domain Events：`WorkspaceCreated`、`WorkspaceLifecycleTransitioned`、`WorkspaceVisibilityChanged`

## DDD 概念對位（文件讀法）

- Entity（實體）→ 類別 / 物件；在 workspace 中例如 `WorkspaceLocation`、`Capability`
- Value Object（值對象）→ 類別 / 物件；在 workspace 中例如 `WorkspaceLifecycleState`、`WorkspaceVisibility`、`WorkspaceName`、`Address`
- Aggregate / Aggregate Root（聚合 / 聚合根）→ 類別 / 物件；此 BC 的 write-side aggregate root 是 `Workspace`
- Repository（倉儲）→ 介面或類別；`domain/repositories/` 定義 port，`infrastructure/` 類別負責資料存取
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
| [ubiquitous-language.md](./ubiquitous-language.md) | workspace BC 的通用語言與禁止術語 |
| [aggregates.md](./aggregates.md) | aggregate、entity、value object 與 read projection 對位 |
| [repositories.md](./repositories.md) | write/read repository ports 與 infrastructure adapters |
| [domain-events.md](./domain-events.md) | workspace 領域事件契約與發佈規則 |
| [application-services.md](./application-services.md) | application layer use cases、query orchestration 與 factory 落點 |
| [domain-services.md](./domain-services.md) | domain service 何時需要、目前是否存在 |
| [context-map.md](./context-map.md) | workspace 與其他 bounded context 的 integration patterns |