# Context Map — workspace

`workspace` 的 context map 只描述 bounded context 之間的關係與 integration patterns，不描述頁面 tab 組裝。

在這份文件裡，Aggregate Root 指的是對外提供 published language 的 domain 類別 / 物件；Domain Event 指的是跨 context 可發布的事件類別、訊息物件。Repository、Factory、Domain Service 不屬於 context map 的主體，但會支撐這些整合 surface 的實作。

## Upstream Contexts

### `account` → `workspace`（Customer/Supplier）

- `account` 提供 personal ownership 與 actor identity 的基礎語言
- `workspace.accountId` 在 personal scope 下對齊 `account`
- `workspace` 依賴 `account` 的存在，但不複製 account 的完整模型

### `organization` → `workspace`（Customer/Supplier + Read-side ACL）

- `organization` 提供 team、member 與 organization ownership 的真相來源
- `workspace.accountId + accountType="organization"` 讓工作區對齊組織範圍
- 在 query side，workspace 會把 organization 的成員/團隊語言翻譯成 `WorkspaceMemberView`
- 這種翻譯屬於 read-side anti-corruption / translation 行為，不代表 `workspace` 擁有組織模型

## Downstream / Dependent Contexts

### `workspace` → `knowledge`（Conformist）

- `knowledge` 使用 `workspaceId` 對齊知識頁面的工作區範圍
- `knowledge` 對工作區存在性、範圍與可見性語言採 conformist

### `workspace` → `knowledge-base`（Conformist）

- `knowledge-base` 以 `workspaceId` 作為文章與知識資產的工作區範圍鍵

### `workspace` → `source`（Conformist）

- `source` 以 `workspaceId` 管理文件與 library 的工作區範圍

### `workspace` → `notebook`（Conformist）

- `notebook` 以 `workspaceId` 作為查詢與 RAG 工作流範圍

### `workspace` → `workspace-flow`（Conformist）

- `workspace-flow` 以 `workspaceId` 對齊任務、issue、invoice 的工作區範圍

### `workspace` → `workspace-scheduling`（Conformist）

- `workspace-scheduling` 以 `workspaceId` 對齊排程與容量規劃範圍

### `workspace` → `workspace-feed`（Conformist）

- `workspace-feed` 以 `workspaceId` 對齊活動流範圍

### `workspace` → `workspace-audit`（Published Language / Conformist）

- `workspace-audit` 會消費工作區範圍資訊與後續 workspace domain events
- 在事件真正落地前，雙方仍主要透過同步 API 與共同範圍語言協作

## Public Integration Surfaces

| 類型 | Surface |
|---|---|
| 同步 API | `modules/workspace/api` |
| Published Language | `workspaceId`、`WorkspaceLifecycleState`、`WorkspaceVisibility` 等 aggregate / value object 語言 |
| 非同步事件（目標） | `workspace.created`、`workspace.lifecycle_transitioned`、`workspace.visibility_changed` 等 domain event 訊息物件 |

## Non-Examples

- `WorkspaceDetailScreen` 組合 `WorkspaceFlowTab`、`WorkspaceSchedulingTab`、`WorkspaceAuditTab` 是 UI composition，不是 strategic context map
- `WikiContentTree` 導覽節點是 query model，不是 context-to-context contract 的替代物

## IDDD 整合模式總結

| 關係 | 模式 | 備註 |
|------|------|------|
| `account` → `workspace` | Customer/Supplier | 個人 ownership 與 actor identity |
| `organization` → `workspace` | Customer/Supplier + Read-side ACL | workspace 讀模型翻譯 organization 資料 |
| `workspace` → `knowledge` | Conformist | 以 `workspaceId` 對齊內容範圍 |
| `workspace` → `knowledge-base` | Conformist | 以 `workspaceId` 對齊知識資產範圍 |
| `workspace` → `source` | Conformist | 以 `workspaceId` 對齊來源範圍 |
| `workspace` → `notebook` | Conformist | 以 `workspaceId` 對齊研究與 RAG 範圍 |
| `workspace` → `workspace-flow` | Conformist | 以 `workspaceId` 對齊工作流範圍 |
| `workspace` → `workspace-scheduling` | Conformist | 以 `workspaceId` 對齊排程範圍 |
| `workspace` → `workspace-feed` | Conformist | 以 `workspaceId` 對齊活動流範圍 |
| `workspace` → `workspace-audit` | Published Language / Conformist | 範圍資訊與後續事件消費 |
