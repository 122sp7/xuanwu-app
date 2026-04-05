# AGENT.md ??account BC

## 璅∠?摰?

`account` ??Xuanwu 撟喳??*撣單蝞∠?**??銝???鞎痊?冽 profile ????嗆蝑隡箸??函垢瘨祥 `identity/api`??

## ?隤?嚗biquitous Language嚗?

| 甇?Ⅱ銵? | 蝳迫雿輻 |
|----------|----------|
| `Account` | User?rofile?ember嚗甇?BC ?改? |
| `AccountPolicy` | Permission?ccessRule?ole嚗??箏???塚? |
| `customClaims` | Claims?irebaseClaims |
| `accountId` | userId?id嚗甇?BC 銋????冽?雿輻 accountId嚗?|

## ??閬?

### ???迂
```typescript
import { accountApi } from "@/modules/account/api";
import type { AccountDTO, AccountPolicyDTO } from "@/modules/account/api";
```

### ??蝳迫
```typescript
import { Account } from "@/modules/account/domain/entities/Account";
// account use-cases ??server 蝡???銝???use-cases 銝?import React/client hooks
```

## ?靘陷閬?

- `modules/account/application/use-cases/account.use-cases.ts` ??`modules/account/application/use-cases/account-policy.use-cases.ts` ??server 蝡臬銵???import `identity/api`
- 銝???application 撅?import 隞颱???`"use client"` ?芋蝯?

## 撽??賭誘

```bash
npm run lint
npm run build
```
