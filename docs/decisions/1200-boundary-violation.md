# 1200 Boundary Violation

- Status: Accepted
- Date: 2026-04-13
- Category: Architectural Smells > Boundary Violation

## Context

模組邊界規則要求：跨模組協作必須透過目標模組的 `api/index.ts` 進行；任何模組不得直接 import 另一模組的 `domain/`、`application/`、`infrastructure/`、`interfaces/` 內部。

掃描後沒有發現跨模組的直接 internal import 違規（`grep` 零結果）。但發現三類**隱性邊界侵蝕**：

### 違規一：`platform/api/index.ts` 暴露 UI 元件

`platform/api/index.ts` 導出了以下 UI 元件與 React hook：

```typescript
// UI 元件（本應屬 interfaces/）
AccountSwitcher, CreateOrganizationDialog,
OrganizationOverviewRouteScreen, MembersPage, ...
ShellHeaderControls, ShellThemeToggle, ShellNotificationButton,
ShellUserAvatar, ShellTranslationSwitcher, ShellAppBreadcrumbs,
ShellGlobalSearchDialog

// React hooks
useApp, useShellGlobalSearch, useAccountRouteContext
```

`api/` 邊界的語意是「跨模組語意能力合約」（use-case、commands、queries、domain types），不是「UI 元件導出通道」。將 React 元件暴露於 `api/` 邊界會讓 workspace、app/ 等消費者依賴 platform 的 UI 實作細節，形成隱性邊界滲漏。

**影響範圍：**
```
modules/notion (19 files) - 部分 import platform/api
modules/workspace (21 files)
modules/notebooklm (16 files)
app/(shell) (13 files)
```

### 違規二：notion/interfaces 依 subdomain 命名，而非依技術層命名

```
notion/interfaces/knowledge/  ← 這是 subdomain 名稱，不是 "web" / "api"
notion/interfaces/collaboration/
notion/interfaces/database/
...
```

相比 workspace 的 `interfaces/web/` 與 `interfaces/api/`，notion 的 interfaces 直接用子域名稱分組，導致「interfaces 是技術層」與「interfaces 是子域容器」的語意混淆，破壞跨模組閱讀一致性。

### 違規三：workspace/api/ui.ts 在公開 api 邊界暴露 UI 元件

```typescript
// workspace/api/ui.ts
export { WorkspaceDetailScreen } from "../interfaces/web/components/...";
export { WorkspaceHubScreen } from "../interfaces/web/components/...";
...
```

與 platform 的問題相同：UI 元件不應出現在 `api/` 邊界層。

## Decision

1. **`api/` 邊界只允許以下類型**：
   - 跨模組能力合約（use-case class、service interface）
   - Published Language token types
   - Domain event types（type-only）
   - Application command/query input types
2. **UI 元件與 React hooks 屬 `interfaces/` 層**，由 `app/` 組裝層直接 import from `@/modules/<module>/interfaces/web/...` 或透過 `api/ui.ts` 的**獨立 UI 邊界文件**（不混入主 `api/index.ts`）。
3. **platform/api/index.ts 分離 UI 邊界**：UI 元件 import 應移至 `platform/api/ui.ts`（獨立文件），主 `api/index.ts` 只暴露能力合約；app/ 消費者需要 UI 元件時從 `platform/api/ui.ts` import。
4. **notion/interfaces/ 長期目標**：subdomain 命名方式可以接受，但需在 README 中明確標注為「subdomain-grouped interfaces」，避免與 workspace/platform 的「tech-layer interfaces（web/、api/）」混淆。

## Consequences

正面：
- 消費者清楚分辨「能力合約 import（`from platform/api`）」與「UI 元件 import（`from platform/api/ui`）」。
- 修改 platform UI 元件不會影響跨模組能力合約的版本穩定性。

代價：
- 需要更新 app/(shell) 中所有從 `platform/api` import UI 元件的文件，改為 `platform/api/ui`。
- workspace/api/ui.ts 已是獨立文件，但 platform 目前將 UI 混入 `api/index.ts`，遷移量較大（約 18 個 UI 相關 export）。
