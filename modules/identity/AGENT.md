# AGENT.md — identity BC

## 模組定位

`identity` 是 Firebase Authentication 的 domain 薄層封裝。無業務邏輯，只有驗證基礎設施抽象。

## 通用語言（Ubiquitous Language）

| 正確術語 | 禁止使用 |
|----------|----------|
| `Identity` | User、CurrentUser、AuthUser |
| `TokenRefreshSignal` | TokenEvent、RefreshToken |
| `signIn` | login、authenticate |
| `signOut` | logout |
| `uid` | userId、id（在此 BC 內） |

## 邊界規則

### ✅ 允許
```typescript
import { identityApi } from "@/modules/identity/api";
import type { IdentityDTO } from "@/modules/identity/api";
```

### ❌ 禁止
```typescript
import { useTokenRefreshListener } from "@/modules/identity/interfaces/hooks/useTokenRefreshListener";
// ❌ api/ 不能含 "use client" 匯出 — account use-cases 在 server 端 import api/
```

## 關鍵守衛

- `modules/identity/api/index.ts` 不得 re-export 任何含 `"use client"` 的檔案
- hooks（`useTokenRefreshListener`）只能從 interfaces 層使用，不可進入 api barrel

## 驗證命令

```bash
npm run lint
npm run build
```
