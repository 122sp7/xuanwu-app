# Aggregates ??organization

## ???對?Organization

### ?瑁痊
隞?”銝??璆剜???蝘?恣?????～?隡???憭乩撈?隢???望???

### ?撅祆?

| 撅祆?| ? | 隤芣? |
|------|------|------|
| `id` | `string` | 蝯?銝駁 |
| `name` | `string` | 蝯??迂 |
| `members` | `MemberReference[]` | ??”嚗 role嚗?|
| `teams` | `Team[]` | 摮?隡?銵?|
| `partnerInvites` | `PartnerInvite[]` | ?芸????隢?銵?|

### 銝???

- ?? accountId ?典?銝 Organization 銝剖?賣?銝??MemberReference
- `Owner` 閫?喳??閬?雿?銝蝘駁?敺???Owner嚗?
- ????PartnerInvite嚗expired`嚗??賢?鋡急??

---

## ?潛隞?

| ?潛隞?| 隤芣? |
|--------|------|
| `MemberReference` | ?敹怎嚗d, name, email, role, presence嚗?|
| `Team` | 摮黎蝯?id, name, type, memberIds嚗?|
| `PartnerInvite` | ?隢???email, role, inviteState, invitedAt嚗?|
| `OrganizationRole` | `"Owner" \| "Admin" \| "Member" \| "Guest"` |
| `Presence` | `"active" \| "away" \| "offline"` |
| `InviteState` | `"pending" \| "accepted" \| "expired"` |

---

## Repository Interfaces

| 隞 | 銝餉??寞? |
|------|---------|
| `OrganizationRepository` | `save()`, `findById()`, `findByMemberId()` |
