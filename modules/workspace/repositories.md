# workspace — Repositories

> **Canonical bounded context:** `workspace`
> **模組路徑:** `modules/workspace/`
> **Domain Type:** Generic Subdomain

本文件定義 workspace 的 repository ports 與對應 infrastructure adapters。workspace 目前同時存在 write-side 與 read-side repository，目的是把 aggregate 持久化與 projection 查詢分開。

在 workspace 中，Repository（倉儲）可以是介面或類別：`domain/repositories/` 裡的 port 是介面；`infrastructure/` 裡負責資料存取的 adapter 是類別。

從六邊形架構看，repository ports 是 domain/application 內核朝外宣告的 driven ports；Firebase 類別是被動端 adapter，不應反向把外部技術語言帶回 domain model。

從 event sourcing 視角補充：若未來採 event sourcing，Repository 會改為從 event store 讀取並重建 aggregate；但目前 workspace repository 是 current-state persistence，不是 event-sourced reconstitution。

## Ports and Adapters Distinction

- Port：`domain/repositories/` 中的介面，定義內核需要什麼能力
- Adapter：`infrastructure/` 中的類別，實作這些能力並接上 Firestore / 其他外部系統
- Driver 不直接呼叫 adapter；通常由 `interfaces/` / `application/` 協作後再使用對應 port

## Write-side Repository Ports

### `WorkspaceRepository`

`WorkspaceRepository` 現在只服務 `Workspace` aggregate 的核心持久化與設定更新。

#### 核心方法

- `findById(id)`
- `findByIdForAccount(accountId, workspaceId)`
- `findAllByAccountId(accountId)`
- `save(workspace)`
- `updateSettings(command)`
- `delete(id)`

### Supporting Record Ports

#### `WorkspaceCapabilityRepository`

- `mountCapabilities()` / `unmountCapability()`

#### `WorkspaceAccessRepository`

- `grantTeamAccess()` / `revokeTeamAccess()`
- `grantIndividualAccess()` / `revokeIndividualAccess()`

#### `WorkspaceLocationRepository`

- `createLocation()` / `updateLocation()` / `deleteLocation()`

這些 supporting operations 目前仍由 workspace 擁有，但不再混在核心 aggregate repository port 中；若之後 ownership 外拆，可直接替換對應 supporting port。

## Read-side Repository Ports

### `WorkspaceQueryRepository`

負責工作區查詢投影，而非 aggregate 持久化。

#### 方法

- `subscribeToWorkspacesForAccount(accountId, onUpdate)`
- `getWorkspaceMembers(workspaceId)`

這個 port 主要輸出 projection / read model，而不是 aggregate。

### `WikiWorkspaceRepository`

負責組合工作區導覽 tree 所需的最小工作區參照。

#### 方法

- `listByAccountId(accountId)`

這個 port 服務的是 read-side composition，因此它的輸出也應視為 read model input，而不是 aggregate source of truth。

## Infrastructure Adapters

| Adapter | 作用 |
|---|---|
| `FirebaseWorkspaceRepository` | `WorkspaceRepository`、`WorkspaceCapabilityRepository`、`WorkspaceAccessRepository`、`WorkspaceLocationRepository` 的 Firestore 實作 |
| `FirebaseWorkspaceQueryRepository` | `WorkspaceQueryRepository` 的 Firebase / organization read-side 組裝實作 |
| `FirebaseWikiWorkspaceRepository` | `WikiWorkspaceRepository` 的 Firestore 參照查詢實作 |

## 設計規則

- repository 介面定義在 `domain/repositories/`
- infrastructure adapters 實作在 `infrastructure/`
- `application/` 只依賴 repository ports，不依賴 adapter 類別
- 跨模組 consumer 不直接 import repository implementation；一律透過 `api/` 或對應 interface adapter 使用

## Tactical Debt Notes

- supporting records 仍然物理上儲存在同一份 workspace document，但 application layer 已改為依賴專用 supporting ports
- `WorkspaceQueryRepository` 同時承擔 read-side translation，尤其是把 `organization` 資料翻譯成 `WorkspaceMemberView`
- 事件目前用於發布與整合，不用來作為 repository 的唯一狀態來源
