# 1403 Dependency Leakage — Platform Subdomain api Barrels Export UI via `export * from "../interfaces"`

- Status: Accepted
- Date: 2026-04-14
- Category: Architectural Smells > Dependency Leakage

## Context

模組的 `api/index.ts` 是**跨模組能力合約邊界**。其允許的 export 型別：

1. Domain 型別（entity interface、value object type）
2. Application DTO 型別
3. Published Language token types
4. Domain event 型別（type-only）
5. Composition root facade 實例（service singleton 引用）

UI 元件（React components）、React hooks、context providers、server action 函式屬於 `interfaces/` 層的輸出，**不應出現在 `api/` 層的 contract surface**。

### 違規發現

4 個 platform subdomain `api/index.ts` 使用 `export * from "../interfaces"`，將整個 `interfaces/` 層的內容無差別地推入 `api/` 邊界：

| Subdomain | Export 語句 | 洩漏的 UI 內容 |
|-----------|------------|--------------|
| `account` | `export * from "../interfaces"` | `HeaderUserAvatar`、`NavUser`（React 元件）、server action 函式（`createUserAccount`、`creditWallet` 等） |
| `identity` | `export * from "../interfaces"` | `ShellGuard`（React 元件）、`AuthContext`、`AuthProvider`、`useAuth`、`useTokenRefreshListener`（React hook）、server action 函式（`register`、`signIn`、`signOut` 等） |
| `notification` | `export * from "../interfaces"` | `NotificationBell`、`NotificationsPage`、`SettingsNotificationsRouteScreen`（React 元件）、server action 函式 |
| `organization` | `export * from "../interfaces"` | `AccountSwitcher`、`CreateOrganizationDialog`、多個 `*RouteScreen` 元件、server action 函式（`createOrganization`、`inviteMember` 等） |

**具體問題：**

```typescript
// modules/platform/subdomains/account/api/index.ts
export * from "../application";   // ← use-case 類別洩漏（見 ADR 1402）
export * from "../interfaces";    // ← React UI 元件 + server actions 洩漏 ← 本 ADR
```

```typescript
// modules/platform/subdomains/notification/api/index.ts
export * from "../application";
export { notificationService } from "../interfaces/composition/notification-service";
export type { NotificationEntity, ... } from "../domain/entities/Notification";
export { NotificationBell } from "../interfaces/components/NotificationBell";  // 顯式 export
export { NotificationsPage } from "../interfaces/components/NotificationsPage"; // 顯式 export
export * from "../interfaces";   // ← 上方顯式 export 之後仍有 wildcard，雙重洩漏
```

### 影響

1. **API surface 膨脹**：消費者無法快速了解 `platform/api` 的公開合約，必須追蹤 `interfaces/` 下所有 export。
2. **React runtime 污染**：`export * from "../interfaces"` 會在 SSR/SSG 時強制載入 React 元件樹，即使消費者只需要型別或 service facade。
3. **版本不穩定性**：UI 元件重構（如 `HeaderUserAvatar` 更名）將成為跨模組的 breaking change，因為它們已被推入 `api/` 合約。
4. **與 ADR 1200（platform/api/ui.ts）衝突**：ADR 1200 的 Resolution 已將 UI 元件移至 `platform/api/ui.ts`，但各 subdomain 仍透過 `export * from "../interfaces"` 在各自的 `api/index.ts` 複現相同問題。

## Decision

1. **禁止 `api/index.ts` 使用 `export * from "../interfaces"`**：每個 subdomain 的 `api/index.ts` 必須改為顯式 export，只暴露跨模組合約所需的符號。
2. **UI 元件 → `api/ui.ts`**：React 元件、hooks、providers 需要被跨模組消費時，應放在 `{subdomain}/api/ui.ts`（命名空間與 platform root 的 `platform/api/ui.ts` 一致）。
3. **Server actions 保留在 `interfaces/`**：server action 函式是 Next.js 服務端實作，由 `app/` 層直接 import，不應透過 `api/` 合約傳遞給其他模組。
4. **遷移優先順序**：`organization` > `account` > `identity` > `notification`（按消費者數量與 UI 洩漏體積排序）。

## Consequences

正面：
- 每個 subdomain `api/index.ts` 可快速閱讀，一眼看清公開合約。
- Next.js 的 tree-shaking 可精確排除 UI bundle，SSR-only 路徑不再載入客戶端 UI。
- UI 重構不再成為跨模組 breaking change。

代價：
- 4 個 subdomain 的 `api/index.ts` 需要改寫，從 wildcard 改為顯式 export list（需掃描所有消費者確認無遺漏）。
- 若有消費者依賴 wildcard 帶來的 UI symbol，需同步更新 import 來源至 `api/ui.ts`。

## 關聯 ADR

- **ADR 1400** (Dependency Leakage) — 系列入口文件
- **ADR 1401** (Dependency Leakage — SDK instances in platform/api) — 同類問題：api/ 夾帶 infrastructure 層實體
- **ADR 1402** (Dependency Leakage — use-case classes in platform/api) — 同類問題：api/ 夾帶 application 層 class
- **ADR 1200** (Boundary Violation — platform/api mixed UI) — 主模組層面已建立 `api/ui.ts` 分離模式，subdomain 需跟進
- **ADR 0001** (Hexagonal Architecture) — 依賴方向規範根源
