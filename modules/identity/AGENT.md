# AGENT.md — modules/identity

## 模組定位

`modules/identity` 是 Knowledge Platform 的**通用域（Generic Domain）**，提供使用者身分驗證、Token 管理與認證狀態管理。所有其他模組都依賴此模組進行身分驗證。

## 通用語言（Ubiquitous Language）

在此模組內，**嚴格使用**以下術語：

- `Identity`（不是 User、Account）
- `Token`（不是 JWT、AuthToken）
- `AuthState`（不是 LoginState、SessionState）

## 最重要邊界規則

**`identity/api` 必須永遠保持 server-safe（無 "use client" 匯出）**

原因：`modules/account/application/use-cases/account.use-cases.ts` 在 server 端 import `identityApi`，若 api barrel 含有 React hooks 會導致 server bundle 錯誤。

```typescript
// ✅ 正確：server-safe 匯出放在 api/
export { verifyToken, getIdentity } from "./identity-facade";

// ❌ 禁止：不能在 api/index.ts 匯出任何 "use client" 內容
export { useIdentity } from "../interfaces/hooks/useIdentity"; // 嚴禁！
```

## "use client" hooks 的正確位置

```typescript
// ✅ 只能在 interfaces/hooks/ 下
// modules/identity/interfaces/hooks/useIdentity.tsx  ← "use client"
// modules/identity/interfaces/hooks/useTokenRefreshListener.tsx  ← "use client"
```

## 邊界規則

### ✅ 允許

```typescript
import { identityApi } from "@/modules/identity/api";  // server-safe
```

### ❌ 禁止

```typescript
import { useIdentity } from "@/modules/identity/api";  // "use client" 不能從 api barrel
import { FirebaseAuthAdapter } from "@/modules/identity/infrastructure/...";
```

## 跨模組互動

| 目標模組 | 互動方式 | 說明 |
|----------|----------|------|
| 所有模組 | 提供服務 | 提供身分驗證基礎能力 |
| `account/api` | 被依賴 | account use-cases 使用 identityApi 驗證身分 |

## 驗證命令

```bash
npm run lint    # 0 errors expected（特別注意 api/ 不含 "use client"）
npm run build   # TypeScript type-check
```
