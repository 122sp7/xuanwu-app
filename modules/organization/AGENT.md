# AGENT.md — organization BC

## 模組定位

`organization` 是 Xuanwu 的多租戶管理有界上下文，管理 Organization 聚合根、成員、隊伍與邀請流程。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Organization` | Company、Tenant、Team（作為頂層組織）、Client |
| `MemberReference` | Member、User（在組織上下文中）|
| `Team` | Group、Squad（作為組織子群組） |
| `PartnerInvite` | Invitation、InviteLink |
| `OrganizationRole` | Role、Permission（作為組織角色） |
| `Presence` | Status、OnlineStatus |

## 邊界規則

### ✅ 允許
```typescript
import { organizationApi } from "@/modules/organization/api";
import type { OrganizationDTO, MemberReferenceDTO } from "@/modules/organization/api";
```

### ❌ 禁止
```typescript
import { Organization } from "@/modules/organization/domain/entities/Organization";
```

## 驗證命令

```bash
npm run lint
npm run build
```
