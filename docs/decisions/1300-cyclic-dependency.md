# 1300 Cyclic Dependency

- Status: Partially Resolved
- Date: 2026-04-13
- Annotated (all 4 chains): 2026-04-14
- Category: Architectural Smells > Cyclic Dependency

## Context

Hexagonal Architecture 要求依賴方向嚴格單向：`platform → workspace → notion → notebooklm`，且同一域內 `interfaces → application → domain ← infrastructure`。循環依賴（Cyclic Dependency）指兩個或多個模組互相直接或間接依賴，形成環形依賴鏈。

掃描後發現四條 `require(...)` 延遲載入用於**打破循環**的用法，每一個都暗示底層存在真正的循環依賴鏈：

### 循環鏈一：workspace ↔ platform（主域循環）

```
// modules/workspace/interfaces/api/runtime/workspace-runtime.ts:22
const platformApi = require("@/modules/platform/api");
// 代碼注釋：「Lazy-load the organization query functions to break the circular module
// evaluation chain: workspace-runtime → platform/api → organization/interfaces
// → organization/api → workspace (via barrel re-exports).」
```

**循環路徑**：`workspace-runtime` → `platform/api` → `organization/interfaces` → `organization/api` → **(barrel re-exports workspace)** → `workspace-runtime`

這是**主域間循環**，違反了 `platform → workspace`（單向）的 Context Map 規定。

### 循環鏈二：account ↔ identity（subdomain 循環）

```
// modules/platform/subdomains/account/infrastructure/identity-token-refresh.adapter.ts:26
const mod = require("../../identity/api") as { EmitTokenRefreshSignalUseCase: ... };
```

**循環路徑**：`account/infrastructure` → lazy `identity/api` → (identity emits back to account refresh path)

### 循環鏈三：organization ↔ team（subdomain 循環）

```
// modules/platform/subdomains/organization/interfaces/composition/organization-service.ts:84
const mod = require("../../../team/infrastructure/team-composition") as { ... };
```

**循環路徑**：`organization/interfaces/composition` → lazy `team/infrastructure` → (team uses organization context)

### 循環鏈四：account-profile ↔ account（subdomain 循環）

```
// modules/platform/subdomains/account-profile/interfaces/composition/account-profile-service.ts:46
const bridge = require("../../../account/api/legacy-account-profile.bridge") as { ... };
```

**循環路徑**：`account-profile/interfaces` → lazy `account/api/legacy-bridge` → (legacy bridge references account-profile state)

### 危害

- `require()` 延遲載入是**技術補丁**，不是架構修正：它掩蓋了真正的循環，但沒有解決依賴方向問題。
- 循環依賴使得模組無法獨立初始化、測試，任何一環的變更都可能引發不可預測的 module evaluation order 問題。
- Next.js/Turbopack 的 HMR 和打包優化在存在循環時行為不可預測。

## Decision

1. **主域間循環優先修復（workspace ↔ platform）**：
   - `organization/api` barrel 不得 re-export workspace 的任何符號。
   - workspace 需要 organization 的 query 功能，應透過依賴注入（constructor 傳入函式）而非直接 import。
2. **intra-platform subdomain 循環**（account↔identity、organization↔team、account-profile↔account）：
   - 使用 DI/Port pattern：依賴方定義 Port interface，被依賴方注入 adapter 實作，消除直接 import。
3. **所有 `require()` 延遲載入必須附帶 TODO**：標注對應循環鏈，列為架構債，直到真正的 DI 解法落地為止。
4. **新增依賴前執行循環檢查**：`eslint-plugin-import/no-cycle` 或 madge 可在 CI 中靜態偵測。

## Consequences

正面：
- 模組評估順序可預測，Next.js 打包穩定。
- 每個 subdomain 可獨立測試，不需要初始化其他子域。

代價：
- 修復 workspace ↔ platform 循環需要重新設計 `WorkspaceQueryApplicationService` 的 organization 資料注入方式（constructor DI 而非直接 import）。
- account ↔ identity 的 TokenRefresh adapter 需要改為 Port + 事件方式解耦，涉及 authentication 關鍵路徑。

## Partial Resolution

**部分解決（2026-04-13）**

以下 **barrel-chain 循環**已在先前 commit 中修復：

- **HX-1-002/003**：platform account/identity `api ↔ interfaces` barrel 循環 → 改為 _actions 直接從 composition root 導入
- **HX-1-004/005**：notebooklm conversation / notion collaboration `api ↔ interfaces` barrel 循環 → 同上
- **HX-1-001**：workspace ↔ notebooklm 跨模組循環 → ConversationPanel 從 notebooklm/api barrel 移除，workspace 使用 `next/dynamic` 直接載入
- **platform notification/organization/account-profile** barrel 循環 → _actions 改從 composition root 導入

**仍存在的 `require()` 延遲載入**（4 條，等待 Port + DI 解法）：

1. `workspace/interfaces/api/runtime/workspace-runtime.ts:22` — workspace ↔ platform 主域循環
2. `platform/subdomains/account/infrastructure/identity-token-refresh.adapter.ts:26` — account ↔ identity
3. `platform/subdomains/organization/interfaces/composition/organization-service.ts:84` — organization ↔ team
4. `platform/subdomains/account-profile/interfaces/composition/account-profile-service.ts:46` — account-profile ↔ account

## Resolution (HX-1-005 — 2026-04-14)

### 已完成：所有 4 個循環鏈均已標注 TODO(ADR-1300)

每個 `require()` 延遲載入呼叫已更新，加入 `TODO(ADR-1300)` 標注，說明：
- 所屬循環鏈（Chain A / B / C / D）
- 循環路徑描述
- 須保持 `require()` 直到 DI 注入方案落地

| 檔案 | 鏈 | 狀態 |
|------|----|------|
| `workspace/interfaces/runtime/workspace-runtime.ts` | A | ✅ 已標注 |
| `platform/subdomains/account/infrastructure/identity-token-refresh.adapter.ts` | B | ✅ 已標注 |
| `platform/subdomains/organization/interfaces/composition/organization-service.ts` | C | ✅ 已標注 |
| `platform/subdomains/account-profile/interfaces/composition/account-profile-service.ts` | D | ✅ 已標注 |

### 仍開放

真正的 DI 注入方案（移除 `require()` 本身）需要獨立的重構批次，以 constructor injection 取代模組層級自動配置。
