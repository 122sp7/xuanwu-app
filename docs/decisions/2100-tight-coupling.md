# 2100 Tight Coupling

- Status: Accepted
- Date: 2026-04-13
- Category: Coupling Smells > Tight Coupling

## Context

緊耦合（Tight Coupling）指模組直接依賴另一模組的具體實作，而非抽象合約，導致任一側的變更都對另一側造成直接影響。

掃描後發現兩類緊耦合問題：

### 問題一：78 個文件直接依賴 `platform/api`，形成超高扇入

```
modules/workspace  (21 files)
modules/notion     (19 files)
modules/notebooklm (16 files)
app/(shell)        (13 files)
app/_providers     (1 file)
app/(public)       (1 file)
modules/platform   (1 file)
```

`platform/api/index.ts` 是 153 行的集中再導出文件，混合了：
- 基礎設施 API（`firestoreInfrastructureApi` 等）
- 服務 API（`authApi`、`permissionApi`、`fileApi`）
- 子域 API（identity、account、organization、notification、background-job、ai）
- UI 元件（Shell* 系列、Organization* 系列）
- React hooks（`useApp`、`useShellGlobalSearch`）

78 個消費者中，大多數只需要某**一個**子域的能力，卻因為 `platform/api` 是單一 monolithic entry，只能引入整個集合。任何 `platform/api` 的 export 變更（rename、split、remove）都潛在影響這 78 個文件。

### 問題二：`platform/api/infrastructure-api.ts` 直接使用 Firebase SDK

```typescript
import { collectionGroup } from "firebase/firestore";
```

`api/` 層直接 import Firebase SDK 而非透過 `@integration-firebase` adapter，使 api/ 與 Firebase 實作緊耦合。若未來替換 Firestore，api/ 層也需要修改。

## Decision

1. **platform/api 拆分為多個語意邊界文件**：
   - `platform/api/index.ts` — 只重新導出穩定的跨域能力合約（auth、permission、file）
   - `platform/api/ui.ts` — UI 元件與 hooks（已有 workspace 的範例）
   - `platform/api/server.ts` — server-only 能力（AI 生成等）
   - 子域 api 直接 export from `../subdomains/<name>/api`
2. **消費者按需 import**：workspace、notion、notebooklm 應從精確路徑 import，而非整個 `platform/api`：
   ```typescript
   // ✅ 精確
   import { authApi } from "@/modules/platform/api";
   import { organizationService } from "@/modules/platform/subdomains/organization/api";
   
   // ❌ 過度依賴
   import { authApi, organizationService, ShellHeaderControls } from "@/modules/platform/api";
   ```
3. **`platform/api/infrastructure-api.ts`**：Firebase SDK 呼叫移至 `@integration-firebase` 內部，api/ 只引用 interface，不引用 SDK 實體。

## Consequences

正面：
- 修改 platform UI 元件不影響 workspace 的業務邏輯 import。
- 子域 api 可獨立版本化。

代價：
- 拆分 platform/api 後，現有的 78 個消費者需要更新 import 路徑，需分批執行。
- 需要在 eslint 規則中加入 `no-restricted-imports`，阻止新的 wildcard platform/api 使用。
