# Ubiquitous Language — organization

> **範圍：** 僅限 `modules/organization/` 有界上下文內

## 術語定義

| 術語 | 英文 | 定義 |
|------|------|------|
| 組織 | Organization | 頂層多租戶單元，代表一個企業或團隊 |
| 成員參照 | MemberReference | 組織成員的輕量參照（含 accountId、role、presence） |
| 隊伍 | Team | 組織內的子群組（internal / external 類型） |
| 合作夥伴邀請 | PartnerInvite | 邀請外部合作夥伴加入隊伍的邀請記錄 |
| 組織角色 | OrganizationRole | 成員在組織中的角色：`Owner \| Admin \| Member \| Guest` |
| 在線狀態 | Presence | 成員的當前狀態：`active \| away \| offline` |
| 邀請狀態 | InviteState | 邀請的當前狀態：`pending \| accepted \| expired` |
| 政策效果 | PolicyEffect | 組織政策的效果：`allow \| deny` |

## 禁止替換術語

| 正確 | 禁止 |
|------|------|
| `Organization` | `Company`, `Tenant`, `Client` |
| `MemberReference` | `Member`, `OrgUser` |
| `OrganizationRole` | `Role`, `Permission` |
