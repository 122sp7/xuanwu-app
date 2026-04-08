# Aggregates — workspace

本文件中的 Aggregate / Aggregate Root、Entity、Value Object 都以類別 / 物件來討論；它們是 workspace bounded context 的 write-side domain model，而不是 UI projection。

## Write-side Aggregate Root

### `Workspace`

`Workspace` 是此 bounded context 的 aggregate root。它代表一個協作範圍，並保護工作區生命週期、可見性與工作區範圍識別語言的一致性。

### 核心屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 工作區主鍵；建立後不可變更 |
| `name` | `string` | 工作區名稱 |
| `accountId` | `string` | 擁有工作區的 account / organization |
| `accountType` | `"user" \| "organization"` | 擁有者類型 |
| `lifecycleState` | `WorkspaceLifecycleState` | `preparatory | active | stopped` |
| `visibility` | `WorkspaceVisibility` | `visible | hidden` |
| `createdAt` | `Timestamp` | 建立時間 |

### 不變條件

- `id`、`accountId`、`accountType` 在建立後不可變更
- `lifecycleState` 的 canonical 語言是 `preparatory | active | stopped`
- `visibility` 的 canonical 語言是 `visible | hidden`
- 下游 context 只能在有效的 `workspaceId` 範圍內掛載資料與行為

## Supporting Domain Objects Inside `Workspace`

### Entities

| 類型 | 說明 |
|------|------|
| `WorkspaceLocation` | 以 `locationId` 識別的工作區位置節點 |
| `Capability` | 目前以 `id` 識別的工作區能力記錄；若治理規則成長，可再評估外拆 |
| `WorkspacePersonnelCustomRole` | 以 `roleId` 識別的人員自訂角色記錄 |

### Value Objects

| 類型 | 說明 |
|------|------|
| `WorkspaceLifecycleState` | 工作區生命週期值 |
| `WorkspaceVisibility` | 工作區可見性值 |
| `WorkspaceName` | 工作區名稱值，負責 trim 與基本字串約束 |
| `Address` | 地址值型資料 |
| `WorkspaceGrant` | 工作區授權記錄；以內容而非獨立 aggregate identity 判斷語意 |
| `WorkspacePersonnel` | 管理/監督/安全等角色參照集合 |
| `CapabilitySpec` | 能力定義的值型描述 |

## Read-side Projections（不是 Aggregate）

| 類型 | 說明 |
|------|------|
| `WorkspaceMemberView` | 工作區成員查詢投影，組合 workspace 與 organization 的資料 |
| `WorkspaceMemberAccessChannel` | 讀模型中的接入通道描述 |
| `WikiAccountContentNode` | 帳戶導覽節點 |
| `WikiWorkspaceContentNode` | 工作區導覽節點 |
| `WikiContentItemNode` | 導覽項 read projection |

`WorkspaceMemberView` 與 `Wiki*Node` 型別目前放在 `domain/entities/` 下，但語意上是 query-side projection，不是 write-side aggregate、entity 或 value object。

## Factory Boundary

- Factory（工廠）在本 context 中是類別 / 函式，用來建立 aggregate、value object 或對 reconstitution 做集中驗證
- `Workspace` 與 P1 value objects 應優先透過 factory / parser 建立，而不是由 interface adapter 任意拼接 raw object
- Factory 不是 Repository，也不是 Domain Service；它的責任是安全建立模型，不是持久化或協調流程

## Tactical Debt Notes

- `Workspace` aggregate 目前仍承載 capabilities、grants、locations、personnel 等 supporting records；若之後規則持續成長，應再評估切分 ownership
- P1 已正式落地於 `domain/value-objects/`：`WorkspaceLifecycleState`、`WorkspaceVisibility`、`WorkspaceName`、`Address`
- `WikiContentTree` 不是 write-side aggregate；它是為導覽組裝的 query model
- `WorkspaceMember` 不是目前的 canonical write-side 名稱；查詢模型請使用 `WorkspaceMemberView`
