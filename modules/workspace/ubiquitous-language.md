# Ubiquitous Language — workspace

> **範圍：** 僅限 `modules/workspace/` bounded context 內

本文件除了領域名詞，也會用少量 DDD 元術語幫助閱讀 companion docs；這些術語是文件讀法，不是要取代 workspace 自己的通用語言。

## 核心術語

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作區 | `Workspace` | 協作容器的 aggregate root，代表一個工作區範圍 |
| 工作區 ID | `workspaceId` | `Workspace` 的業務識別子，也是跨 context 的範圍鍵 |
| 帳戶 ID | `accountId` | 擁有工作區的 account 或 organization 識別子 |
| 工作區生命週期 | `WorkspaceLifecycleState` | `preparatory | active | stopped` |
| 工作區可見性 | `WorkspaceVisibility` | `visible | hidden`，控制工作區是否可被發現 |

## Supporting Domain Objects

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作區授權 | `WorkspaceGrant` | 工作區上的直接授權記錄，描述 user/team 與 role 關係 |
| 工作區能力 | `Capability` | 目前掛載在工作區上的功能能力記錄 |
| 工作區位置 | `WorkspaceLocation` | 工作區底下帶 identity 的位置節點 |
| 工作區人員資訊 | `WorkspacePersonnel` | 工作區上的管理/監督/安全等角色參照集合 |
| 工作區地址 | `Address` | 工作區地址值型資料 |

## Read-side Projection Terms

| 術語 | 英文 | 定義 |
|------|------|------|
| 工作區成員檢視 | `WorkspaceMemberView` | 由 workspace + organization 資料組裝出的成員查詢投影 |
| 工作區成員接入通道 | `WorkspaceMemberAccessChannel` | 成員透過 owner/direct/team/personnel 進入工作區的路徑描述 |
| 工作區帳戶節點 | `WikiAccountContentNode` | 用於導覽查詢的帳戶層節點 |
| 工作區導覽節點 | `WikiWorkspaceContentNode` | 用於導覽查詢的工作區節點 |
| 工作區導覽項 | `WikiContentItemNode` | 導覽/捷徑用的 read projection，不是 domain aggregate |

## 命名守則

- aggregate 與 supporting objects 使用 `Workspace*` 前綴，保持 bounded context 可讀性
- `WorkspaceLifecycleState` 是 canonical 名稱，不使用 `WorkspaceStatus`
- `WorkspaceMemberView` 是 projection 名稱，不縮寫成 `WorkspaceMember`
- 若描述 query tree，使用 `WikiAccountContentNode` / `WikiWorkspaceContentNode` / `WikiContentItemNode`

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Workspace` | `Project`, `Space`, `Room` |
| `WorkspaceLifecycleState` | `WorkspaceStatus`, `ArchivedState` |
| `WorkspaceVisibility` | `VisibilityMode`, `DiscoveryState` |
| `WorkspaceMemberView` | `WorkspaceMember`, `Member`, `Participant` |
| `WikiAccountContentNode` / `WikiWorkspaceContentNode` | `WikiContentTree`, `PageTree`, `Hierarchy`（當你描述 aggregate 或 entity 時） |

## 語意說明

- `archived` 不是此 bounded context 的生命週期語言；停止中的工作區使用 `stopped`
- `WorkspaceMemberView` 與 `Wiki*Node` 是查詢模型，不等同 write-side domain objects
- `workspaceId` 是下游 context 對齊 workspace scope 的主要 published language

## 文件元術語對照

| 概念 | 在這組文件中的意思 |
|------|------------------|
| Entity（實體） | 類別 / 物件，具備 identity，語意上可跨時間被辨識 |
| Value Object（值對象） | 類別 / 物件，以值相等判斷語意，例如 `WorkspaceVisibility`、`Address` |
| Aggregate / Aggregate Root（聚合 / 聚合根） | 類別 / 物件，負責保護 write-side 一致性；workspace 的 aggregate root 是 `Workspace` |
| Repository（倉儲） | 介面或類別，負責 aggregate / projection 的資料存取 |
| Domain Service（領域服務） | 類別 / 函式，承載不自然屬於 aggregate / value object 的純領域規則 |
| Factory（工廠） | 類別 / 函式，負責建立 aggregate、value object、domain event 等有效模型 |
| Domain Event（領域事件） | 事件類別、訊息物件，作為對外發布的 domain language |
