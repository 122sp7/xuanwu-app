# packages — Agent Rules

此目錄是所有 **外部 SDK 與共享能力的唯一封裝層**。修改或新增任何套件前，先確認責任歸屬。

---

## Route Here（放這裡）

### 🧱 infra/* — 基礎設施原語層

| 類型 | 正確套件 |
|---|---|
| client-side 狀態原語（非業務） | `infra/client-state/` → `@infra/client-state` |
| HTTP 工具（fetch wrapper、retry） | `infra/http/` → `@infra/http` |
| 序列化 / 反序列化工具 | `infra/serialization/` → `@infra/serialization` |
| 本地狀態管理原語（Zustand store factory、XState machine helpers） | `infra/state/` → `@infra/state` |
| tRPC 客戶端設定與 Provider（連接自己的 server，非第三方服務） | `infra/trpc/` → `@infra/trpc` |
| UUID 生成（domain 層 id 的唯一來源） | `infra/uuid/` → `@infra/uuid` |
| Zod 共用 schema 片段、brand helper | `infra/zod/` → `@infra/zod` |

### 🔌 integration-* — 外部服務整合層

| 類型 | 正確套件 |
|---|---|
| AI 服務整合（Genkit 封裝、Google AI、OpenAI） | `integration-ai/` → `@integration-ai` |
| Firebase 整合（App 初始化、Firestore、Auth、Storage、Functions、Realtime） | `integration-firebase/` → `@integration-firebase` |
| 訊息佇列整合（QStash、Cloud Tasks） | `integration-queue/` → `@integration-queue` |

### 🎨 ui-* — UI 元件層

| 類型 | 正確套件 |
|---|---|
| 業務無關自訂 UI 元件（wrap、design-system 擴充） | `ui-components/` → `@ui-components` |
| 富文本編輯器（TipTap 封裝） | `ui-editor/` → `@ui-editor` |
| Markdown 渲染元件 | `ui-markdown/` → `@ui-markdown` |
| 官方 shadcn/ui 組件（`npx shadcn add`） | `ui-shadcn/` → `@ui-shadcn`（CLI 管理，禁止手動修改） |
| 數據視覺化元件（圖表、圖形） | `ui-visualization/` → `@ui-visualization` |

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

## 公開匯出規則

- 所有子套件需維持各自 `index.ts` 作為公開入口
- `packages/index.ts` 必須具名匯出所有套件（`infra-*`、`integration-*`、`ui-*`）
- 新增套件時，需同步更新本檔、`packages/README.md`、`packages/index.ts`

---

## 每個套件都有自己的 AGENTS.md

進入任何套件子目錄前，先讀該目錄的 `AGENTS.md`：

**infra/***
- [infra/client-state/AGENTS.md](./infra/client-state/AGENTS.md)
- [infra/http/AGENTS.md](./infra/http/AGENTS.md)
- [infra/serialization/AGENTS.md](./infra/serialization/AGENTS.md)
- [infra/state/AGENTS.md](./infra/state/AGENTS.md)
- [infra/trpc/AGENTS.md](./infra/trpc/AGENTS.md)
- [infra/uuid/AGENTS.md](./infra/uuid/AGENTS.md)
- [infra/zod/AGENTS.md](./infra/zod/AGENTS.md)

**integration-***
- [integration-ai/AGENTS.md](./integration-ai/AGENTS.md)
- [integration-firebase/AGENTS.md](./integration-firebase/AGENTS.md)
- [integration-queue/AGENTS.md](./integration-queue/AGENTS.md)

**ui-***
- [ui-components/AGENTS.md](./ui-components/AGENTS.md)
- [ui-editor/AGENTS.md](./ui-editor/AGENTS.md)
- [ui-markdown/AGENTS.md](./ui-markdown/AGENTS.md)
- [ui-shadcn/AGENTS.md](./ui-shadcn/AGENTS.md)
- [ui-visualization/AGENTS.md](./ui-visualization/AGENTS.md)
