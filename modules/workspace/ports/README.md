# workspace ports

此資料夾是 `workspace` bounded context 的顯式 ports 入口。

## 目的

- 集中列出 hexagonal architecture 的 port 介面（只有 interface/type，沒有實作）
- 讓 `ports/` 不再是空殼目錄
- 清楚區分 `ports`（抽象）與 `infrastructure`（adapter 實作）

## 交互順序（Runtime Flow）

1. Driver：UI / Server Action / 其他 bounded context 呼叫 `api/`
2. Driving Adapter：`interfaces/*` 把請求轉成 command/query
3. Application Use Case：協調流程與授權邊界
4. Domain Model：`Workspace` aggregate 與 value objects 套用 invariant
5. Driven Port：`ports/index.ts` 匯出的 repository/event publisher 介面
6. Driven Adapter：`infrastructure/*` 實作 port（Firebase / shared event bus）

## 依賴方向（Compile-time）

- `interfaces -> application -> domain`
- `infrastructure -> domain`（實作 ports）
- `domain` 不可反向依賴 `interfaces`、`application`、`infrastructure`
- `ports` 只匯出抽象，不可匯出 adapter 類別

## 目前 Port 清單

- `WorkspaceRepository`
- `WorkspaceCapabilityRepository`
- `WorkspaceAccessRepository`
- `WorkspaceLocationRepository`
- `WorkspaceQueryRepository`
- `WikiWorkspaceRepository`
- `WorkspaceDomainEventPublisher`
