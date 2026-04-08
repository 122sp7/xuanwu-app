# workspace — Application Services

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件定義 workspace application layer 的目標契約。Application layer 負責協調 aggregate、repository ports、query projections 與 domain event publishing，不承載 React UI state，也不作為跨模組偷渡 internal implementation 的入口。

## Application Layer 職責

- 協調 command-side use cases
- 協調 query-side use cases / projection builders
- 呼叫 repository ports 與必要的 domain service
- 在持久化成功後觸發 domain event publishing
- 保持 input/output 契約穩定，讓 `interfaces/` 可以薄適配

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

## Query-side Use Cases / Projection Builders

| Use Case / Function | 目的 |
|---|---|
| `FetchWorkspaceMembersUseCase` | 組合 `WorkspaceMemberView[]` |
| `buildWikiContentTree` | 組合工作區導覽樹 projection |

## Factories 與 Composition Points

- Domain event factories 應放在 domain events 檔案，不放在 UI 或 page component
- UI draft factories 應留在 `interfaces/` 或其他 UI-oriented layer，不應假裝成 application service
- Server Actions 與 query wrappers 是 interface adapter，不是 application service 本體

## 非目標

- 不保存 React component state
- 不直接 new 外部 module 的 UI component
- 不把 `WorkspaceDetailScreen` 的 tab composition 寫進 application layer

## 實作對位

### 目前 use-case 檔案

- `application/use-cases/workspace-lifecycle.use-cases.ts`
- `application/use-cases/workspace-capabilities.use-cases.ts`
- `application/use-cases/workspace-access.use-cases.ts`
- `application/use-cases/workspace-member.use-cases.ts`
- `application/use-cases/wiki-content-tree.use-case.ts`
- `application/use-cases/workspace.use-cases.ts`（barrel only）

### 收斂方向

- `interfaces/_actions/` 保持 thin orchestration
- `interfaces/queries/` 保持 thin query wrappers
- 應用層用語與 `aggregates.md`、`repositories.md`、`domain-events.md` 同步
