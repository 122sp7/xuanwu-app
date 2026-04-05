# AGENT.md ??organization BC

## 璅∠?摰?

`organization` ??Xuanwu ??蝘蝞∠???銝???蝞∠? Organization ???嫘??～?隡??隢?蝔?

## ?隤?嚗biquitous Language嚗?

| 甇?Ⅱ銵? | 蝳迫雿輻 |
|----------|----------|
| `Organization` | Company?enant?eam嚗??粹?撅斤?蝜??lient |
| `MemberReference` | Member?ser嚗蝯?銝??葉嚗
| `Team` | Group?quad嚗??箇?蝜?蝢斤?嚗?|
| `PartnerInvite` | Invitation?nviteLink |
| `OrganizationRole` | Role?ermission嚗??箇?蝜??莎? |
| `Presence` | Status?nlineStatus |

## ??閬?

### ???迂
```typescript
import { organizationApi } from "@/modules/organization/api";
import type { OrganizationDTO, MemberReferenceDTO } from "@/modules/organization/api";
```

### ??蝳迫
```typescript
import { Organization } from "@/modules/organization/domain/entities/Organization";
```

## 撽??賭誘

```bash
npm run lint
npm run build
```
