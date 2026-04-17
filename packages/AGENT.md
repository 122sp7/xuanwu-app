# packages — Agent Rules

此目錄是所有 **外部 SDK 與共享能力的唯一封裝層**。修改或新增任何套件前，先確認責任歸屬。

---

## Route Here（放這裡）

| 類型 | 正確套件 |
|---|---|
| Firebase SDK 封裝 | `integration-firebase/` |
| AI SDK（Genkit / Google AI）封裝 | `integration-ai/` |
| HTTP 用戶端封裝 | `integration-http/` |
| tRPC 客戶端設定 | `integration-trpc/` |
| 官方 shadcn/ui 新增組件（`npx shadcn add`）| `ui-shadcn/ui/` |
| **自訂 UI 組件（wrap 官方 / 設計擴充）** | **`ui-shadcn/ui-custom/`（唯一允許位置）** |

## Route Elsewhere（不放這裡）

| 類型 | 正確位置 |
|---|---|
| 業務邏輯（use case、domain rule） | `src/modules/<context>/domain/` 或 `application/` |
| Repository 實作 | `src/modules/<context>/adapters/outbound/` |
| 頁面組合與路由 | `src/app/` |
| 模組業務 UI pattern | `src/modules/<context>/interfaces/` |

---

## 嚴禁

```ts
// ❌ 在任何 packages/ 套件中 import modules
import { something } from '@/modules/...'

// ❌ 在 src/modules/ 直接 import 第三方 library
import { getFirestore } from 'firebase/firestore'

// ❌ 直接修改 ui-shadcn/ui/ 的官方組件
// ui/button.tsx ← 禁止手動編輯

// ✅ 自訂組件放 ui-custom/
// ui-custom/AppButton.tsx ← 正確位置
```

- 不得在套件層加入業務判斷邏輯
- 每個套件的 `index.ts` 是唯一公開入口
- 不得洩漏第三方 SDK 型別至消費端（能 wrap 就 wrap）

---

## 每個套件都有自己的 AGENTS.md

進入任何套件子目錄前，先讀該目錄的 `AGENTS.md`：

- [integration-firebase/AGENTS.md](./integration-firebase/AGENTS.md)
- [integration-ai/AGENTS.md](./integration-ai/AGENTS.md)
- [integration-http/AGENTS.md](./integration-http/AGENTS.md)
- [integration-trpc/AGENTS.md](./integration-trpc/AGENTS.md)
- [ui-shadcn/AGENTS.md](./ui-shadcn/AGENTS.md)
