# 1103 Layer Violation — Firebase SDK in platform/api/infrastructure-api.ts

- Status: ~~Accepted~~ → **Superseded by [ADR 0015](./0015-api-layer-removal.md)**
- Date: 2026-04-14
- Superseded by: [ADR 0015 – api/ Layer Removal](./0015-api-layer-removal.md)
- Category: Architectural Smells > Layer Violation

> **路徑說明**：此 ADR 描述的 `platform/api/infrastructure-api.ts` 路徑使用舊版 `module/api/` 結構。ADR 0015 已整體移除 `api/` 層；本 ADR 描述的違規路徑不再存在。Firebase SDK 應限定在 `infrastructure/` 適配器內的工程此則仍適用。

## Context

Hexagonal Architecture 的依賴方向規定：

```
interfaces/ → application/ → domain/ ← infrastructure/
```

`api/` 層是跨模組的**公開能力合約邊界**（capability contract boundary）。它只應暴露：

- Domain 型別（entity interfaces、value object types）
- Application DTO 型別
- Published Language token types
- Domain event 型別（type-only）
- 模組服務實例引用（composition root 的 facade）

Firebase SDK（`firebase/firestore`、`firebase/storage`、`firebase/functions` 等）屬於 `infrastructure/` 層的實作細節，不應出現在 `api/` 層。

### 違規發現

`modules/platform/api/infrastructure-api.ts` 直接 import Firebase SDK：

```typescript
// modules/platform/api/infrastructure-api.ts
import {
  functionsApi,
  firestoreApi,
  getFirebaseFirestore,
  getFirebaseFunctions,
  getFirebaseStorage,
  storageApi,
} from "@integration-firebase";
import { collectionGroup } from "firebase/firestore";  // ← Firebase SDK 直接在 api/ 層
```

該文件構建並匯出了 `firestoreInfrastructureApi`、`storageInfrastructureApi`、`genkitInfrastructureApi`、`functionsInfrastructureApi` 四個 SDK 實例，並從 `platform/api/index.ts` 再匯出：

```typescript
// modules/platform/api/index.ts (摘錄，見 ADR 1401)
export {
  firestoreInfrastructureApi,
  storageInfrastructureApi,
  genkitInfrastructureApi,
  functionsInfrastructureApi,
} from "./infrastructure-api";
```

**問題根源：**

1. `api/` 層包含 Firebase SDK 直接呼叫（`collectionGroup`）——這是 infrastructure 的實作，不是合約描述。
2. `infrastructure-api.ts` 的命名本身即表明其職責應在 `infrastructure/`，而不是 `api/`。
3. 跨模組消費者（如 `notion`、`notebooklm`）透過 `@/modules/platform/api` 直接取得 Firebase SDK adapter 實例，形成對 Firebase 運行時的**隱式依賴**。

### 與 ADR 1100 的關係

ADR 1100 在「違規二」中已標記此問題（`platform/api/infrastructure-api.ts Firebase SDK`），並說明「見 HX-1-002（待後續 Batch T1-B 處理）」。本 ADR 為該違規的專屬追蹤文件。

## Decision

1. **`infrastructure-api.ts` 應遷移至 `infrastructure/` 層**：Firebase adapter 實例的構建邏輯（`firestoreInfrastructureApi`、`storageInfrastructureApi` 等）應放在 `platform/infrastructure/adapters/firebase-infrastructure.ts` 或類似路徑。
2. **`api/` 層只持有 adapter interface 引用**：`platform/api/index.ts` 只 re-export adapter `interface`（合約型別），不 re-export 具體 SDK 實例。
3. **`collectionGroup` 直接呼叫移除**：任何 Firebase SDK 函式呼叫從 `api/` 層完全移除，封裝在 `@integration-firebase` 的 adapter 或 `infrastructure/` 的 repository 實作中。
4. **消費者使用 interface 注入**：`notion`、`notebooklm` 等下游模組若需要 Firestore/Storage 能力，應透過 `platform/api` 暴露的 interface 型別進行 Port 定義，由各自的 `infrastructure/` 注入對應 adapter 實例。

## Consequences

正面：
- `api/` 層恢復為純能力合約，不再包含任何運行時副作用。
- 測試環境可以 mock `platform/api` 的合約而不啟動 Firebase emulator。
- Firebase SDK 版本升級只影響 `infrastructure/` 和 `@integration-firebase` 兩個位置，不觸及 `api/` 邊界。

代價：
- 需要審查所有 `import ... from "@/modules/platform/api"` 的消費者，判斷其依賴是 interface 還是 SDK 實例。
- 現有 `notion`、`notebooklm` 中使用 `firestoreInfrastructureApi` / `storageInfrastructureApi` 的 infrastructure adapter 需更新 import 來源。

## 關聯 ADR

- **ADR 1100** (Layer Violation) — infrastructure-api.ts 在 api/ 層的問題最初在此 ADR「違規二」提出
- **ADR 1401** (Dependency Leakage) — SDK 實例從 platform/api/index.ts 直接 re-export，形成依賴洩漏
- **ADR 0007** (Infrastructure in api/) — 明確禁止 infrastructure 實作出現在 api/ 層
- **ADR 0001** (Hexagonal Architecture) — 依賴方向規範的根源
