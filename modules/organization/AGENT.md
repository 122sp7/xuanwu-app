# AGENT.md — modules/organization

## 模組定位

`modules/organization` 是 Knowledge Platform 的**通用域（Generic Domain）**，負責組織（團隊）管理、成員邀請與角色授權。是工作區的上層治理結構。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `Organization`（不是 Team、Company、Group）
- `Tenant`（multi-tenant 情境下的組織別名）
- `Member`（不是 User、Participant）
- `Role`（不是 Permission、Access）
- `Invitation`（不是 Invite、Request）

## 邊界規則

### ✅ 允許

```typescript
import { organizationApi } from "@/modules/organization/api";
import type { OrganizationDTO, MemberDTO } from "@/modules/organization/api";
```

### ❌ 禁止

```typescript
import { Organization } from "@/modules/organization/domain/...";
import { FirebaseOrganizationRepository } from "@/modules/organization/infrastructure/...";
```

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `identity/api` | API 呼叫 | 驗證使用者身分 |
| `workspace/api` | 提供服務 | 工作區需要組織範圍授權 |
| `account/api` | 提供服務 | 帳號政策需要組織角色 |
| `source/api` | 提供服務 | 文件存取需要組織範圍授權 |

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
