# Domain Events ??organization

## ?澆鈭辣

| 鈭辣 | 閫貊璇辣 | ?甈? |
|------|---------|---------|
| `organization.created` | ?啁?蝜遣蝡? | `organizationId`, `name`, `ownerId`, `occurredAt` |
| `organization.member_invited` | ?鋡恍?隢???| `organizationId`, `inviteId`, `email`, `role`, `occurredAt` |
| `organization.member_joined` | ?隢◤?亙?嚗??∪???| `organizationId`, `accountId`, `role`, `occurredAt` |
| `organization.member_removed` | ?鋡怎宏??| `organizationId`, `accountId`, `occurredAt` |
| `organization.team_created` | ??Team 撱箇? | `organizationId`, `teamId`, `occurredAt` |

## 閮鈭辣

`organization` 銝??勗隞?BC ??隞塚?鋡怠?嚗?敺?account ??閫貊嚗?

## 鈭辣?澆?蝭?

```typescript
interface OrganizationMemberJoinedEvent {
  readonly type: "organization.member_joined";
  readonly organizationId: string;
  readonly accountId: string;
  readonly role: OrganizationRole;
  readonly occurredAt: string;  // ISO 8601
}
```
