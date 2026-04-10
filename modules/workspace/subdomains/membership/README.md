# workspace/subdomains/membership

## 子域職責

`membership` 子域負責工作區參與關係的正典邊界（獨立於 `platform.identity` 與 `platform.organization`）：

- 管理工作區成員的加入、角色指派、移除與邀請流程
- 維護工作區層級的角色定義（`WorkspaceRole`）與成員清單
- 提供工作區成員查詢與角色解析能力

## 核心語言

| 術語 | 說明 |
|---|---|
| `WorkspaceMembership` | 一個主體在特定工作區的參與記錄聚合根 |
| `WorkspaceRole` | 工作區層級的角色定義（`owner`、`editor`、`viewer` 等） |
| `MemberInvitation` | 邀請主體加入工作區的請求記錄 |
| `MembershipStatus` | 成員狀態（`invited`、`active`、`suspended`、`removed`） |
| `WorkspaceMemberId` | 工作區成員唯一識別碼（品牌型別） |

## Hexagonal shape

- `api/`: public 子域 boundary
- `application/`: use cases（`InviteMember`、`AcceptInvitation`、`AssignRole`、`RemoveMember`、`ListMembers`）
- `domain/`: `WorkspaceMembership`、`WorkspaceRole`、`MemberInvitation`
- `infrastructure/`: Firestore 成員資料存取
- `interfaces/`: server action 接線、成員管理 UI

## 整合規則

- `membership` 不等同於 `platform.organization`：organization 管理組織架構，membership 管理工作區參與
- 成員狀態變更觸發 `workspace.member-joined`/`workspace.member-removed` 事件，供 `feed` 與 `audit` 訂閱
- 父模組 public API（`@/modules/workspace/api`）是跨模組進入點

## Status

🔲 Gap — 尚未實作，依 docs/contexts/workspace/subdomains.md 建議建立
