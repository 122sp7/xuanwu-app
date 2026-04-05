# Aggregates — organization

## 聚合根：Organization

### 職責
代表一個企業或團隊租戶。管理所有成員、隊伍與合作夥伴邀請的生命週期。

### 關鍵屬性

| 屬性 | 型別 | 說明 |
|------|------|------|
| `id` | `string` | 組織主鍵 |
| `name` | `string` | 組織名稱 |
| `members` | `MemberReference[]` | 成員列表（含 role） |
| `teams` | `Team[]` | 子隊伍列表 |
| `partnerInvites` | `PartnerInvite[]` | 未完成的邀請列表 |

### 不變數

- 同一 accountId 在同一 Organization 中只能有一個 MemberReference
- `Owner` 角色至少需要一位（不可移除最後一個 Owner）
- 過期的 PartnerInvite（`expired`）不能再被接受

---

## 值物件

| 值物件 | 說明 |
|--------|------|
| `MemberReference` | 成員快照（id, name, email, role, presence） |
| `Team` | 子群組（id, name, type, memberIds） |
| `PartnerInvite` | 邀請記錄（email, role, inviteState, invitedAt） |
| `OrganizationRole` | `"Owner" \| "Admin" \| "Member" \| "Guest"` |
| `Presence` | `"active" \| "away" \| "offline"` |
| `InviteState` | `"pending" \| "accepted" \| "expired"` |

---

## Repository Interfaces

| 介面 | 主要方法 |
|------|---------|
| `OrganizationRepository` | `save()`, `findById()`, `findByMemberId()` |
