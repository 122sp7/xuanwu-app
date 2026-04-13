# 2200 Hidden Coupling

- Status: Accepted
- Date: 2026-04-13
- Category: Coupling Smells > Hidden Coupling

## Context

隱式耦合（Hidden Coupling）指兩個或多個模組透過共享的**可變全域狀態**互相依賴，而非明確的介面依賴。這種耦合在靜態分析中不可見，但在執行時會造成初始化順序、並行安全、測試隔離等問題。

掃描後發現 **26 個** `let _xxx: ... | undefined` 模組級可變狀態（mutable module-level singletons），分布在多個子域：

### 違規清單（按嚴重性）

**高風險（位於業務關鍵路徑）：**

| 文件 | 變數 |
|------|------|
| `platform/subdomains/identity/interfaces/composition/identity-service.ts` | `_tokenRefreshRepo`, `_emitUseCase` |
| `platform/subdomains/account/interfaces/composition/account-service.ts` | `_accountRepo`, `_policyRepo` |
| `platform/subdomains/organization/interfaces/composition/organization-service.ts` | `_orgRepo`, `_policyRepo`, `_teamPort`, `_teamPortFactory` |
| `platform/api/platform-service.ts` | `_platformFacade` |
| `workspace/interfaces/api/runtime/workspace-runtime.ts` | `_sessionContext` |

**中風險（application 層 singleton）：**

| 文件 | 變數 |
|------|------|
| `platform/subdomains/ai/api/server.ts` | `_useCase` |
| `platform/subdomains/account/api/legacy-account-profile.bridge.ts` | `_accountQueryRepo` |
| `notebooklm/subdomains/source/application/use-cases/wiki-library.use-cases.ts` | `_eventPublisher` |
| `notebooklm/interfaces/source/composition/wiki-library-facade.ts` | `_libraryRepo` |
| `platform/subdomains/identity/interfaces/_actions/identity.actions.ts` | `_identityRepo` |

**低風險（isolated helpers）：**
`entitlement-service.ts`、`access-control-service.ts`、`notification-service.ts`、`subscription-service.ts`、`identity-service.ts`（_emitUseCase）、`account-profile-service.ts`（4 個）

### 特別危害

1. **測試隔離失敗**：一個測試設置了 `_accountRepo`，下一個測試繼承同一個 singleton，導致測試互相污染。
2. **React Fast Refresh 問題**：Next.js 的 HMR 重新評估模組時，`let _xxx = undefined` 會被重置，導致熱更新後 singleton 失效。
3. **並行請求衝突（Server Side）**：Next.js server-side rendering 中，多個請求共享同一個模組實例的 `let _xxx`，可能導致跨請求狀態污染。

## Decision

1. **組合根（Composition Root）中的 `let _xxx`** 是合理的延遲初始化模式（lazy singleton for DI），**但只允許出現在 `interfaces/composition/` 目錄**，不得出現在 `api/`、`application/` 或 domain 層。
2. **`application/` 層中的 singleton**（如 `wiki-library.use-cases.ts:_eventPublisher`）必須移除，改由外部注入（constructor DI 或 factory function 參數）。
3. **Server Action 文件（`_actions/`）中的 singleton**（如 `identity.actions.ts:_identityRepo`）應透過 composition root 注入，不自行持有 repository instance。
4. **測試環境**：composition root 的 singleton 應可被 reset（提供 `resetForTesting()` 或使用 factory function 方式）。

## Consequences

正面：
- 測試可在每個 test suite 獨立初始化 composition，避免跨測試污染。
- Next.js server rendering 中不存在跨請求狀態污染。

代價：
- `application/` 層中移除 singleton 後，use-case 的 `_eventPublisher` 必須改為 constructor 注入，需要更新 composition root 配置。
- `identity.actions.ts` 等 server action 文件改用 DI 注入後，需要調整 composition root wiring。
