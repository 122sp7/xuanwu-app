# AGENT.md — account BC

## 模組定位

`account` 是 Xuanwu 平台的**帳戶管理**有界上下文，負責用戶 profile 與存取控制政策。在伺服器端消費 `identity/api`。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Account` | User、Profile、Member（在此 BC 內） |
| `AccountPolicy` | Permission、AccessRule、Role（作為存取控制） |
| `customClaims` | Claims、FirebaseClaims |
| `accountId` | userId、uid（在此 BC 之外的引用應使用 accountId） |

## 邊界規則

### ✅ 允許
```typescript
import { accountApi } from "@/modules/account/api";
import type { AccountDTO, AccountPolicyDTO } from "@/modules/account/api";
```

### ❌ 禁止
```typescript
import { Account } from "@/modules/account/domain/entities/Account";
// account use-cases 在 server 端 — 不要在 use-cases 中 import React/client hooks
```

## 關鍵依賴規則

- `modules/account/application/use-cases/account.use-cases.ts` 與 `modules/account/application/use-cases/account-policy.use-cases.ts` 在 server 端執行，可 import `identity/api`
- 不要在 application 層 import 任何含 `"use client"` 的模組

## 驗證命令

```bash
npm run lint
npm run build
```
