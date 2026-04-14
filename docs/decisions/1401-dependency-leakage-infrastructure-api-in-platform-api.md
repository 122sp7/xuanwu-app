# 1401 Dependency Leakage — Infrastructure API symbols exported from `platform/api/index.ts`

- Status: Resolved
- Resolved: 2026-04-14
- Date: 2026-04-14
- Category: Architectural Smells > Dependency Leakage

## Context

`platform/api/index.ts` 是 platform 主域的公開能力邊界，其語意是「跨域語意能力合約」
（auth、permission、file、identity 等能力的穩定合約）。

然而，`platform/api/index.ts` 目前直接 re-export 四個 **Infrastructure API 符號**：

```typescript
// modules/platform/api/index.ts (lines 14–19)
export {
  firestoreInfrastructureApi,
  storageInfrastructureApi,
  genkitInfrastructureApi,
  functionsInfrastructureApi,
} from "./infrastructure-api";
```

### 問題分析

`infrastructure-api.ts` 是一個實作導向的工廠物件，直接包含：
- Firebase Firestore SDK 呼叫（`collectionGroup`、`getFirestore`）
- Firebase Storage SDK 呼叫（`getFirebaseStorage`）
- Firebase Functions SDK 呼叫（`getFirebaseFunctions`）
- Genkit AI 底層呼叫

這些是 **技術實作能力（technical capability）**，不是 **語意業務合約（semantic business contract）**。

#### 使用者分析

目前使用 `firestoreInfrastructureApi`、`storageInfrastructureApi` 的消費者：

| 消費者 | 層次 | 是否合理 |
|--------|------|---------|
| `platform/api/service-api.ts` | api（內部使用） | ⚠️ api 層不應直接用 infra |
| `workspace/subdomains/audit/infrastructure/firebase/FirebaseAuditRepository.ts` | infrastructure | ✅ infra → infra 跨模組可接受 |
| `workspace/subdomains/workspace-workflow/infrastructure/repositories/Firebase*.ts` | infrastructure | ✅ infra → infra 跨模組可接受 |
| `notion/infrastructure/knowledge/firebase/Firebase*Repository.ts` | infrastructure | ✅ infra → infra 跨模組可接受 |
| `notebooklm/subdomains/source/infrastructure/firebase/Firebase*Repository.ts` | infrastructure | ✅ infra → infra 跨模組可接受 |

infrastructure → infrastructure 的跨模組使用（`@/modules/platform/api`）在功能上可運作，
但**路由路徑有問題**：notion/notebooklm/workspace 的 infrastructure 倉庫應從更精確的路徑 import
基礎設施能力，而非透過 `platform/api/index.ts`（公開業務邊界）。

#### 核心危害

1. **邊界語意污染**：`platform/api` 的公開邊界混入了 Firebase SDK 實作細節，
   任何訂閱 `platform/api` 變更的消費者都可能誤以為 infrastructure 能力是穩定的能力合約。

2. **版本穩定性風險**：若 platform 未來替換 Firestore 為其他 DB，
   `firestoreInfrastructureApi` 的 interface 改動會透過 `api/index.ts` 的公開邊界
   成為 **breaking change**，影響所有消費 `platform/api` 的 78 個文件（見 ADR 2100）。

3. **語意混淆**：api boundary 的合約文件（`contracts.ts`）定義了
   `FirestoreAPI`、`StorageAPI`、`GenkitAPI` 等**介面型別**（semantic contracts），
   而 `infrastructure-api.ts` 提供這些介面的**實作物件**。
   兩者都透過 `api/index.ts` 暴露，使消費者難以分辨「合約」與「實作」的差異。

## Decision

1. **從 `platform/api/index.ts` 移除 infrastructure symbols 的 re-export**：
   ```typescript
   // 移除這段：
   export {
     firestoreInfrastructureApi,
     storageInfrastructureApi,
     genkitInfrastructureApi,
     functionsInfrastructureApi,
   } from "./infrastructure-api";
   ```

2. **建立 `platform/api/infrastructure.ts`**（可選，若需要統一入口）：
   若跨模組的 infrastructure 層確實需要一個穩定的 import 路徑，
   可建立 `platform/api/infrastructure.ts` 作為**獨立的 infrastructure capability 邊界**，
   明確標注「此文件供 infrastructure adapters 使用，非業務合約邊界」。
   ```typescript
   // platform/api/infrastructure.ts — NOT part of capability contract boundary
   // For use by infrastructure adapters only (repositories, external service adapters).
   export { firestoreInfrastructureApi, storageInfrastructureApi, ... }
     from "./infrastructure-api";
   ```

3. **消費者遷移**：
   - `platform/api/service-api.ts`：改為直接 import from `"./infrastructure-api"`（同層，無需 api 路徑繞行）。
   - `workspace/notion/notebooklm` infrastructure repositories：
     改為 import from `@/modules/platform/api/infrastructure`
     或直接 `@/modules/platform/infrastructure`（若重新暴露為 infra 邊界）。

4. **遷移優先級**：`service-api.ts` 最優先（消除 api 層內部的循環路徑），
   notion/notebooklm/workspace infrastructure 其次。

## Consequences

正面：
- `platform/api/index.ts` 成為純語意業務合約邊界，不含任何 Firebase SDK 物件。
- 替換 Firestore 時的影響範圍縮小為 `platform/infrastructure/` 和 `platform/api/infrastructure.ts`，
  不波及 78 個 `platform/api` 消費者。

代價：
- 約 15 個 infrastructure 文件需要更新 import 路徑（從 `@/modules/platform/api` 改為精確路徑）。
- 需要確認沒有消費者同時依賴業務合約符號與 infrastructure 符號（可能需要兩個 import 語句）。

## 關聯 ADR

- **2100** (Tight Coupling)：platform/api monolith 的拆分需求（infrastructure 是其中一種不應混入的職責）
- **3100** (Low Cohesion)：platform/api 四種職責混合，infrastructure 是其中之一
- **1400** (Dependency Leakage)：use-case class 洩漏的同源問題（api 邊界承載了過多不屬於它的符號）

## Resolution

Created `modules/platform/api/infrastructure.ts` as a dedicated infrastructure-adapter entry point with JSDoc warning it is not part of the capability-contract boundary.
Removed `firestoreInfrastructureApi`, `storageInfrastructureApi`, `genkitInfrastructureApi`, `functionsInfrastructureApi` from `modules/platform/api/index.ts`.
Updated 41 infrastructure consumer files (modules/workspace, modules/notion, modules/notebooklm, app/dev-tools) to import from `@/modules/platform/api/infrastructure` instead of `@/modules/platform/api`.
