# AGENT.md — modules/account

## 模組定位

`modules/account` 是 Knowledge Platform 的**通用域（Generic Domain）**，負責使用者帳號的個人資料、偏好設定與帳號政策管理。與 `identity`（認證機制）分離——identity 負責「你是誰」，account 負責「你的資料」。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `Account`（不是 User、Profile）
- `Profile`（帳號的公開個人資訊）
- `Preferences`（不是 Settings、Config）
- `AccountPolicy`（不是 Policy、Rule）

## 最重要架構規則

`account/application/use-cases/*.ts` 在 **server 端** import `identityApi`：

```typescript
// account/application/use-cases/account.use-cases.ts
import { identityApi } from "@/modules/identity/api";  // server-safe 必須！
```

因此：
- **`identity/api` 必須永遠不含 `"use client"` 匯出**
- 若 identity/api 被污染，所有 account use-cases 都會在 server bundle 失敗

## 邊界規則

### ✅ 允許

```typescript
import { accountApi } from "@/modules/account/api";
import type { AccountDTO, ProfileDTO } from "@/modules/account/api";
```

### ❌ 禁止

```typescript
import { Account } from "@/modules/account/domain/...";
```

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| `identity/api` | API 呼叫（server） | 身分驗證基礎（必須 server-safe） |
| `organization/api` | API 呼叫（server） | 組織角色政策 |
| `workspace/api` | 提供服務 | 提供成員個人資料 |

## 驗證命令

```bash
npm run lint    # 0 errors expected
npm run build   # TypeScript type-check
```
